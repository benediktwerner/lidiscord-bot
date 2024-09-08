import { MessageData } from '../utils/messages.ts';

export type Plugin = {
    name: string;

    onMessage?(data: MessageData): Promise<void>;
    onMessageDelete?(data: MessageData): Promise<void>;
};
