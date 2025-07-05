import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { exit } from 'process';
import log from '../log.js';

const SCHEMA_VERSION = 3;

export const db = new Database('sqlite.db');
db.pragma('journal_mode = WAL');

createTables();

function createTables() {
    let schema_version = db.pragma('user_version', { simple: true }) as number;

    if (schema_version === 0) {
        log('Initializing tables');
        db.transaction(() => {
            db.exec(readFileSync('migrations/schema.sql', 'utf-8'));
            db.pragma(`user_version = ${SCHEMA_VERSION}`);
        })();
        return;
    } else if (schema_version === SCHEMA_VERSION) {
        return;
    } else if (schema_version > SCHEMA_VERSION) {
        console.error(
            `DB schema version is ${schema_version} which is higher than the latest known version (${SCHEMA_VERSION})`
        );
        exit(1);
    }

    log(`DB schema version is ${schema_version}. Migrating up to ${SCHEMA_VERSION}.`);

    while (schema_version < SCHEMA_VERSION) {
        db.transaction(() => {
            schema_version += 1;
            const schema = readFileSync(`migrations/${schema_version}.sql`, 'utf-8');
            db.exec(schema);
            db.pragma(`user_version = ${SCHEMA_VERSION}`);
        })();
    }
}
