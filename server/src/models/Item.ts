import { Schema, model } from 'mongoose'

export interface IItem {
  itemId: number
  name: string
  isSelected: boolean
  sortOrder: string
  createdAt: Date
  updatedAt: Date
}

const ItemSchema = new Schema<IItem>({
  itemId: { type: Number, required: true, unique: true },
  name: { type: String },
  isSelected: { type: Boolean, default: false },
  sortOrder: { type: String, default: 'a0' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

ItemSchema.pre('save', function(next) {
  if (!this.name) {
    this.name = `Item ${this.itemId}`
  }
  next()
})

ItemSchema.index({ itemId: 1 })
ItemSchema.index({ isSelected: 1, sortOrder: 1 })
ItemSchema.index({ isSelected: 1, itemId: 1 })

export const Item = model<IItem>('Item', ItemSchema)