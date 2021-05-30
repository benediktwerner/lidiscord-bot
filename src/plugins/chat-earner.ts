import { differenceInSeconds } from 'date-fns';
import { TextChannel } from 'discord.js';

import log from '../lib/log';
import { memberHasAnyRole } from '../plugin-restrictions';
import { Plugin } from './plugin';

export default function ({
  period,
  excludeChannels,
  excludeRoles,
}: {
  period: number;
  excludeChannels: string[];
  excludeRoles: string[];
}): Plugin {
  return {
    name: 'chat-earner',
    async onMessage(
      { channel, command, message, member, user },
      { updateUser }
    ) {
      if (
        memberHasAnyRole(member, excludeRoles) ||
        excludeChannels.includes(channel.id) ||
        command
      ) {
        return;
      }

      const secondsSinceLastChat = user.lastEarning
        ? differenceInSeconds(new Date(), user.lastEarning)
        : period;

      const chance = secondsSinceLastChat / period;
      const luck = Math.random();

      if (chance > luck) {
        const newPoints = user.points + 10;
        updateUser({
          ...user,
          lastEarning: new Date(message.createdTimestamp),
          points: newPoints,
        });
        log(
          `${message.author.username} earnt 10 in ${
            (message.channel as TextChannel).name || 'unknown'
          }, they now have ${newPoints}`
        );
      }
    },
  };
}
