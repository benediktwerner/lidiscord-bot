import log from '../lib/log';
import { Plugin } from './plugin';

export default function (): Plugin {
  return {
    name: 'name-updater',

    onMessage({ message, user, updateUser }) {
      if (message.author.username !== user.name) {
        log(`${user.name} is now known as ${message.author.username}`);
        updateUser({
          ...user,
          name: message.author.username,
        });
      }
      return Promise.resolve();
    },
  };
}
