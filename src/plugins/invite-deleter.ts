import { Message } from 'discord.js';

import { Plugin } from './plugin';

const plugin: Plugin = {
  async onMessage(msg: Message) {
    if (isInvite(msg)) {
      await msg.reply('Sorry, no invites here, try #promotion');
      await msg.delete();
    }
  },
};

function isInvite(msg: Message) {
  return (
    msg.content.includes('discordapp.com/invite') ||
    msg.content.includes('discord.gg/')
  );
}

export default plugin;
