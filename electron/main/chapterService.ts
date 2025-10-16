// filePath: wwwizard/electron/main/chapterService.ts
import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { Chapter, Volume } from '@share/models/Chapter';

// 定义数据存储路径
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = app.getPath('userData');
const chaptersPath = path.join(dataDir, 'chapters.json');
const volumesPath = path.join(dataDir, 'volumes.json');

// 初始化数据文件
async function initChapterFiles() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(chaptersPath);
  } catch {
    await fs.writeFile(chaptersPath, JSON.stringify([], null, 2), 'utf8');
  }

  try {
    await fs.access(volumesPath);
  } catch {
    await fs.writeFile(volumesPath, JSON.stringify([], null, 2), 'utf8');
  }
}

// 获取书籍的所有卷
export async function getVolumesByBookId(bookId: string): Promise<Volume[]> {
  await initChapterFiles();
  const data = await fs.readFile(volumesPath, 'utf8');
  const volumes = JSON.parse(data) as Volume[];
  return volumes.filter(volume => volume.bookId === bookId);
}

// 获取卷下的所有章节
export async function getChaptersByVolumeId(volumeId?: string): Promise<Chapter[]> {
  await initChapterFiles();
  const data = await fs.readFile(chaptersPath, 'utf8');
  const chapters = JSON.parse(data) as Chapter[];
  
  if (volumeId) {
    return chapters.filter(chapter => chapter.volumeId === volumeId);
  }
  
  // 如果没有卷ID，返回没有归属卷的章节
  return chapters.filter(chapter => !chapter.volumeId);
}

// 获取书籍的所有章节（不考虑卷）
export async function getChaptersByBookId(bookId: string): Promise<Chapter[]> {
  await initChapterFiles();
  const data = await fs.readFile(chaptersPath, 'utf8');
  const chapters = JSON.parse(data) as Chapter[];
  return chapters.filter(chapter => chapter.bookId === bookId);
}

// 创建新卷
export async function createVolume(volume: Omit<Volume, 'id' | 'order'>): Promise<Volume> {
  await initChapterFiles();
  const volumes = await getVolumesByBookId(volume.bookId);
  
  const newVolume: Volume = {
    ...volume,
    id: Date.now().toString(),
    order: volumes.length + 1
  };
  
  const allVolumes = JSON.parse(await fs.readFile(volumesPath, 'utf8')) as Volume[];
  allVolumes.push(newVolume);
  await fs.writeFile(volumesPath, JSON.stringify(allVolumes, null, 2), 'utf8');
  
  return newVolume;
}

// 创建新章节
export async function createChapter(chapter: Omit<Chapter, 'id' | 'createTime' | 'lastEditTime' | 'wordCount' | 'order'>): Promise<Chapter> {
  await initChapterFiles();
  
  // 计算排序序号
  let chapters: Chapter[] = [];
  if (chapter.volumeId) {
    chapters = await getChaptersByVolumeId(chapter.volumeId);
  } else {
    chapters = await getChaptersByBookId(chapter.bookId);
  }
  
  const newChapter: Chapter = {
    ...chapter,
    id: Date.now().toString(),
    content: '',
    order: chapters.length + 1,
    createTime: Date.now(),
    lastEditTime: Date.now(),
    wordCount: 0
  };
  
  const allChapters = JSON.parse(await fs.readFile(chaptersPath, 'utf8')) as Chapter[];
  allChapters.push(newChapter);
  await fs.writeFile(chaptersPath, JSON.stringify(allChapters, null, 2), 'utf8');
  
  return newChapter;
}

// 更新章节内容
export async function updateChapterContent(chapterId: string, content: string): Promise<Chapter | null> {
  await initChapterFiles();
  const allChapters = JSON.parse(await fs.readFile(chaptersPath, 'utf8')) as Chapter[];
  const chapterIndex = allChapters.findIndex(c => c.id === chapterId);
  
  if (chapterIndex === -1) return null;
  
  // 更新内容、字数和最后编辑时间
  allChapters[chapterIndex] = {
    ...allChapters[chapterIndex],
    content,
    wordCount: content.length,
    lastEditTime: Date.now()
  };
  
  await fs.writeFile(chaptersPath, JSON.stringify(allChapters, null, 2), 'utf8');
  return allChapters[chapterIndex];
}

// 导出服务
export const chapterService = {
  getVolumesByBookId,
  getChaptersByVolumeId,
  getChaptersByBookId,
  createVolume,
  createChapter,
  updateChapterContent
};