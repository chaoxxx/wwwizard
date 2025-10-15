import { app } from 'electron';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// 确保数据库目录存在
const dbPath = `${app.getPath('userData')}/userinfo.db`;
let dbInstance = null; // 存储单例实例

export async function initDatabase() {
  if (dbInstance) return dbInstance; // 已存在则复用
  
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  // 仅首次初始化时执行建表
  await db.run(`
    CREATE TABLE IF NOT EXISTS user_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      id_card TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  dbInstance = db; // 保存实例
  return db;
}


// 保存用户信息
export async function saveUserInfo(data) {
  const db = await initDatabase();
  try {
    const result = await db.run(
      'INSERT INTO user_info (name, age, id_card) VALUES (?, ?, ?)',
      [data.name, data.age, data.id_card]
    );
    return result;
  } finally {
    await db.close(); // 无论成功/失败，都关闭连接
  }
}