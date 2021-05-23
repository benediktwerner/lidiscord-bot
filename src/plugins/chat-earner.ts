import { differenceInSeconds } from 'date-fns';
import { TextChannel } from 'discord.js';
import log from '../lib/log';

import { Plugin } from './plugin';

export default function (channelExcludes: string[], period: number): Plugin {
  return {
    name: 'chat-earner',
    channelExcludes,

    async onMessage({ message, user, updateUser }) {
      const secondsSinceLastChat = user.lastEarning
        ? differenceInSeconds(new Date(), user.lastEarning)
        : period;

      const chance = secondsSinceLastChat / period;
      const luck = Math.random();

      if (chance > luck) {
        const newTotal = user.total + 10;
        updateUser({
          ...user,
          lastEarning: new Date(message.createdTimestamp),
          earnings: user.earnings + 10,
          total: newTotal,
        });
        log(
          `${message.author.username} earnt 10 in ${
            (message.channel as TextChannel).name || 'unknown'
          }, they now have ${newTotal}`
        );
      }
    },
  };
}
