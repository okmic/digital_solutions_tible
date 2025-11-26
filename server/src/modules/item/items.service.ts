import { Item } from '../../models/Item'
import { FractionalIndexManager } from '../../utils/fractionalIndexing'
import { RequestQueue } from '../../utils/requestQueue'

const indexManager = new FractionalIndexManager()
const requestQueue = new RequestQueue()

export class ItemsService {
    async init() {
        const count = await Item.countDocuments()
        if (count === 0) {
            console.log('Initializing database with 1,000,000 items...')
            const batchSize = 10000
            const totalItems = 1000000

            for (let i = 0; i < totalItems; i += batchSize) {
                const items: any[] = []
                const end = Math.min(i + batchSize, totalItems)

                for (let j = i + 1; j <= end; j++) {
                    items.push({
                        itemId: j,
                        sortOrder: indexManager.generateAfter(
                            items.length > 0 ? items[items.length - 1].sortOrder : null
                        )
                    })
                }

                await Item.insertMany(items)
                console.log(`Created items ${i + 1} to ${end}`)
            }
            console.log('Database initialization completed')
        }

        return { message: 'Database ready', count }
    }

    async getItems(page: number, limit: number, search: string, selected: boolean) {
        return new Promise((resolve, reject) => {
            requestQueue.addRequest('get', `${search}-${selected}-${page}`, async () => {
                try {
                    const query: any = { isSelected: selected }
                    if (search) {
                        query.itemId = { $gte: parseInt(search) }
                    }

                    const skip = page * limit
                    const items = await Item.find(query)
                        .sort({ itemId: 1 })
                        .skip(skip)
                        .limit(limit)
                        .select('itemId name isSelected sortOrder')

                    const total = await Item.countDocuments(query)

                    resolve({
                        items,
                        hasMore: skip + items.length < total,
                        total
                    })
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    async getSelectedItems(page: number, limit: number, search: string) {
        return new Promise((resolve, reject) => {
            requestQueue.addRequest('get', `selected-${search}-${page}`, async () => {
                try {
                    const query: any = { isSelected: true }
                    if (search) {
                        query.itemId = { $gte: parseInt(search) }
                    }

                    const skip = page * limit
                    const items = await Item.find(query)
                        .sort({ sortOrder: 1 })
                        .skip(skip)
                        .limit(limit)
                        .select('itemId name isSelected sortOrder')

                    const total = await Item.countDocuments(query)

                    resolve({
                        items,
                        hasMore: skip + items.length < total,
                        total
                    })
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    async selectItem(itemId: number) {
        return new Promise((resolve, reject) => {
            requestQueue.addRequest('update', `select-${itemId}`, async () => {
                try {
                    const item = await Item.findOne({ itemId })
                    if (!item) {
                        reject(new Error('Item not found'))
                        return
                    }

                    const lastSelected = await Item.findOne({ isSelected: true })
                        .sort({ sortOrder: -1 })

                    const newSortOrder = lastSelected
                        ? indexManager.generateAfter(lastSelected.sortOrder)
                        : indexManager.getInitialOrder()

                    item.set({
                        isSelected: true,
                        sortOrder: newSortOrder
                    })
                    await item.save()

                    resolve({ success: true, item })
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    async deselectItem(itemId: number) {
        return new Promise((resolve, reject) => {
            requestQueue.addRequest('update', `deselect-${itemId}`, async () => {
                try {
                    await Item.findOneAndUpdate(
                        { itemId },
                        { isSelected: false }
                    )
                    resolve({ success: true })
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    async reorderItem(itemId: number, prevOrder: string, nextOrder: string) {
        return new Promise((resolve, reject) => {
            requestQueue.addRequest('update', `reorder-${itemId}`, async () => {
                try {
                    const newOrder = indexManager.generateBetween(prevOrder, nextOrder)
                    await Item.findOneAndUpdate(
                        { itemId },
                        { sortOrder: newOrder }
                    )
                    resolve({ success: true, newOrder })
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    async addItem(itemId: number) {
        return new Promise((resolve, reject) => {
            requestQueue.addRequest('add', `add-${itemId}`, async () => {
                try {
                    const existingItem = await Item.findOne({ itemId })
                    if (existingItem) {
                        reject(new Error('Item ID already exists'))
                        return
                    }

                    const newItem = new Item({
                        itemId,
                        sortOrder: indexManager.getInitialOrder()
                    })

                    await newItem.save()
                    resolve({ success: true, item: newItem })
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
}