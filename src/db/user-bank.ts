import Datastore from 'nedb-promises';

let db = Datastore.create('data/userbank.db');

export type UserBank = {
  _id: string;
  total: number;
  earnings: number;
  gambling: number;
  lastEarning: Date | null;
};

export async function loadUserBank(id: string): Promise<UserBank> {
  const raw = await db.findOne<Partial<UserBank> | null>({ _id: id });
  return {
    total: 0,
    earnings: 0,
    gambling: 0,
    lastEarning: null,
    ...(raw || {
      _id: id,
    }),
  };
}

export async function saveUserBank(userBank: UserBank): Promise<void> {
  await db.update({ _id: userBank._id }, userBank, { upsert: true });
}
