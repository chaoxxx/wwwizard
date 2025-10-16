/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import type { Book } from '@shared/models/Book';
import type { Chapter, Volume } from '@share/models/Chapter';

declare global {
  interface Window {
    // expose in the `electron/preload/index.ts`
    ipcRenderer: import('electron').IpcRenderer & {    
      getAllBooks: () => Promise<Book[]>;
      addBook: (bookData:Book) => Promise<Book>;
      // 在interface Window的ipcRenderer中添加：
      getVolumesByBookId: (bookId: string) => Promise<Volume[]>;
      getChaptersByVolumeId: (volumeId?: string) => Promise<Chapter[]>;
      createVolume: (volumeData: Omit<Volume, 'id' | 'order'>) => Promise<Volume>;
      createChapter: (chapterData: Omit<Chapter, 'id' | 'createTime' | 'lastEditTime' | 'wordCount' | 'order'>) => Promise<Chapter>;
      updateChapterContent: (chapterId: string, content: string) => Promise<Chapter | null>;
    }
  }
}


export {}