import { Message } from 'discord.js';

export type Plugin = {
  channelIncludes?: string[];
  channelExcludes?: string[];

  onMessage?(msg: Message): Promise<void>;
};
