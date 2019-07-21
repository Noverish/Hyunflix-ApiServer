import { createConnection } from './';

export async function getUser(id: string) {
  const conn = await createConnection();
  const query = 'SELECT * FROM users WHERE id = ?';
  const result = await conn.query(query, [id]);
  if (result.length > 0) {
    return result[0];
  }
  return null;

}

export async function addUser(id: string, password: string, registerCode: string) {
  const conn = await createConnection();
  const query = `
    UPDATE users
    SET id = ?, password = ?, register_date = NOW()
    WHERE register_code = ?`;
  await conn.query(query, [id, password, registerCode]);
  const result = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
  return result[0];
}

export async function validateRegisterCode(registerCode: string) {
  const conn = await createConnection();
  const result = await conn.query('SELECT * FROM users WHERE register_code = ?', [registerCode]);
  return result.length > 0;
}

export async function alreadyRegistered(registerCode: string) {
  const conn = await createConnection();
  const result = await conn.query('SELECT id FROM users WHERE register_code = ?', [registerCode]);
  return result[0]['id'] !== null;
}