import * as mysql from 'promise-mysql';

const options = {
  host     : 'localhost',
  user     : 'hyunsub',
  password : 'ekdldkahsem1',
  database : 'hyunsub'
}

export async function createConnection(): Promise<mysql.Connection> {
  return await mysql.createConnection(options);
}