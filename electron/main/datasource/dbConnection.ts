import { app } from 'electron';
import { DBInitializer } from './dbInitializer';
import Database, { type Database as SqliteDatabase } from 'better-sqlite3'; // 显式导入类型
import path from 'node:path';
import elogger from '../util/ElogUtil';

const dataDir = app.getPath('userData');
const dbPath = path.join(dataDir, 'wwwizard.db');


// 初始化数据库（应用启动时执行一次）
const initializer = new DBInitializer({
  path: dbPath
});

try {
  initializer.initialize();
} catch (error) {
  console.error('数据库初始化失败，应用无法启动:', error);
  process.exit(1); // 初始化失败时退出应用
}

// 显式指定类型
export const db: SqliteDatabase = new Database(dbPath, {
  verbose: (message) => elogger.getInstance().info(`SQL: ${message}`)
});

// 导出类型供其他模块使用（可选）
export type { SqliteDatabase };