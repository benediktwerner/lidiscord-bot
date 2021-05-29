import Datastore from 'nedb-promises';

let db = Datastore.create('data/userbank.db');

export type UserRecord = Partial<User> & {
  _id: string;

  /**
   * @deprecated
   */
  total?: number;
  /**
   * @deprecated
   */
  earnings?: number;
  /**
   * @deprecated
   */
  gambling?: number;
};

export type User = {
  _id: string;
  name: string;
  points: number;
  lastEarning: Date | null;
  rolesAwarded: string[];
};

export async function loadUser(id: string): Promise<User> {
  const record = await db.findOne<Partial<User> | null>({ _id: id });
  return expand(record || { _id: id });
}

export async function saveUser(user: User): Promise<void> {
  await db.update({ _id: user._id }, user, { upsert: true });
}

export async function topUserPoints(): Promise<User[]> {
  const users = await db.find<Partial<User>>({}).sort({ total: -1 }).limit(10);
  return users.map(expand);
}

function expand(record: UserRecord): User {
  return Object.freeze({
    _id: record._id,
    name: record.name || record._id,
    points: record.points || record.earnings || 0,
    lastEarning: record.lastEarning || null,
    rolesAwarded: record.rolesAwarded || [],
  });
}
