import * as mysql from 'promise-mysql';
import { mysqlOption } from '../credentials';

export async function createConnection(): Promise<mysql.Connection> {
  return await mysql.createConnection(mysqlOption);
}

import * as auth from './auth';
export const getUser = auth.getUser;
export const addUser = auth.addUser;
export const validateRegisterCode = auth.validateRegisterCode;
