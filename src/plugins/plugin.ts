import { MessageData } from '../utils/messages.js';

export type Plugin = {
    name: string;

    onMessage?(data: MessageData): Promise<void>;
    onMessageDelete?(data: MessageData): Promise<void>;
};
