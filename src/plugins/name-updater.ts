import { updateName } from '../db/users.ts';
import log from '../log.ts';
import { Plugin } from './plugin.ts';

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
