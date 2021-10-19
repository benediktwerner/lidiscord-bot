import { Message, MessageEmbed } from 'discord.js';
import { loadResponse, saveResponse } from '../db/response';
import { memberHasAnyRole } from '../plugin-restrictions';
import { Plugin } from './plugin';

export default function ({ adminRoles }: { adminRoles: string[] }): Plugin {
  return {
    name: 'custom-responses',
    async onMessage({ command, member, message }) {
      const isAdmin = memberHasAnyRole(member, adminRoles);

      if (isAdmin && command === 'set-response') {
        return await setResponse(message);
      }

      if (isAdmin && command === 'set-response-colour') {
        return await setResponseColour(message);
      }

      if (isAdmin && command === 'show-response') {
        return await showResponse(message);
      }

      if (command) {
        const response = await loadResponse(command);
        if (response) {
          const embed = new MessageEmbed()
            .setTitle(response.title)
            .setColor(response.colour)
            .setDescription(response.body);
          await message.channel.send({ embeds: [embed] });
        }
      }
    },
  };
}

async function setResponse(message: Message): Promise<void> {
  const [commandLine, ...bodyLines] = message.content.split('\n');
  const [_, target, ...titleWords] = commandLine.split(' ');

  await saveResponse({
    _id: target.toLowerCase(),
    title: titleWords.join(' '),
    body: bodyLines.join('\n'),
    colour: 0x00b7d1,
  });

  await message.reply(`!${target.toLowerCase()} saved`);
}

async function setResponseColour(message: Message): Promise<void> {
  const [_, target, colour] = message.content.split(' ', 3);
  const response = await loadResponse(target.toLowerCase());

  if (response) {
    await saveResponse({
      ...response,
      colour: +colour,
    });
    await message.reply(`!${target.toLowerCase()} colour saved`);
  } else {
    await message.reply('no response found');
  }
}

async function showResponse(message: Message): Promise<void> {
  const [_, target] = message.content.split(' ', 3);
  const response = await loadResponse(target.toLowerCase());

  if (response) {
    await message.channel.send(
      '```\n' + response.title + '\n' + response.body + '\n```'
    );
  } else {
    await message.reply('no response found');
  }
}
