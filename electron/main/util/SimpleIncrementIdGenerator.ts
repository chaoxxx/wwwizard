/**
 * 简单的20位线性递增ID生成器
 * 结构：13位毫秒时间戳 + 7位自增序列（确保同一毫秒内递增）
 * 特点：ID严格递增，长度固定20位，实现简单
 */
class SimpleIncrementIdGenerator {
  // 单例实例
  private static instance: SimpleIncrementIdGenerator;

  // 上次生成ID的时间戳（毫秒）
  private lastTimestamp: number = 0;

  // 同一毫秒内的自增序列（0-9999999，7位）
  private sequence: number = 0;

  // 私有构造函数（单例模式）
  private constructor() {}

  // 获取单例实例
  public static getInstance(): SimpleIncrementIdGenerator {
    if (!SimpleIncrementIdGenerator.instance) {
      SimpleIncrementIdGenerator.instance = new SimpleIncrementIdGenerator();
    }
    return SimpleIncrementIdGenerator.instance;
  }

  /**
   * 生成20位线性递增ID
   * @returns 20位字符串ID（如：17182365421350000001）
   */
  public generateId(): string {
    let timestamp = Date.now(); // 13位毫秒时间戳

    // 1. 如果当前时间小于上次时间（时钟回拨），强制使用上次时间戳
    if (timestamp < this.lastTimestamp) {
      timestamp = this.lastTimestamp;
    }

    // 2. 同一毫秒内，自增序列+1；不同毫秒，重置序列为0
    if (timestamp === this.lastTimestamp) {
      this.sequence++;
      // 若序列超过7位最大值（9999999），等待下一毫秒
      if (this.sequence > 9999999) {
        timestamp = this.waitNextMillis(timestamp);
        this.sequence = 0;
      }
    } else {
      this.sequence = 0;
    }

    // 3. 更新上次时间戳
    this.lastTimestamp = timestamp;

    // 4. 拼接ID：13位时间戳 + 7位补零序列（共20位）
    const sequenceStr = this.sequence.toString().padStart(7, '0'); // 7位补零
    return `${timestamp}${sequenceStr}`;
  }

  // 等待到下一毫秒（避免序列溢出）
  private waitNextMillis(currentTimestamp: number): number {
    let timestamp = Date.now();
    while (timestamp <= currentTimestamp) {
      timestamp = Date.now();
    }
    return timestamp;
  }
}

// 导出单例实例
export const idGenerator = SimpleIncrementIdGenerator.getInstance();