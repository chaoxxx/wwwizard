export interface Book {
  id: string;                   // 唯一标识
  bookTitle: string;            // 书籍标题
  cover?: string;               // 封面图片路径
  bookType: string;             // 书籍类型
  bookDesc: string;             // 书籍描述
  bookWordsCount: number;       // 字数统计
  createTime: number;           // 最后编辑时间
  updateTime: number;           // 创建时间
}