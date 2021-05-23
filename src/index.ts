import { Client } from 'discord.js';
import { exit } from 'process';

import { loadUser, saveUser, User } from './db/user';
import log from './lib/log';
import pluginsProduction from './plugins.production';

require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN');
  exit(1);
}

const client = new Client();

let plugins = pluginsProduction;
try {
  plugins = require('./plugins.local').default;
} catch (e) {}
log(`Loaded ${plugins.length} plugins`);

client.on('ready', () => {
  log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', async (message) => {
  if (message.author.bot) {
    // Skip bot messages
    return;
  }

  let userNeedsSaving = false;
  let user = await loadUser(message.author?.id);
  const updateUser = (newUser: User) => {
    userNeedsSaving = true;
    user = newUser;
  };

  for (let plugin of plugins) {
    if (
      plugin.channelIncludes &&
      !plugin.channelIncludes.includes(message.channel.id)
    ) {
      return;
    }
    if (
      plugin.channelExcludes &&
      plugin.channelExcludes?.includes(message.channel.id)
    ) {
      return;
    }

    try {
      await plugin.onMessage?.({ message, user, updateUser });
    } catch (e) {
      console.error(`Plugin ${plugin.name} failed`, e);
    }
  }

  if (userNeedsSaving) {
    await saveUser(user);
  }
});

client.login(DISCORD_BOT_TOKEN);
