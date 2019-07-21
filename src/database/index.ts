import * as mysql from 'promise-mysql';
import { mysqlOption } from '../credentials';

export async function createConnection(): Promise<mysql.Connection> {
  return await mysql.createConnection(mysqlOption);
}

export * from './auth';
