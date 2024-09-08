import { Client, GatewayIntentBits, Partials } from 'discord.js';
import 'dotenv/config';
import { exit } from 'process';
import log from './log.ts';
import plugins from './plugins.ts';
import { Plugin } from './plugins/plugin.ts';
import { getMessageData } from './utils/messages.ts';

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
    console.error('Missing DISCORD_BOT_TOKEN');
    exit(1);
}

log(`Loaded ${plugins.length} plugins`);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Message],
});

client.on('ready', () => {
    log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', async (message) => {
    const messageData = getMessageData(message);
    if (!messageData) {
        return;
    }

    await forEachPlugin(async (plugin) => plugin.onMessage?.(messageData));
});

client.on('messageDelete', async (message) => {
    if (message.partial) {
        log(`Message ${message.id} was deleted but was a partial`);
        return;
    }
    const messageData = getMessageData(message);
    if (!messageData) {
        return;
    }

    await forEachPlugin(async (plugin) => plugin.onMessageDelete?.(messageData));
});

client.login(DISCORD_BOT_TOKEN);

async function forEachPlugin(fn: (plugin: Plugin) => Promise<void>) {
    for (let plugin of plugins) {
        try {
            await fn(plugin);
        } catch (e) {
            log(`ERROR: Plugin ${plugin.name} failed`, e);
        }
    }
}
