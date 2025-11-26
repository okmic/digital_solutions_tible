import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { ItemsController } from '../modules/item/items.controller'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const itemsController = new ItemsController()

app.use(cors())
app.use(express.json())

app.post('/api/init', itemsController.init)
app.get('/api/items', itemsController.getItems)
app.get('/api/selected-items', itemsController.getSelectedItems)
app.post('/api/items/:id/select', itemsController.selectItem)
app.post('/api/items/:id/deselect', itemsController.deselectItem)
app.post('/api/items/reorder', itemsController.reorderItem)
app.post('/api/items', itemsController.addItem)

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/million-items')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})