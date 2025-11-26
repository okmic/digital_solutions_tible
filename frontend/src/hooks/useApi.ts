import { useState, useCallback } from 'react'
import axios from 'axios'
import type { IItem, ItemsResponse} from "../../../shared/types/item"

const API_BASE = 'http://localhost:6969/api'

export const useApi = () => {
  const [loading, setLoading] = useState(false)

  const getItems = useCallback(async (page: number, search: string = '', selected: boolean = false): Promise<ItemsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20',
      selected: selected.toString()
    })
    
    if (search) params.append('search', search)
    
    const response = await axios.get(`${API_BASE}/items?${params}`)
    return response.data
  }, [])

  const getSelectedItems = useCallback(async (page: number, search: string = ''): Promise<ItemsResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '20'
    })
    
    if (search) params.append('search', search)
    
    const response = await axios.get(`${API_BASE}/selected-items?${params}`)
    return response.data
  }, [])

  const selectItem = useCallback(async (itemId: number): Promise<void> => {
    await axios.post(`${API_BASE}/items/${itemId}/select`)
  }, [])

  const deselectItem = useCallback(async (itemId: number): Promise<void> => {
    await axios.post(`${API_BASE}/items/${itemId}/deselect`)
  }, [])

  const reorderItem = useCallback(async (itemId: number, prevOrder: string | null, nextOrder: string | null): Promise<void> => {
    await axios.post(`${API_BASE}/items/reorder`, { itemId, prevOrder, nextOrder })
  }, [])

  const addItem = useCallback(async (itemId: number): Promise<IItem> => {
    const response = await axios.post(`${API_BASE}/items`, { itemId })
    return response.data.item
  }, [])

  return {
    loading: setLoading,
    getItems,
    getSelectedItems,
    selectItem,
    deselectItem,
    reorderItem,
    addItem
  }
}