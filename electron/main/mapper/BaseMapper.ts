import { db } from '../datasource/dbConnection';
import { IBaseMapper } from './IBaseMapper';
import { idGenerator }  from '../util/SimpleIncrementIdGenerator';
// 约束泛型 T 必须包含 id 字段（通用主键约束）
type WithId = { id: string };

abstract class BaseMapper<T extends WithId> implements IBaseMapper<T> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    // 根据 ID 查询
    findById(id: T['id']): T | undefined {
        return db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`).get(id) as T | undefined;
    }

    // 查询所有
    findAll(): T[] {
        return db.prepare(`SELECT * FROM ${this.tableName}`).all() as T[];
    }

    /**
     * 分页查询所有记录
     * @param limit 每页条数
     * @param offset 起始偏移量
     * @returns T[] 最大limit数量，记录数组对象
     */
    findAllWithPagination(limit: number, offset: number): T[] {
        return db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id ASC LIMIT ? OFFSET ?`).all(limit, offset) as T[];
    }

    protected executeQuerySql(sql: string, params: any[] = []): any {
        return db.prepare(sql).all(...params);
    }

    /**
     * 创建新记录
     * @param item 要创建的对象（不含 id 时会自动生成）
     * @returns 创建后的完整对象（包含 id）
     */
    create(item: Partial<T>): T {
        // 复制一份数据，避免修改原对象
        const data = { ...item };
        // 如果外部未提供 id，则自动生成
        data.id = data.id || idGenerator.generateId();

        // 获取所有字段键（此时已排除 id）
        const keys = Object.keys(data) as (keyof T)[];
        if (keys.length === 0) {
            throw new Error('创建对象不能为空');
        }

        // 构建 INSERT 语句（与之前逻辑一致）
        const placeholders = keys.map(() => '?').join(', ');
        const columns = keys.join(', ');
        const values = keys.map(key => data[key]);

        const sql = `
            INSERT INTO ${this.tableName} (${columns})
            VALUES (${placeholders})
            RETURNING *
        `;

        const result = db.prepare(sql).get(...values);
        return result as T;
    }

    /**
     * 更新记录
     * @param id 要更新的记录 ID
     * @param item 要更新的字段（部分更新）
     * @returns 更新后的完整对象
     */
    update(id: T['id'], item: Partial<T>): T | undefined {
        const updateData = { ...item };
        delete updateData.id;

        // 获取所有字符串键（直接过滤 Symbol，只保留字符串）
        const keys = Object.keys(updateData) as (keyof T)[];

        if (keys.length === 0) {
            throw new Error('更新对象不能为空');
        }

        // 显式将 key 转换为字符串，消除 Symbol 转换警告
        const setClause = keys.map(key => `${String(key)} = ?`).join(', ');
        const values = [...keys.map(key => updateData[key]), id];

        const sql = `
            UPDATE ${this.tableName}
            SET ${setClause}
            WHERE id = ?
            RETURNING *
        `;

        const result = db.prepare(sql).get(...values);
        return result as T | undefined;
    }

    /**
     * 删除记录
     * @param id 要删除的记录 ID
     * @returns 是否删除成功
     */
    delete(id: T['id']): boolean {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
        const result = db.prepare(sql).run(id);
        // changes 表示受影响的行数，1 表示删除成功
        return result.changes === 1;
    }
}

export { BaseMapper };