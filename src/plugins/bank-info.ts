import { Message } from 'discord.js';

import { topUserTotals } from '../db/user';
import { Plugin } from './plugin';

const PREFIX = '!!';
const matcher = new RegExp(`${PREFIX}([a-zA-Z]+)( |$)`);

export default function (): Plugin {
  return {
    name: 'bank-info',
    async onMessage({ message, user }) {
      // if (message.content.match('bank')) {
      //   message.reply(`you have ${user.total} coins`);
      // }

      if (isCommand(message) === 'top') {
        const topUsers = await topUserTotals();
        topUsers.forEach((user) => {
          console.log(`${user.name || user._id}: ${user.total}`);
        });
      }
    },
  };
}

function isCommand(message: Message): string | null {
  const match = message.content.match(matcher);
  if (match) {
    return match[1];
  }
  return null;
}
