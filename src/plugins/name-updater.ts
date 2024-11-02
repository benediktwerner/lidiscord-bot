import { updateName } from '../db/users.js';
import log from '../log.js';
import { Plugin } from './plugin.js';

export default function (): Plugin {
    return {
        name: 'name-updater',

        async onMessage({ message, user }) {
            if (message.author.username !== user.name) {
                log(`${user.name} is now known as ${message.author.username}`);
                updateName(user.id, message.author.username);
            }
        },
    };
}
