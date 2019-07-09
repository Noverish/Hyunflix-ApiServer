import { createConnection } from './';

export async function getUser(username: string) {
  const conn = await createConnection();
  const query = `SELECT * FROM users WHERE username = ?`;
  const result = await conn.query(query, [username]);
  if(result.length > 0) {
    return result[0];
  } else {
    return null;
  }
}

export async function addUser(username: string, password: string, registerCode: string) {
  const conn = await createConnection();
  await conn.query(`UPDATE users SET username = ?, password = ?, register_date = NOW() WHERE register_code = ?`, [username, password, registerCode]);
  const result = await conn.query(`SELECT * FROM users WHERE username = ?`, [username]);
  return result[0];
}

export async function validateRegisterCode(registerCode: string) {
  const conn = await createConnection();
  const result = await conn.query(`SELECT * FROM users WHERE register_code = ?`, [registerCode]);
  return result.length > 0;
}