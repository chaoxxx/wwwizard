import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { BookMapper } from '../mapper/buss/BookMapper';
import type { Book }  from '@share/dbModels/Book';
import { idGenerator }  from '../util/SimpleIncrementIdGenerator';

// 定义数据存储路径
// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const dataDir = app.getPath('userData');
// const booksPath = path.join(dataDir, 'books.json');
const bookMapper = BookMapper.getInstance();

// 获取所有书籍
export async function getAllBooks(): Promise<Book[]> {
  return bookMapper.findAll();
}

// 添加新书籍
export async function addBook(book: Omit<Book, 'id' | 'create_time' | 'update_time' | 'book_words_count'>): Promise<Book> {  
  const newBook: Book = {    
    ...book,
    // id: idGenerator.generateId(),
    book_type: '10',    
    create_time: Date.now(),
    update_time: Date.now(),
    book_words_count: 0
  };
  
  return bookMapper.create(newBook);
}

// 导出供渲染进程调用的方法
export const bookService = {
  getAllBooks,
  addBook
};