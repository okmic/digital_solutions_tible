import mongoose from 'mongoose'
import config from '../config/config'
import { logger } from "../logger/logger"

class DatabaseService {
  private uri: string = config.MONGODB_URI
  private connectionPromise: Promise<void> | null = null

  constructor() {
    mongoose.set('strictQuery', false)
  }

  public async connect(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        await mongoose.connect(this.uri, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 10000
        })
        logger.log('🟢 MongoDB connected successfully')
        resolve()
      } catch (e) {
        logger.error('🔴 MongoDB connection failed:', e)
        reject(e)
      }
    })

    return this.connectionPromise
  }
  public async close(): Promise<void> {
    try {
      await mongoose.disconnect()
      this.connectionPromise = null
      logger.info('🔴 MongoDB connections closed')
    } catch (e) {
      logger.error('Error closing MongoDB connections:', e)
      throw e
    }
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1
  }
}

export default new DatabaseService()
