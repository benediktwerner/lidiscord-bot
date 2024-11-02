import { Guild, GuildChannel, GuildMember, Message, ThreadChannel } from 'discord.js';
import { createUser, getUser, User } from '../db/users.js';
import log from '../log.js';

export type MessageData = {
    message: Message<true>;
    guild: Guild;
    channel: GuildChannel | ThreadChannel;
    member: GuildMember;
    user: User;
    command: string | null;
};

export function getMessageData(message: Message): MessageData | null {
    if (message.author.bot || message.system || !message.inGuild()) {
        // Skip bot and system messages
        return null;
    }

    const guild = message.guild;
    if (!guild) {
        log('ERROR: No guild on message');
        return null;
    }

    const member = guild.members.resolve(message.author.id);
    if (!member) {
        log('ERROR: No member in guild');
        return null;
    }

    const channel = guild.channels.resolve(message.channel.id);
    if (!channel) {
        log('ERROR: No channel in guild');
        return null;
    }

    let user = getUser(message.author.id);
    if (!user) {
        user = createUser(message.author.id, message.author.username);
    }

    return {
        message,
        guild,
        user,
        channel,
        member,
        command: extractCommand(message),
    };
}

const COMMAND_PREFIX = '!';
const matcher = new RegExp(`^${COMMAND_PREFIX}([a-zA-Z-]+)(?: |$)`);

function extractCommand(message: Message): string | null {
    const match = message.content.match(matcher);
    if (match && match[1]) {
        return match[1].toLowerCase();
    }
    return null;
}
