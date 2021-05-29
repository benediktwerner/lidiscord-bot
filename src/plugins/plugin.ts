import { User } from '../db/user';
import { MessageData } from '../message-util';

export type Plugin = {
  name: string;
  onMessage?(
    data: MessageData,
    actions: {
      updateUser: (user: User) => void;
    }
  ): Promise<void>;
};
