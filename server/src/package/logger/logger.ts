import winston, { Logger, format, transports } from 'winston'

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug'
}

interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableFile: boolean
  logDir?: string
}

const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  enableConsole: true,
  enableFile: false,
  logDir: 'logs'
}

class LoggerService {
  private logger: Logger
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.logger = this.createLogger()
  }

  private createLogger(): Logger {
    const { combine, timestamp, errors, printf, colorize } = format

    const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
      let log = `${timestamp} [${level}]: ${message}`
      
      if (stack) {
        log += `\n${stack}`
      }

      if (Object.keys(meta).length > 0) {
        log += `\n${JSON.stringify(meta, null, 2)}`
      }

      return log
    })

    const fileFormat = combine(
      errors({ stack: true }),
      timestamp(),
      printf(({ timestamp, level, message, stack, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level,
          message,
          stack,
          ...meta
        })
      })
    )

    const transportsList: winston.transport[] = []

    if (this.config.enableConsole) {
      transportsList.push(
        new transports.Console({
          format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            consoleFormat
          )
        })
      )
    }

    if (this.config.enableFile && this.config.logDir) {
      transportsList.push(
        new transports.File({
          filename: `${this.config.logDir}/error.log`,
          level: 'error',
          format: fileFormat
        }),
        new transports.File({
          filename: `${this.config.logDir}/combined.log`,
          format: fileFormat
        })
      )
    }

    return winston.createLogger({
      level: this.config.level,
      transports: transportsList
    })
  }

  public error(message: string, meta?: any): void {
    this.logger.error(message, meta)
  }

  public warn(message: string, meta?: any): void {
    this.logger.warn(message, meta)
  }

  public info(message: string, meta?: any): void {
    this.logger.info(message, meta)
  }

  public log(message: string, meta?: any): void {
    this.logger.info(message, meta)
  }

  public http(message: string, meta?: any): void {
    this.logger.http(message, meta)
  }

  public debug(message: string, meta?: any): void {
    this.logger.debug(message, meta)
  }

  public getWinstonLogger(): Logger {
    return this.logger
  }
}

export const logger = new LoggerService()

export default LoggerService