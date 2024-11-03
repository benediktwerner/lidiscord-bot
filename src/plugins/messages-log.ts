import { APIEmbed, Colors } from 'discord.js';
import log from '../log.js';
import { Plugin } from './plugin.js';

export default function ({ logChannel }: { logChannel: string }): Plugin {
    return {
        name: 'messages-log',

        async onMessageDelete({ message, channel, guild }) {
            const target = guild.channels.resolve(logChannel);

            if (!target) {
                log(`ERROR: Message log channel not found: ${logChannel}`);
                return;
            }

            if (!target.isTextBased()) {
                log(`ERROR: Message log channel is not a text based channel: ${logChannel}`);
                return;
            }

            const usernames: string[] = [];
            let authorName = message.author.displayName;
            if (message.member && message.member.nickname) {
                const nickname = message.member.nickname;
                if (nickname !== authorName) {
                    authorName = nickname + ' • ' + authorName;
                }
                usernames.push(nickname);
            }
            if (message.author.globalName && !usernames.includes(message.author.globalName)) {
                usernames.push(message.author.globalName);
            }
            if (!usernames.includes(message.author.username)) {
                usernames.push(message.author.username);
            }
            if (!usernames.includes(message.author.tag)) {
                usernames.push(message.author.tag);
            }

            const embed: APIEmbed = {
                title: `Message deleted in ${channel}`,
                color: Colors.Red,
                author: { name: authorName, icon_url: message.author.displayAvatarURL() },
                description: `${message.content}\n\nAuthor: ${message.author} (${usernames.join(' • ')})`,
                footer: { text: `Author ID: ${message.author.id} • Message ID: ${message.id}` },
            };
            await target.send({ embeds: [embed] });
        },
    };
}
