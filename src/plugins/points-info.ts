import { isCommand } from '../message-util';
import { Plugin } from './plugin';

export default function ({
  includeChannels,
}: {
  includeChannels: string[];
}): Plugin {
  return {
    name: 'points-info',
    async onMessage({ channel, message, user }) {
      if (!includeChannels.includes(channel.id)) {
        return;
      }

      const command = isCommand(message);

      if (command === 'points') {
        message.reply(`you have ${user.points} points`);
      }
    },
  };
}
