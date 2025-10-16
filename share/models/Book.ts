export interface Book {
  id: string;         // 唯一标识
  title: string;      // 书籍标题
  cover?: string;     // 封面图片路径
  description: string;// 书籍描述
  lastEditTime: number;// 最后编辑时间
  createTime: number; // 创建时间
  wordCount: number;  // 字数统计
}