import { getConnection, createConnection } from 'typeorm';

export async function init() {
  try {
    getConnection();
  } catch (err) {
    await createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'hyunflix-api',
      entities: ['src/entity/**/*.ts'],
    });
  }
}
