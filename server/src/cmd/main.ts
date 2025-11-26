import express from 'express'
import cors from 'cors'
import { ItemsController } from '../modules/item/items.controller'
import { setupGlobalErrorHandlers } from '../package/init/setupGlobalErrorHandlers'
import dbService from '../package/db/db.service'
import { logger } from '../package/logger/logger'
import config from '../package/config/config'

async function startServer() {
  try {
    try {
        await dbService.connect()
        logger.log('DatabaseService initialized successfully')
    } catch (error) {
        logger.error('Failed to connect to database:', error)
        process.exit(1)
    }
    const app = express()
    const itemsController = new ItemsController()
    app.use(cors({ origin: "*" }))
    app.use(express.json())
    app.get('/', (_, res) => res.send({ msg: "pong" }))
    app.get('/ping', (_, res) => res.send({ msg: "pong" }))
    app.get('/api', (_, res) => res.send({ msg: "pong" }))
    app.get('/api/ping', (_, res) => res.send({ msg: "pong" }))
    app.post('/api/init', itemsController.init)
    app.get('/api/items', itemsController.getItems)
    app.get('/api/selected-items', itemsController.getSelectedItems)
    app.post('/api/items/:id/select', itemsController.selectItem)
    app.post('/api/items/:id/deselect', itemsController.deselectItem)
    app.post('/api/items/reorder', itemsController.reorderItem)
    app.post('/api/items', itemsController.addItem)
    setupGlobalErrorHandlers()
    app.listen(config.PORT, (err) => {
        if(err) logger.error("ERROR STARTED SERVER", err)
    })
    logger.log(`Server started on port ${config.PORT}`)
  } catch (err) {
    logger.error("Error start server", err)
    process.exit(1)
  }
}

startServer().catch(err => {
  console.error('Server failed:', err)
  process.exit(1)
})
