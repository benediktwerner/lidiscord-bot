import { Plugin } from './plugin';

const plugin: Plugin = {
  name: 'parrot',
  async onMessage({ message }) {
    if (message.content.startsWith('hi')) {
      return new Promise((res) => {
        setTimeout(() => {
          message.reply('hi');
          res();
        }, 1000);
      });
    }
  },
};

export default plugin;
