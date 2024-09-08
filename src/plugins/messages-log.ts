import log from '../log.ts';
import { Plugin } from './plugin';

export default function ({ logChannel }: { logChannel: string }): Plugin {
    return {
        name: 'messages-log',

        async onMessageDelete({ message, channel, guild }) {
            const target = guild.channels.cache.get(logChannel);

            if (!target) {
                log(`ERROR: Message log channel not found: ${logChannel}`);
                return;
            }

            if (!target.isTextBased()) {
                log(`ERROR: Message log channel is not a text based channel: ${logChannel}`);
                return;
            }

            // target.send(
            //     `Message from ${message.author.username} in ${channel.name} that mentions ${mentions.join(
            //         ', '
            //     )} was deleted`
            // );
        },
    };
}
