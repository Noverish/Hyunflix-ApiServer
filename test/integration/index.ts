import { getConnection, createConnection } from 'typeorm';
import * as mysql from 'mysql';

function query(conn: mysql.Connection, sql: string) {
  return new Promise((resolve, reject) => {
    conn.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

let conn: mysql.Connection | null = null;

export async function init() {
  try {
    getConnection();
  } catch (err) {
    conn = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : '',
    });
    conn.connect();
    await query(conn, 'CREATE DATABASE test;');

    console.log('created database');
    process.env.DATABASE_HOST = 'localhost';
    process.env.DATABASE_PASSWORD = '';
    process.env.DATABASE_DATABASE = 'test';
    await createConnection();
  }
}

export async function end() {
  if (conn) {
    await query(conn, 'DROP DATABASE test;');
    conn.end();
    conn = null;
  }
}
