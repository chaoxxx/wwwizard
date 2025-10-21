// filePath: wwwizard/share/models/Chapter.d.ts
export interface Chapter {
  id: string;         // 章节ID
  bookId: string;     // 所属书籍ID
  volumeId?: string;  // 所属卷ID（可选）
  title: string;      // 章节标题
  content: string;    // 章节内容
  order: number;      // 排序序号
  createTime: number; // 创建时间
  lastEditTime: number; // 最后编辑时间
  wordCount: number;  // 字数统计
}

export interface Volume {
  id: string;         // 卷ID
  bookId: string;     // 所属书籍ID
  title: string;      // 卷标题
  description?: string; // 卷描述
  order: number;      // 排序序号
}