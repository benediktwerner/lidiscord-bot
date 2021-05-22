import { Plugin } from './plugin';

export default function (): Plugin {
  return {
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
}
