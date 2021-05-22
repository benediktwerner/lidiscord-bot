import { Message } from 'discord.js';
import { User } from '../db/user';

export type Plugin = {
  name: string;
  channelIncludes?: string[];
  channelExcludes?: string[];

  onMessage?(data: {
    message: Message;
    user: User;
    updateUser: (user: User) => void;
  }): Promise<void>;
};
