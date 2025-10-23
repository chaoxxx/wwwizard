import { BaseMapper } from '../BaseMapper';
import { Character } from '@share/dbModels/Character';

class CharacterMapper extends BaseMapper<Character> {
    // 静态实例属性（保存唯一实例）
    private static instance: CharacterMapper;

    // 私有构造函数（阻止外部通过 new 创建实例）
    private constructor() {
        super('www_character');
    }

    // 静态方法（获取唯一实例）
    public static getInstance(): CharacterMapper {
        // 如果实例不存在，则创建；存在则直接返回
        if (!CharacterMapper.instance) {
            CharacterMapper.instance = new CharacterMapper();
        }
        return CharacterMapper.instance;
    }

    // 可以添加 此类特有方法 特有的方法（示例）
    /**
     * 按照书籍ID查询所有角色
     * @param book_id 书籍唯一标识
     * @returns Character[] 所有角色数组对象
     */
    public findByBookId(book_id: string): Character[] {
        return this.executeQuerySql(`SELECT * FROM ${this.tableName} WHERE book_id = ?`, [book_id]);
    }

    /**
     * 按照书籍ID查询所有角色(分页)
     * @param book_id 书籍唯一标识
     * @param limit 每页条数
     * @param offset 起始偏移量
     * @returns Character[] 最大limit数量，角色数组对象
     */
    public findByBookIdWithPagination(book_id: string, limit: number, offset: number): Character[] {
        return this.executeQuerySql(`SELECT * FROM ${this.tableName} WHERE book_id = ? ORDER BY id ASC LIMIT ? OFFSET ?`, [book_id, limit, offset]);
    }
}

export { CharacterMapper };