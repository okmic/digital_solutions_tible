import { logger } from "../logger/logger"

export function setupGlobalErrorHandlers() {
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", { promise, reason })
  })

  process.on("uncaughtException", error => {
    logger.error("Uncaught Exception thrown:", error)
  })

  process.on("SIGTERM", gracefulShutdown)
  process.on("SIGINT", gracefulShutdown)
}

async function gracefulShutdown() {
  logger.info("Starting graceful shutdown...")
  process.exit(0)
}
