import { Client, Events, GatewayIntentBits, Options, Partials } from 'discord.js';
import 'dotenv/config';
import { exit } from 'process';
import { deleteUser } from './db/users.js';
import log from './log.js';
import devPlugins from './plugins.dev.js';
import prodPlugins from './plugins.js';
import { Plugin } from './plugins/plugin.js';
import { getMessageData } from './utils/messages.js';

process.on('unhandledRejection', (reason: string, p: Promise<any>) => {
    log('Unhandled Rejection at:', p, 'reason:', reason);
});

const { DISCORD_BOT_TOKEN, USE_DEV_PLUGINS } = process.env;

if (!DISCORD_BOT_TOKEN) {
    console.error('Missing DISCORD_BOT_TOKEN');
    exit(1);
}

const plugins = USE_DEV_PLUGINS === 'true' ? devPlugins : prodPlugins;

log(`Loaded ${plugins.length} plugins`);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message],
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        MessageManager: 10_000, // cache last 10k messages for deletion log
    }),
});

client.on(Events.ClientReady, async () => {
    log(`Logged in as ${client.user?.tag}`);

    await forEachPlugin(async (plugin) => await plugin.onReady?.(client));
});

client.on(Events.MessageCreate, async (message) => {
    const messageData = getMessageData(message);
    if (!messageData) {
        return;
    }

    await forEachPlugin(async (plugin) => await plugin.onMessage?.(messageData));
});

client.on(Events.MessageDelete, async (message) => {
    if (message.partial) {
        log(`Message ${message.id} was deleted but was a partial`);
        return;
    }
    const messageData = getMessageData(message);
    if (!messageData) {
        return;
    }

    await forEachPlugin(async (plugin) => await plugin.onMessageDelete?.(messageData));
});

client.on(Events.MessageBulkDelete, async (messages) => {
    const messagesList = [...messages.values()].filter(
        (message) => !message.partial && !message.system && !message.author.bot && message.inGuild()
    );
    if (messagesList.length === 0) {
        return;
    }
    const guild = messagesList[0]?.guild;
    if (!guild) {
        return;
    }
    await forEachPlugin(async (plugin) => await plugin.onMessageBulkDelete?.({ guild, messages: messagesList }));
});

client.on(Events.GuildMemberRemove, (member) => deleteUser(member.id));

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
