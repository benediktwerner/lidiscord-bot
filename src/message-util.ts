import { Guild, GuildChannel, GuildMember, Message } from 'discord.js';
import { User } from './db/user';
import log from './lib/log';

export type MessageData = {
  message: Message;
  user: User;
  guild: Guild;
  channel: GuildChannel;
  member: GuildMember;
};

export function getMessageData(
  message: Message,
  user: User
): MessageData | null {
  const guild = message.guild;
  if (!guild) {
    log('ERROR: No guild on message');
    return null;
  }

  const member = guild.members.resolve(message.author.id);
  if (!member) {
    log('ERROR: No member in guild');
    return null;
  }

  const channel = guild.channels.resolve(message.channel.id);
  if (!channel) {
    log('ERROR: No channel in guild');
    return null;
  }

  return {
    message,
    user,
    guild,
    channel,
    member,
  };
}

const PREFIX = '!!';
const matcher = new RegExp(`${PREFIX}([a-zA-Z]+)( |$)`);

export function isCommand(message: Message): string | null {
  const match = message.content.match(matcher);
  if (match) {
    return match[1];
  }
  return null;
}
