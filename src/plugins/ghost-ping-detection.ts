import { Plugin } from './plugin';

export default function ({ logChannel }: { logChannel: string }): Plugin {
  return {
    name: 'ghost-ping-detection',

    async onMessageDelete({ message, channel, guild }) {
      const mentions = Array.from(message.mentions.users.values()).map(
        (x) => x.username
      );
      const target = guild.channels.cache.get(logChannel);

      if (mentions.length && target?.isText()) {
        target.send(
          `Message from ${message.author.username} in ${
            channel.name
          } that mentions ${mentions.join(', ')} was deleted`
        );
      }
    },
  };
}
