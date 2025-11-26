import React, { useState } from 'react'
import { useApi } from '../hooks/useApi'

const AddItemForm: React.FC = () => {
  const [itemId, setItemId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { addItem } = useApi()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!itemId || isNaN(Number(itemId)) || Number(itemId) <= 0) {
      setMessage('Please enter a valid positive number')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await addItem(Number(itemId))
      setMessage('Item added successfully!')
      setItemId('')
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="number"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          placeholder="Enter new item ID..."
          className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                   transition-all duration-300"
          min="1"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl 
                   hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
                   transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </div>
          ) : (
            'Add Item'
          )}
        </button>
      </form>
      {message && (
        <p className={`mt-3 text-sm font-medium ${
          message.includes('success') 
            ? 'text-green-400 bg-green-900/30 px-3 py-2 rounded-lg' 
            : 'text-red-400 bg-red-900/30 px-3 py-2 rounded-lg'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default AddItemForm