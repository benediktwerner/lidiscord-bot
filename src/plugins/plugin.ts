import { Client } from 'discord.js';
import { MessageData } from '../utils/messages.js';

export type Plugin = {
    name: string;

    onReady?(client: Client): Promise<void>;
    onMessage?(data: MessageData): Promise<void>;
    onMessageDelete?(data: MessageData): Promise<void>;
};
