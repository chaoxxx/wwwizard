import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import url from 'node:url';
import { isMainThread } from 'worker_threads'; // 可选，处理工作线程场景
import { fileURLToPath } from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义数据库配置接口
interface DBConfig {
  path: string;
  migrationsDir: string;
  systemTablesSqlPath?: string; // 新增：系统表SQL文件路径
  initialData: {
    roles: Array<{
      id: number;
      name: string;
      description: string;
    }>;
  };
}

// 迁移记录接口
interface MigrationRecord {
  id: number;
  name: string;
  executed_at: string;
}

// 默认配置
const DEFAULT_CONFIG: DBConfig = {
  path: path.resolve(__dirname, 'wwwizard.db'),
  migrationsDir: path.resolve(__dirname, 'migrations'),
  systemTablesSqlPath: path.resolve(__dirname, 'wwwizard.sql'), // 默认系统表SQL文件路径
  initialData: {
    roles: [
      { id: 1, name: 'admin', description: '系统管理员' },
      { id: 2, name: 'user', description: '普通用户' }
    ]
  }
};

/**
 * 数据库初始化类
 */
class DBInitializer {
  private config: DBConfig;
  private db: Database.Database | null = null;

  constructor(config: Partial<DBConfig> = {}) {
    // 合并配置，使用默认值填充缺失项
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      initialData: {
        ...DEFAULT_CONFIG.initialData,
        ...config.initialData
      }
    };
  }

  /**
   * 初始化数据库主方法
   */
  initialize(): void {
    try {
      // 确保数据库目录存在
      this.ensureDirectoryExists(path.dirname(this.config.path));
      
      // 连接数据库
      this.connect();
      
      // 创建必要的系统表（从SQL文件加载）
      this.createSystemTablesFromSqlFile();
      
      // 执行迁移文件
      this.runMigrations();
      
      // 插入初始数据
      this.insertInitialData();
      
      console.log('数据库初始化完成！');
    } catch (error) {
      console.error('数据库初始化失败:', error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      // 关闭数据库连接
      this.close();
    }
  }

  /**
   * 确保目录存在，不存在则创建
   */
  private ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
      console.log(`创建目录: ${directory}`);
    }
  }

  /**
   * 连接数据库
   */
  private connect(): void {
    this.db = new Database(this.config.path, {
      verbose: (message) => console.log(`SQL: ${message}`)
    });
    console.log(`已连接到数据库: ${this.config.path}`);
    
    // 启用外键约束
    this.db.pragma('foreign_keys = OFF');
  }

  /**
   * 从SQL文件创建系统表
   */
  private createSystemTablesFromSqlFile(): void {
    if (!this.db) {
      throw new Error('数据库未连接');
    }

    const sqlFilePath = this.config.systemTablesSqlPath;
    
    // 检查SQL文件是否存在
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`系统表SQL文件不存在: ${sqlFilePath}`);
    }

    try {
      // 读取SQL文件内容
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      
      // 执行SQL语句（支持多语句）
      this.db.exec(sqlContent);
      console.log(`已从文件执行系统表创建: ${sqlFilePath}`);
    } catch (error) {
      console.error('执行系统表SQL失败:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * 执行迁移文件
   */
  private runMigrations(): void {
    if (!this.db) {
      throw new Error('数据库未连接');
    }

    // // 确保迁移目录存在
    // this.ensureDirectoryExists(this.config.migrationsDir);
    
    // // 获取已执行的迁移
    // const executedMigrations = this.db.prepare(`
    //   SELECT name FROM migrations
    // `).all() as Array<{ name: string }>;
    
    // const executedNames = executedMigrations.map(row => row.name);
    
    // // 读取迁移目录中的所有文件
    // let migrationFiles: string[] = [];
    // try {
    //   migrationFiles = fs.readdirSync(this.config.migrationsDir)
    //     .filter(file => file.endsWith('.sql') && !executedNames.includes(file))
    //     .sort(); // 按文件名排序，确保执行顺序
    // } catch (error) {
    //   console.error('读取迁移目录失败:', error instanceof Error ? error.message : String(error));
    //   return;
    // }
    
    // if (migrationFiles.length === 0) {
    //   console.log('没有需要执行的迁移文件');
    //   return;
    // }
    
    // // 开始事务执行迁移
    // const transaction = this.db.transaction((files: string[]) => {
    //   for (const file of files) {
    //     const filePath = path.join(this.config.migrationsDir, file);
    //     const sql = fs.readFileSync(filePath, 'utf8');
        
    //     // 执行迁移SQL
    //     this.db!.exec(sql);
        
    //     // 记录迁移
    //     this.db!.prepare(`
    //       INSERT INTO migrations (name) VALUES (?)
    //     `).run(file);
        
    //     console.log(`执行迁移: ${file}`);
    //   }
    // });
    
    // // 执行事务
    // transaction(migrationFiles);
    // console.log(`共执行了 ${migrationFiles.length} 个迁移文件`);
  }

  /**
   * 插入初始数据
   */
  private insertInitialData(): void {
    if (!this.db) {
      throw new Error('数据库未连接');
    }

    // 插入初始角色数据（如果不存在）
    // const roleCount = this.db.prepare(`SELECT COUNT(*) as count FROM roles`).get() as { count: number };
    
    // if (roleCount.count === 0) {
    //   const insertRole = this.db.prepare(`
    //     INSERT INTO roles (id, name, description)
    //     VALUES (@id, @name, @description)
    //   `);
      
    //   const insertRoles = this.db.transaction((roles: DBConfig['initialData']['roles']) => {
    //     for (const role of roles) {
    //       insertRole.run(role);
    //     }
    //   });
      
    //   insertRoles(this.config.initialData.roles);
    //   console.log(`插入了 ${this.config.initialData.roles.length} 条初始角色数据`);
    // } else {
    //   console.log('角色表已有数据，跳过初始数据插入');
    // }
  }

  /**
   * 关闭数据库连接
   */
  private close(): void {
    if (this.db) {
      this.db.close();
      console.log('数据库连接已关闭');
      this.db = null;
    }
  }
}

// 判断当前模块是否是主模块
const isMainModule = () => {
  if (!isMainThread) return false; // 排除工作线程
  const mainPath = process.argv[1]; // 获取 Node.js 执行的入口文件路径
  const currentPath = fileURLToPath(import.meta.url); // 当前模块的文件路径
  return mainPath === currentPath;
};

// 执行初始化
if (isMainModule()) {
  const initializer = new DBInitializer();
  initializer.initialize();
}

export { DBInitializer, DBConfig, DEFAULT_CONFIG };