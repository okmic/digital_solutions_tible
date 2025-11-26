import React, { useCallback } from 'react'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import ItemCard from './ItemCard'
import { useApi } from '../hooks/useApi'

interface ItemListProps {
  isSelectedList: boolean
  search: string
  onReorder?: (draggedId: number, targetId: number) => void
}

const ItemList: React.FC<ItemListProps> = ({ 
  isSelectedList, 
  search, 
  onReorder 
}) => {
  const { items, hasMore, loading, lastItemRef } = useInfiniteScroll(isSelectedList, search)
  const { selectItem, deselectItem } = useApi()

  const handleSelect = useCallback(async (itemId: number) => {
    try {
      await selectItem(itemId)
    } catch (error) {
      console.error('Error selecting item:', error)
    }
  }, [selectItem])

  const handleDeselect = useCallback(async (itemId: number) => {
    try {
      await deselectItem(itemId)
    } catch (error) {
      console.error('Error deselecting item:', error)
    }
  }, [deselectItem])

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div className="p-6">
        {items.map((item, index) => (
          <div
            key={item.itemId}
            ref={index === items.length - 1 ? lastItemRef : undefined}
          >
            <ItemCard
              item={item}
              isSelected={isSelectedList}
              onSelect={isSelectedList ? undefined : handleSelect}
              onDeselect={isSelectedList ? handleDeselect : undefined}
              onReorder={isSelectedList ? onReorder : undefined}
              isDraggable={isSelectedList}
              isLast={index === items.length - 1}
            />
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}
        
        {!hasMore && items.length > 0 && (
          <div className="text-center py-6 text-gray-400 border-t border-gray-700 mt-4">
            <p className="text-sm">No more items to load</p>
          </div>
        )}
        
        {items.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium text-gray-300">No items found</p>
            <p className="text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemList