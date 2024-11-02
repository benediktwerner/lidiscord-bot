import { db } from './db.js';

export type Response = {
    command: string;
    title: string;
    body: string;
};

export function createResponse(response: Response) {
    db.prepare('INSERT INTO responses (command, title, body) VALUES ($command, $title, $body)').run(response);
}

export function setResponse(response: Response) {
    db.prepare(
        'INSERT INTO responses (command, title, body) VALUES ($command, $title, $body)' +
            'ON CONFLICT(command) DO UPDATE SET title = $title, body = $body'
    ).run(response);
}

export function deleteResponse(command: string): boolean {
    const info = db.prepare('DELETE FROM responses WHERE command = $command').run({ command });
    return info.changes > 0;
}

export function getResponse(command: string): Response {
    return db.prepare('SELECT * FROM responses WHERE command = $command').get({ command }) as Response;
}

export function getResponses(): Response[] {
    return db.prepare('SELECT * FROM responses').all() as Response[];
}
