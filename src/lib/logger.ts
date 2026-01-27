import 'server-only';

/**
 * Simple structured logging utility
 *
 * Usage:
 * - logger.info('User logged in', { userId: '123' })
 * - logger.error('Payment failed', { error, orderId })
 * - logger.warn('Low stock', { productId, stock: 5 })
 * - logger.debug('Debug info', { details })
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, any>;

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const currentLevel = (process.env.LOG_LEVEL?.toLowerCase() as LogLevel) || 'info';
const currentLevelValue = LOG_LEVELS[currentLevel] || LOG_LEVELS.info;

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= currentLevelValue;
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const logObj = {
    level,
    time: timestamp,
    message,
    ...(context && { ...context }),
  };

  if (process.env.NODE_ENV === 'development') {
    // Pretty print for development
    const emoji = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'info' ? 'ℹ️' : '🔍';
    return `${emoji} [${level.toUpperCase()}] ${message}${context ? ' ' + JSON.stringify(context, null, 2) : ''}`;
  }

  // JSON format for production (easier to parse/index)
  return JSON.stringify(logObj);
}

function log(level: LogLevel, message: string, context?: LogContext) {
  if (!shouldLog(level)) return;

  const formatted = formatLog(level, message, context);

  if (level === 'error') {
    console.error(formatted);
  } else if (level === 'warn') {
    console.warn(formatted);
  } else {
    console.log(formatted);
  }
}

export const logger = {
  debug(message: string, context?: LogContext) {
    log('debug', message, context);
  },

  info(message: string, context?: LogContext) {
    log('info', message, context);
  },

  warn(message: string, context?: LogContext) {
    log('warn', message, context);
  },

  error(context: LogContext | Error, message?: string): void {
    if (context instanceof Error) {
      log('error', context.message, {
        error: context.name,
        stack: context.stack,
        ...(message && { context: message }),
      });
    } else if (typeof message === 'string') {
      log('error', message, context);
    } else {
      log('error', 'An error occurred', context);
    }
  },
};

/**
 * Create a child logger with bound context
 * Useful for adding consistent context to all logs in a module
 *
 * Example:
 * const log = createLogger({ module: 'cart' })
 * log.info('Item added', { productId })
 */
export function createLogger(bindings: Record<string, any>) {
  return {
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...bindings, ...context }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...bindings, ...context }),
    warn: (message: string, context?: LogContext) =>
      logger.warn(message, { ...bindings, ...context }),
    error: (contextOrError: LogContext | Error, message?: string) =>
      logger.error(contextOrError, message),
  };
}
