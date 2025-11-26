export class RequestQueue {
  private queue = new Map<string, any>()
  private processing = false
  private batchInterval = 1000
  private addInterval = 10000

  addRequest(type: string, key: string, handler: () => Promise<any>): void {
    const requestKey = `${type}-${key}`
    if (!this.queue.has(requestKey)) {
      this.queue.set(requestKey, { type, key, handler, timestamp: Date.now() })
    }
    this.processQueue()
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return
    this.processing = true

    try {
      const getRequests = Array.from(this.queue.values())
        .filter(req => req.type === 'get' && Date.now() - req.timestamp >= this.batchInterval)
      
      const updateRequests = Array.from(this.queue.values())
        .filter(req => req.type === 'update' && Date.now() - req.timestamp >= this.batchInterval)
      
      const addRequests = Array.from(this.queue.values())
        .filter(req => req.type === 'add' && Date.now() - req.timestamp >= this.addInterval)

      await this.processBatch(getRequests, 'get')
      await this.processBatch(updateRequests, 'update')
      await this.processBatch(addRequests, 'add')

    } finally {
      this.processing = false
      if (this.queue.size > 0) {
        setTimeout(() => this.processQueue(), 100)
      }
    }
  }

  private async processBatch(requests: any[], type: string): Promise<void> {
    if (requests.length === 0) return
    const uniqueRequests = new Map()
    requests.forEach(req => uniqueRequests.set(req.key, req))

    for (const request of uniqueRequests.values()) {
      try {
        await request.handler()
        this.queue.delete(`${request.type}-${request.key}`)
      } catch (error) {
        console.error(`Error processing ${type} request:`, error)
      }
    }
  }
}