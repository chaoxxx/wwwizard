interface IBaseMapper<T> {
    // 按ID查找
    findById(id: string): T | null;
    // 查找所有
    findAll(): T[];
    // 创建
    create(item: T): void;
    // 更新
    update(id: string, item: Partial<T>): void;
    // 删除
    delete(id: string): boolean;    
}

export { IBaseMapper };