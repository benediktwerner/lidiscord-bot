import { loadUserBank } from '../db/user-bank';
import { Plugin } from './plugin';

const plugin: Plugin = {
  async onMessage(msg) {
    if (msg.content.match('!!bank')) {
      const userBank = await loadUserBank(msg.author.id);
      msg.reply(`you have ${userBank.total} coins`);
    }
  },
};

export default plugin;
