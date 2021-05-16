import { Message } from 'discord.js';

export type Plugin = {
  onMessage?(msg: Message): Promise<void>;
};
