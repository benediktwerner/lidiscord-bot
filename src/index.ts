import { Client } from 'discord.js';
import { exit } from 'process';

import { createUser, loadUser, saveUser, User } from './db/user';
import log from './lib/log';
import { getMessageData } from './message-util';
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
  let user = await loadUser(message.author.id);
  if (!user) {
    user = createUser(message.author.id, message.author.username);
    userNeedsSaving = true;
  }
  const updateUser = (newUser: User) => {
    userNeedsSaving = true;
    user = newUser;
  };

  const messageData = getMessageData(message, user);
  if (!messageData) {
    return;
  }

  for (let plugin of plugins) {
    try {
      await plugin.onMessage?.(messageData, { updateUser });
    } catch (e) {
      console.error(`Plugin ${plugin.name} failed`, e);
    }
  }

  if (userNeedsSaving) {
    log(`Saving ${user.name}`);
    await saveUser(user);
  }
});

client.login(DISCORD_BOT_TOKEN);
