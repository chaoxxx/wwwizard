import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

// 定义数据存储路径
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = app.getPath('userData'); // 获取系统默认的用户数据目录
const dataPath = path.join(dataDir, 'userInfo.json');
console.log('Data file path:', dataPath);
// 定义用户数据类型
export interface UserInfo {
  id: string;
  name: string;
  age: number;
  id_card: string;
  created_at: string;
}

// 初始化数据文件（如果不存在则创建）
async function initDataFile() {
  try {
    // 检查目录是否存在，不存在则创建
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    // 检查文件是否存在，不存在则创建空数组
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, JSON.stringify([], null, 2), 'utf8');
  }
}

// 读取所有用户信息
async function readAllUsers(): Promise<UserInfo[]> {
  await initDataFile();
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data) as UserInfo[];
}

// 保存用户信息
export async function saveUserInfo(data: {
  name: string;
  age: number;
  id_card: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // 初始化数据文件
    await initDataFile();
    
    // 读取现有数据
    const users = await readAllUsers();
    
    // 检查身份证号是否已存在
    const exists = users.some(user => user.id_card === data.id_card);
    if (exists) {
      return { success: false, message: '该身份证号已存在' };
    }
    
    // 创建新用户数据
    const newUser: UserInfo = {
      id: Date.now().toString(), // 使用时间戳作为唯一ID
      ...data,
      created_at: new Date().toISOString()
    };
    
    // 写入新数据
    users.push(newUser);
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2), 'utf8');
    
    return { success: true, message: '保存成功' };
  } catch (err) {
    console.error('保存数据失败:', err);
    return { 
      success: false, 
      message: err instanceof Error ? err.message : '保存失败，请重试' 
    };
  }
}
    