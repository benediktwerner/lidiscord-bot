import { Plugin } from './plugin';

const plugin: Plugin = {
  name: 'bank-info',
  async onMessage({ message, user }) {
    if (message.content.match('!!bank')) {
      message.reply(`you have ${user.total} coins`);
    }
  },
};

export default plugin;
