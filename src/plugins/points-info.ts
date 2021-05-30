import { Plugin } from './plugin';

export default function ({
  includeChannels,
}: {
  includeChannels: string[];
}): Plugin {
  return {
    name: 'points-info',
    async onMessage({ channel, command, message, user }) {
      if (!includeChannels.includes(channel.id)) {
        return;
      }

      if (command === 'points') {
        message.reply(`you have ${user.points} points`);
      }
    },
  };
}
