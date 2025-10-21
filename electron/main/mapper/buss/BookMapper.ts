import { BaseMapper } from '../BaseMapper';
import { Book } from '@share/dbModels/Book';

class BookMapper extends BaseMapper<Book> {
    // 静态实例属性（保存唯一实例）
    private static instance: BookMapper;

    // 私有构造函数（阻止外部通过 new 创建实例）
    private constructor() {
        super('www_book');
    }

    // 静态方法（获取唯一实例）
    public static getInstance(): BookMapper {
        // 如果实例不存在，则创建；存在则直接返回
        if (!BookMapper.instance) {
            BookMapper.instance = new BookMapper();
        }
        return BookMapper.instance;
    }

    // 可以添加 此类特有方法 特有的方法（示例）
}

export { BookMapper };