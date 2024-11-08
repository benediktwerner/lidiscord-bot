import { ChannelManager, Client, Colors, EmbedBuilder, GuildMember, Message, User } from 'discord.js';
import {
    deleteLogMessages,
    getLogMessagesOlderThan,
    hasLogMessages,
    saveLogMessage,
} from '../db/deletedMessagesLog.js';
import log from '../log.js';
import { Plugin } from './plugin.js';

const LOG_MESSAGE_LIFETIME_IN_MILLIS = 7 * 24 * 60 * 60 * 1000; // 1 week
const MAX_AGE_FOR_BULK_DELETE_MILLIS = 13 * 24 * 60 * 60 * 1000; // 13 days (14 days is the hard-limit)
const CLEANUP_INTERVAL_MILLIS = 1 * 60 * 60 * 1000; // 1 hour
const MAX_BULK_DELETE_COUNT = 100;

function resolveLogChannel(channels: ChannelManager, logChannelName: string) {
    const channel = channels.resolve(logChannelName);

    if (!channel) {
        log(`ERROR: Message log channel not found: ${logChannelName}`);
        return null;
    }

    if (!channel.isTextBased()) {
        log(`ERROR: Message log channel is not a text based channel: ${logChannelName}`);
        return null;
    }

    if (channel.isDMBased()) {
        log(`ERROR: Message log channel is not a guild channel: ${logChannelName}`);
        return null;
    }

    return channel;
}

async function deleteOldLogMessages(client: Client, logChannelName: string) {
    const messagesToDelete = getLogMessagesOlderThan(+new Date() - LOG_MESSAGE_LIFETIME_IN_MILLIS);
    if (messagesToDelete.length === 0) {
        return;
    }

    log(`Deleting ${messagesToDelete.length} log messages`);

    const logChannel = resolveLogChannel(client.channels, logChannelName);
    if (!logChannel) {
        return;
    }

    const minTimestampBulkDelete = +new Date() - MAX_AGE_FOR_BULK_DELETE_MILLIS;

    // Delete messages in bulk if possible (younger than 14 days)
    const idsToDeleteBulk = messagesToDelete
        .filter((logMessage) => logMessage.timestamp >= minTimestampBulkDelete)
        .map((logMessage) => logMessage.messageId);
    for (let i = 0; i < idsToDeleteBulk.length; i += MAX_BULK_DELETE_COUNT) {
        const ids = idsToDeleteBulk.slice(i, i + MAX_BULK_DELETE_COUNT);
        await logChannel.bulkDelete(ids);
        deleteLogMessages(ids);
    }

    // Delete older messages individually
    const idsToDeleteIndividually = messagesToDelete
        .filter((logMessage) => logMessage.timestamp < minTimestampBulkDelete)
        .map((logMessage) => logMessage.messageId);
    for (const id of idsToDeleteIndividually) {
        await logChannel.messages.delete(id);
    }
    deleteLogMessages(idsToDeleteIndividually);
}

async function fillLogMessagesDb(client: Client, logChannelName: string) {
    const logChannel = resolveLogChannel(client.channels, logChannelName);
    if (!logChannel) {
        return;
    }

    const messages = await logChannel.messages.fetch({ limit: 100 });
    messages.forEach((message) => {
        if (message.author.id === client.user?.id) {
            saveLogMessage(message.id, message.createdTimestamp);
        }
    });
}

function formatPrimaryUsernames(user: User, member: GuildMember | null): string {
    return member?.nickname ? member?.nickname + ' • ' + user.displayName : user.displayName;
}

function formatAllUsernames(user: User, member: GuildMember | null): string {
    const usernames: string[] = [];
    if (member?.nickname) {
        usernames.push(member.nickname);
    }
    if (user.globalName && !usernames.includes(user.globalName)) {
        usernames.push(user.globalName);
    }
    if (!usernames.includes(user.username)) {
        usernames.push(user.username);
    }
    if (!usernames.includes(user.tag)) {
        usernames.push(user.tag);
    }
    return usernames.join(' • ');
}

async function logDeletedMessage(
    message: Message<true>,
    logChannel: NonNullable<ReturnType<typeof resolveLogChannel>>
) {
    const embed = new EmbedBuilder()
        .setTitle(`Message deleted in ${message.channel}`)
        .setColor(Colors.Red)
        .setAuthor({
            name: formatPrimaryUsernames(message.author, message.member),
            iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(
            `${message.content}\n\nAuthor: ${message.author} (${formatAllUsernames(message.author, message.member)})`
        )
        .setFooter({ text: `Author ID: ${message.author.id} • Message ID: ${message.id}` })
        .setTimestamp(message.createdAt);
    const logMessage = await logChannel.send({ embeds: [embed] });
    saveLogMessage(logMessage.id);
}

export default function ({ logChannel: logChannelName }: { logChannel: string }): Plugin {
    return {
        name: 'messages-log',

        async onReady(client) {
            if (!hasLogMessages()) {
                await fillLogMessagesDb(client, logChannelName);
            }

            await deleteOldLogMessages(client, logChannelName);

            setInterval(async () => {
                try {
                    await deleteOldLogMessages(client, logChannelName);
                } catch (e) {
                    log(`ERROR: Deleting old log messages failed`, e);
                }
            }, CLEANUP_INTERVAL_MILLIS);
        },

        async onMessageDelete({ message, guild }) {
            const logChannel = resolveLogChannel(guild.channels, logChannelName);
            if (!logChannel) {
                return;
            }
            return await logDeletedMessage(message, logChannel);
        },

        async onMessageBulkDelete({ guild, messages }) {
            const logChannel = resolveLogChannel(guild.channels, logChannelName);
            if (!logChannel) {
                return;
            }

            for (const message of messages.reverse()) {
                if (message.partial || !message.inGuild()) {
                    continue;
                }
                await logDeletedMessage(message, logChannel);
            }
        },
    };
}
