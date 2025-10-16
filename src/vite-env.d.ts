/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import type { Book } from '@shared/models/Book';

declare global {
  interface Window {
    // expose in the `electron/preload/index.ts`
    ipcRenderer: import('electron').IpcRenderer & {    
      saveUserInfo: (data: { name: string; age: number; id_card: string }) => Promise<void>;
      getAllBooks: () => Promise<Book[]>;
      addBook: (bookData:Book) => Promise<Book>;
    }
  }
}


export {}