import { db } from './db.js';

export type LogMessage = {
    messageId: string;
    timestamp: number; // in milliseconds
};

export function saveLogMessage(messageId: string, timestamp?: number): void {
    db.prepare('INSERT INTO logMessages (messageId, timestamp) VALUES ($messageId, $timestamp)').run({
        messageId,
        timestamp: timestamp ?? +new Date(),
    });
}

export function hasLogMessages(): boolean {
    return db.prepare('SELECT count(*) > 0 FROM logMessages').pluck().get() as boolean;
}

export function getLogMessagesOlderThan(maxTimestamp: number): LogMessage[] {
    const result = db.prepare('SELECT * FROM logMessages WHERE timestamp < $maxTimestamp').all({ maxTimestamp }) as
        | LogMessage[]
        | undefined;
    return result ? result : [];
}

export function deleteLogMessages(ids: string[]) {
    const params = new Array(ids.length).fill('?').join(', ');
    db.prepare('DELETE FROM logMessages WHERE messageId IN (' + params + ')').run(ids);
}
