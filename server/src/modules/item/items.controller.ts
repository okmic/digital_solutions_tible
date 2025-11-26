import { Request, Response } from 'express'
import { ItemsService } from './items.service'

const itemsService = new ItemsService()

export class ItemsController {
  async init(req: Request, res: Response) {
    try {
      const result = await itemsService.init()
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'Initialization failed' })
    }
  }

  async getItems(req: Request, res: Response) {
    try {
      const { page = '0', limit = '20', search, selected = 'false' } = req.query
      const result = await itemsService.getItems(
        parseInt(page as string),
        parseInt(limit as string),
        search as string,
        selected === 'true'
      )
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch items' })
    }
  }

  async getSelectedItems(req: Request, res: Response) {
    try {
      const { page = '0', limit = '20', search } = req.query
      const result = await itemsService.getSelectedItems(
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      )
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch selected items' })
    }
  }

  async selectItem(req: Request, res: Response) {
    try {
      const itemId = parseInt(req.params.id)
      const result = await itemsService.selectItem(itemId)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'Failed to select item' })
    }
  }

  async deselectItem(req: Request, res: Response) {
    try {
      const itemId = parseInt(req.params.id)
      const result = await itemsService.deselectItem(itemId)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'Failed to deselect item' })
    }
  }

  async reorderItem(req: Request, res: Response) {
    try {
      const { itemId, prevOrder, nextOrder } = req.body
      const result = await itemsService.reorderItem(itemId, prevOrder, nextOrder)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'Failed to reorder item' })
    }
  }

  async addItem(req: Request, res: Response) {
    try {
      const { itemId } = req.body
      const result = await itemsService.addItem(parseInt(itemId))
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'Failed to add item' })
    }
  }
}