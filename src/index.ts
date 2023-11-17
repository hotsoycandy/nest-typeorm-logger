import { Logger as NestLogger } from '@nestjs/common'
import { Logger as TypeOrmLogger } from 'typeorm'
import { format as sqlFormat } from 'sql-formatter'

export class TypeNestLogger implements TypeOrmLogger {
  constructor (
    private readonly logger: NestLogger
  ) {
    if (this.logger instanceof NestLogger) {
      throw new Error('logger must be NestJS Logger')
    }
  }

  private stringifyParams (parameters: any[] = []): string {
    return parameters.length !== 0
      ? `\nParameters: [${parameters.join(', ')}]`
      : ''
  }

  // debugs
  logQuery (query: string, params?: any[]): void {
    let message = ''
    message += `Query: ${sqlFormat(query)}`
    message += this.stringifyParams(params)
    this.logger.verbose(message)
  }

  logSchemaBuild (message: string): void {
    this.logger.verbose(message)
  }

  logMigration (message: string): void {
    this.logger.verbose(message)
  }

  // warns
  logQuerySlow (time: number, query: string, params?: any[]): void {
    let message = ''
    message += `Slow Query (${time}s): ${query}`
    message += this.stringifyParams(params)
    this.logger.warn(message)
  }

  // errors
  logQueryError (error: string, query: string, params?: any[]): void {
    let message = ''
    message += `Query Error: ${error}. Query: ${query}`
    message += this.stringifyParams(params)
    this.logger.error(message)
  }

  // common logs
  log (level: 'log' | 'info' | 'warn', message: any): void {
    switch (level) {
      case 'log':
        this.logger.log(message)
        break
      case 'info':
        this.logger.verbose(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
    }
  }
}
