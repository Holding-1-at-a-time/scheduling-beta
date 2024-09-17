import * as console from 'console';

interface Logger {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}

function createLogger(namespace: string): Logger {
    const logger: Logger = {
        debug(message, ...args) {
            console.debug(`[${namespace}] ${message}`, ...args);
        },
        info(message, ...args) {
            console.info(`[${namespace}] ${message}`, ...args);
        },
        warn(message, ...args) {
            console.warn(`[${namespace}] ${message}`, ...args);
        },
        error(message, ...args) {
            console.error(`[${namespace}] ${message}`, ...args);
        },
    };

    return logger;
}

export { createLogger };