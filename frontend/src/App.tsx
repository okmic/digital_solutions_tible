import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useApi } from './hooks/useApi'
import Header from './components/Header'
import SearchInput from './components/SearchInput'
import AddItemForm from './components/AddItemForm'
import ItemList from './components/ItemList'


const App: React.FC = () => {
  const [leftSearch, setLeftSearch] = useState('')
  const [rightSearch, setRightSearch] = useState('')
  const { reorderItem } = useApi()

  const handleReorder = async (draggedId: number, targetId: number) => {
    try {
      await reorderItem(draggedId, null, null)
    } catch (error) {
      console.error('Error reordering items:', error)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                    <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                      All Items
                    </span>
                    <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300 font-medium">
                      Browse
                    </span>
                  </h2>
                </div>
                <SearchInput
                  value={leftSearch}
                  onChange={setLeftSearch}
                  placeholder="Filter items by ID..."
                />
              </div>
              <AddItemForm />
              <div className="flex-1 overflow-hidden">
                <ItemList
                  isSelectedList={false}
                  search={leftSearch}
                />
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700 shadow-2xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Selected Items
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                      Drag to reorder
                    </span>
                  </h2>
                </div>
                <SearchInput
                  value={rightSearch}
                  onChange={setRightSearch}
                  placeholder="Filter selected items by ID..."
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <ItemList
                  isSelectedList={true}
                  search={rightSearch}
                  onReorder={handleReorder}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  )
}

export default App