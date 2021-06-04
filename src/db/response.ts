import Datastore from 'nedb-promises';

let db = Datastore.create('data/response.db');

type ResponseRecord = Response;

export type Response = {
  _id: string;
  title: string;
  colour: number;
  body: string;
};

export async function loadResponse(id: string): Promise<Response | null> {
  const record = await db.findOne<ResponseRecord | null>({ _id: id });
  return record || null;
}

export async function saveResponse(response: Response): Promise<void> {
  await db.update<ResponseRecord>({ _id: response._id }, response, {
    upsert: true,
  });
}
