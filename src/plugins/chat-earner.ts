import { differenceInSeconds } from 'date-fns';

import { CHANNEL_DISCORD_GAMES_TRIVIA } from '../channels';
import { loadUserBank, saveUserBank } from '../db/user-bank';
import { Plugin } from './plugin';

const SECONDS_IN_HOUR = 60 * 60;

const plugin: Plugin = {
  channelExcludes: [CHANNEL_DISCORD_GAMES_TRIVIA],

  async onMessage(msg) {
    const userBank = await loadUserBank(msg.author?.id);
    const secondsSinceLastChat = userBank.lastEarning
      ? differenceInSeconds(new Date(), userBank.lastEarning)
      : SECONDS_IN_HOUR;

    const chance = secondsSinceLastChat / SECONDS_IN_HOUR;
    const luck = Math.random();

    if (chance > luck) {
      await saveUserBank({
        ...userBank,
        lastEarning: new Date(msg.createdTimestamp),
        earnings: userBank.earnings + 10,
        total: userBank.total + 10,
      });
      console.log(new Date().toISOString(), `${msg.author.username} earnt 10`);
    }
  },
};

export default plugin;
