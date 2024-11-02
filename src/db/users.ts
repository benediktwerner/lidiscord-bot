import log from '../log.js';
import { db } from './db.js';

export type User = {
    id: string;
    name: string;
    points: number;
    lastPointsTimestamp: number;
    awardedRoleIds: string; // comma separated
};

export function createUser(id: string, name: string): User {
    return db
        .prepare(
            "INSERT INTO users (id, name, points, lastPointsTimestamp, awardedRoleIds) VALUES ($id, $name, 0, 0, '') RETURNING *"
        )
        .get({ id, name }) as User;
}

export function deleteUser(id: string) {
    const user = db.prepare('DELETE FROM users WHERE id = $id RETURNING *').get({ id }) as User;
    log(`Deleted user ${id}: ${JSON.stringify(user)}`);
}

export function addPoints(id: string, amount: number): number {
    return db
        .prepare(
            'UPDATE users SET points = points + $amount, lastPointsTimestamp = $now WHERE id = $id RETURNING points'
        )
        .pluck()
        .get({
            id,
            amount,
            now: +new Date(),
        }) as number;
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
