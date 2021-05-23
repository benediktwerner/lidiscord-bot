import Datastore from 'nedb-promises';

let db = Datastore.create('data/userbank.db');

export type User = {
  _id: string;
  name: string | null;
  total: number;
  earnings: number;
  gambling: number;
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

export async function topUserTotals(): Promise<User[]> {
  const users = await db.find<Partial<User>>({}).sort({ total: -1 }).limit(10);
  return users.map(expand);
}

function expand(record: Partial<User> & { _id: string }): User {
  return Object.freeze({
    name: null,
    total: 0,
    earnings: 0,
    gambling: 0,
    lastEarning: null,
    rolesAwarded: [],
    ...record,
  });
}
