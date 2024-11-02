import { APIEmbed, escapeMarkdown, Message } from 'discord.js';
import * as responsesDb from '../db/responses.js';
import { memberHasAnyRole } from '../utils/members.js';
import { Plugin } from './plugin.js';

const EMBED_COLOR = 0x00b7d1;

export default function ({ adminRoles }: { adminRoles: string[] }): Plugin {
    return {
        name: 'custom-responses',

        async onMessage({ command, member, message }) {
            if (!command) {
                return;
            }

            const isAdmin = memberHasAnyRole(member, adminRoles);

            if (isAdmin) {
                switch (command) {
                    case 'set-response':
                        await setResponse(message);
                        return;
                    case 'show-response':
                        await showResponse(message);
                        return;
                    case 'list-responses':
                        await listResponses(message);
                        return;
                    case 'delete-response':
                        await deleteResponse(message);
                        return;
                }
            }

            const response = responsesDb.getResponse(command);
            if (response) {
                const embed: APIEmbed = {
                    title: response.title,
                    color: EMBED_COLOR,
                    description: response.body,
                };
                await message.channel.send({ embeds: [embed] });
            }
        },
    };
}

async function setResponse(message: Message) {
    const [commandLine, ...bodyLines] = message.content.split('\n');
    const [_, target, ...titleWords] = commandLine!.split(' ');

    if (!target || titleWords.length === 0) {
        await message.reply('Invalid !set-response: Missing target or title');
        return;
    }

    responsesDb.setResponse({
        command: target.toLowerCase(),
        title: titleWords.join(' '),
        body: bodyLines.join('\n'),
    });

    await message.reply(`!${target.toLowerCase()} saved`);
}

async function showResponse(message: Message): Promise<void> {
    const [_, target] = message.content.split(/\s+/, 3);
    if (!target) {
        await message.reply('Please specify the response to show: `!show-response some-response-name`');
        return;
    }

    const response = responsesDb.getResponse(target.toLowerCase());

    if (response) {
        await message.reply('```\n' + escapeMarkdown(response.title) + '\n' + escapeMarkdown(response.body) + '\n```');
    } else {
        await message.reply('Response not found');
    }
}

async function listResponses(message: Message): Promise<void> {
    const responses = responsesDb.getResponses();
    if (!responses.length) {
        await message.reply('No responses found');
    } else {
        await message.reply(responses.map((r) => `- ${r.command}`).join('\n'));
    }
}

async function deleteResponse(message: Message): Promise<void> {
    const [_, target] = message.content.split(' ', 3);
    if (!target) {
        await message.reply('Please specify the response to delete: `!delete-response some-response-name`');
        return;
    }
    const success = responsesDb.deleteResponse(target.toLowerCase());
    await message.reply(success ? 'Response deleted' : 'Response not found');
}
