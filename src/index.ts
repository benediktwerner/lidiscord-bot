import { Client } from 'discord.js';
import { exit } from 'process';

import inviteDeleterPlugin from './plugins/invite-deleter';
import chatEarnerPlugin from './plugins/chat-earner';
import bankInfoPlugin from './plugins/bank-info';

require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN');
  exit(1);
}

const client = new Client();

const plugins = [
  // inviteDeleterPlugin,
  chatEarnerPlugin,
  //  bankInfoPlugin
];

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (msg) => {
  if (msg.author.bot) {
    // Skip bot messages
    return;
  }

  // console.log('MESSAGE', msg);

  plugins.forEach((plugin) => {
    if (
      plugin.channelIncludes &&
      !plugin.channelIncludes.includes(msg.channel.id)
    ) {
      return;
    }
    if (
      plugin.channelExcludes &&
      plugin.channelExcludes?.includes(msg.channel.id)
    ) {
      return;
    }

    plugin.onMessage?.(msg);
  });
});

client.login(DISCORD_BOT_TOKEN);
