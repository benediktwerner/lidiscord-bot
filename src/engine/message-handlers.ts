import { Message } from 'discord.js';
import { createUser, loadUser, saveUser, User } from '../db/user';
import { Plugin } from '../plugins/plugin';

export async function withUser(
  message: Message,
  fn: (user: User, updateUser: (newUser: User) => void) => Promise<void>
) {
  let userNeedsSaving = false;
  let user = await loadUser(message.author.id);
  if (!user) {
    user = createUser(message.author.id, message.author.username);
    userNeedsSaving = true;
  }
  const updateUser = (newUser: User) => {
    userNeedsSaving = true;
    user = newUser;
  };

  await fn(user, updateUser);

  if (userNeedsSaving) {
    await saveUser(user);
  }
}

export async function forEachPlugin(
  plugins: Plugin[],
  fn: (plugin: Plugin) => Promise<void>
) {
  for (let plugin of plugins) {
    try {
      await fn(plugin);
    } catch (e) {
      console.error(`Plugin ${plugin.name} failed`, e);
    }
  }
}
