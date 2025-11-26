import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import type { IItem } from '../../../shared/types/item'

interface ItemCardProps {
  item: IItem
  isSelected: boolean
  onSelect?: (itemId: number) => void
  onDeselect?: (itemId: number) => void
  onReorder?: (draggedId: number, targetId: number) => void
  isDraggable?: boolean
  isLast?: boolean
}

const ItemCard: React.FC<ItemCardProps> = ({ 
  item, 
  isSelected, 
  onSelect, 
  onDeselect,
  onReorder,
  isDraggable = false,
  isLast = false
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item: { id: item.itemId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [item.itemId])

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ITEM',
    drop: (draggedItem: { id: number }) => {
      if (onReorder && draggedItem.id !== item.itemId) {
        onReorder(draggedItem.id, item.itemId)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [item.itemId, onReorder])

  const handleClick = () => {
    if (isSelected && onDeselect) {
      onDeselect(item.itemId)
    } else if (!isSelected && onSelect) {
      onSelect(item.itemId)
    }
  }

  return (
    <div
      ref={isDraggable ? (node) => {
        if (isLast) {
          // For last item, we don't apply drag/drop
          return
        }
        drag(drop(node))
      } : undefined}
      className={`
        group p-4 border rounded-xl mb-3 cursor-pointer transition-all duration-300
        ${isSelected 
          ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50 shadow-lg shadow-purple-500/20' 
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
        }
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
        ${isOver ? 'border-blue-400 bg-blue-900/30 shadow-lg shadow-blue-500/30' : ''}
        ${isDraggable ? 'hover:shadow-xl hover:scale-[1.02]' : ''}
        backdrop-blur-sm
      `}
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg transition-colors ${
            isSelected ? 'text-white' : 'text-gray-200 group-hover:text-white'
          }`}>
            {item.name}
          </h3>
          <p className={`text-sm transition-colors ${
            isSelected ? 'text-purple-300' : 'text-gray-400 group-hover:text-gray-300'
          }`}>
            ID: {item.itemId}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isSelected && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              isSelected ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
            }`}>
              Selected
            </div>
          )}
          
          {isDraggable && !isLast && (
            <div className="text-gray-400 cursor-grab group-hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-700/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemCard