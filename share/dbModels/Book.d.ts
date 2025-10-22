export interface Book {
  id: string;                   // 唯一标识
  book_title: string;            // 书籍标题
  cover?: string;               // 封面图片路径
  book_type: string;             // 书籍类型
  book_desc: string;             // 书籍描述
  book_words_count: number;       // 字数统计
  create_time: number;           // 最后编辑时间
  update_time: number;           // 创建时间
}