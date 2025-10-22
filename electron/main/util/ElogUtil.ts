import logger from 'electron-log';
import * as path from 'path';

class ElogUtil {
    private static instance: ElogUtil | null = null;
    private constructor() {}
    public static getInstance(): ElogUtil {
        if (ElogUtil.instance === null) {
            ElogUtil.instance = new ElogUtil();
        }
        return ElogUtil.instance;
    }
    
    /**
     * 获取日志调用位置（文件名和行号）
     * @returns 格式化的位置字符串（如：src/utils/demo.ts:15）
     */
    private getCallerLocation(): string {
        try {
            // 创建错误对象获取堆栈信息
            const error = new Error();
            const stack = error.stack?.split('\n') || [];

            // 堆栈结构分析：
            // stack[0] -> "Error"
            // stack[1] -> 本方法（getCallerLocation）的调用位置
            // stack[2] -> 日志方法（debug/info等）的调用位置
            // stack[3] -> 用户实际调用日志的位置（需要提取这一行）
            const callerLine = stack[3] || '';

            // 正则匹配文件名和行号（适配不同系统路径格式）
            const match = callerLine.match(/\s+at\s+.*\((.*):(\d+):(\d+)\)$/);
            if (match && match[1]) {
                // 提取相对路径（避免显示完整绝对路径）
                const fullPath = match[1];
                const relativePath = path.relative(process.cwd(), fullPath);
                return `${relativePath}:${match[2]}`; // 文件名:行号
            }

            return 'unknown location';
        } catch (err) {
            return 'failed to get location';
        }
    }

    /**
     * 格式化日志消息
     * @param level 日志级别（debug/info/warn/error）
     * @param message 日志内容
     * @returns 格式化后的日志字符串
     */
    private formatMessage(level: string, message: string): string {
        const time = new Date().toISOString(); // 时间（ISO格式）
        const location = this.getCallerLocation(); // 调用位置
        return `[Elog] [${location}] ${message}`;
    }

    // 调试日志
    public debug(message: string): void {
        logger.debug(this.formatMessage('DEBUG', message));
    }

    // 信息日志
    public info(message: string): void {
        logger.info(this.formatMessage('INFO', message));
    }

    // 警告日志
    public warn(message: string): void {
        logger.warn(this.formatMessage('WARN', message));
    }

    // 错误日志
    public error(message: string | Error): void {
        const msg = message instanceof Error 
            ? `${message.message}\n${message.stack}` // 错误对象显示堆栈
            : message;
        logger.error(this.formatMessage('ERROR', msg));
    }
}

export default ElogUtil;