import log from '../log.js';
import { db } from './db.js';

export type User = {
    id: string;
    name: string;
    firstActivityTimestamp: number;
    messageCount: number;
    awardedRoleIds: string; // comma separated
};

export function createUser(id: string, name: string): User {
    return db
        .prepare(
            "INSERT INTO users (id, name, firstActivityTimestamp, messageCount, awardedRoleIds) VALUES ($id, $name, $now, 0, '') RETURNING *"
        )
        .get({ id, name, now: +new Date() }) as User;
}

export function deleteUser(id: string) {
    const user = db.prepare('DELETE FROM users WHERE id = $id RETURNING *').get({ id }) as User;
    log(`Deleted user ${id}: ${JSON.stringify(user)}`);
}

export function addMessage(id: string): number {
    return db
        .prepare('UPDATE users SET messageCount = messageCount + 1 WHERE id = $id RETURNING messageCount')
        .pluck()
        .get({ id }) as number;
}

export function updateName(id: string, name: string) {
    db.prepare('UPDATE users SET name = $name WHERE id = $id').run({ id, name });
}

export function getUser(id: string): User | null {
    const result = db.prepare('SELECT * FROM users WHERE id = $id').get({ id }) as User;
    return result ? result : null;
}

export function updateAwardedRoles(id: string, roleIds: string) {
    db.prepare('UPDATE users SET awardedRoleIds = $roleIds WHERE id = $id').run({ id, roleIds });
}
