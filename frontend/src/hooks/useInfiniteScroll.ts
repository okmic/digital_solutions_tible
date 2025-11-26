import { useState, useCallback, useEffect, useRef } from 'react'
import { useApi } from './useApi'
import type { IItem, ItemsResponse } from '../../../shared/types/item'

export const useInfiniteScroll = (selected: boolean = false, search: string = '') => {
  const [items, setItems] = useState<IItem[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const { getItems, getSelectedItems } = useApi()
  const observer = useRef<IntersectionObserver>(null)

  const lastItemRef = useCallback((node: HTMLDivElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore()
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const loadItems = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    if (loading) return
    setLoading(true)
    
    try {
      const response: ItemsResponse = selected 
        ? await getSelectedItems(pageNum, search)
        : await getItems(pageNum, search, selected)

      setItems(prev => reset ? response.items : [...prev, ...response.items])
      setHasMore(response.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading items:', error)
    } finally {
      setLoading(false)
    }
  }, [selected, search, getItems, getSelectedItems, loading])

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadItems(page + 1)
    }
  }, [hasMore, loading, page, loadItems])

  const reset = useCallback(() => {
    setItems([])
    setPage(0)
    setHasMore(true)
    loadItems(0, true)
  }, [loadItems])

  useEffect(() => {
    reset()
  }, [selected, search, reset])

  return {
    items,
    hasMore,
    loading,
    lastItemRef,
    reset
  }
}