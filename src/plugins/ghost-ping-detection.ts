import { Plugin } from './plugin';

export default function ({ logChannel }: { logChannel: string }): Plugin {
  return {
    name: 'ghost-ping-detection',

    async onMessageDelete({ message, channel, guild }) {
      const mentions = Array.from(message.mentions.users.values()).map(
        (x) => x.username
      );

      const target = guild.channels.cache.get(logChannel);
      if (target?.isText()) {
        target.send(
          `${message.author.username} deleted a message in ${
            channel.name
          } that mentions ${mentions.join(', ')}`
        );
      }
    },
  };
}
