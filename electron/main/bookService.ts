import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { Book } from '@share/models/Book';
// 定义数据存储路径
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = app.getPath('userData');
const booksPath = path.join(dataDir, 'books.json');

// 初始化数据文件
async function initBooksFile() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(booksPath);
  } catch {
    await fs.writeFile(booksPath, JSON.stringify([], null, 2), 'utf8');
  }
}

// 获取所有书籍
export async function getAllBooks(): Promise<Book[]> {
  await initBooksFile();
  const data = await fs.readFile(booksPath, 'utf8');
  return JSON.parse(data) as Book[];
}

// 添加新书籍
export async function addBook(book: Omit<Book, 'id' | 'createTime' | 'lastEditTime' | 'wordCount'>): Promise<Book> {
  await initBooksFile();
  const books = await getAllBooks();
  
  const newBook: Book = {
    id: Date.now().toString(),
    ...book,
    createTime: Date.now(),
    lastEditTime: Date.now(),
    wordCount: 0
  };
  
  books.push(newBook);
  await fs.writeFile(booksPath, JSON.stringify(books, null, 2), 'utf8');
  return newBook;
}

// 导出供渲染进程调用的方法
export const bookService = {
  getAllBooks,
  addBook
};