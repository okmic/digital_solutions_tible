export interface IItem {
  itemId: number
  name: string
  isSelected: boolean
  sortOrder: string
  createdAt: Date
  updatedAt: Date
}

export interface ItemsResponse {
  items: IItem[]
  hasMore: boolean
  total: number
}