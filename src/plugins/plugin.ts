import { Client, Guild, Message, OmitPartialGroupDMChannel, PartialMessage } from 'discord.js';
import { MessageData } from '../utils/messages.js';

export type Plugin = {
    name: string;

    onReady?(client: Client): Promise<void>;
    onMessage?(data: MessageData): Promise<void>;
    onMessageDelete?(data: MessageData): Promise<void>;
    onMessageBulkDelete?(data: {
        guild: Guild;
        messages: OmitPartialGroupDMChannel<Message | PartialMessage>[];
    }): Promise<void>;
};
