import Datastore from 'nedb-promises';

let db = Datastore.create('data/userbank.db');

export type User = {
  _id: string;
  total: number;
  earnings: number;
  gambling: number;
  lastEarning: Date | null;
};

export async function loadUser(id: string): Promise<User> {
  const raw = await db.findOne<Partial<User> | null>({ _id: id });
  return Object.freeze({
    total: 0,
    earnings: 0,
    gambling: 0,
    lastEarning: null,
    ...(raw || {
      _id: id,
    }),
  });
}

export async function saveUser(user: User): Promise<void> {
  await db.update({ _id: user._id }, user, { upsert: true });
}
