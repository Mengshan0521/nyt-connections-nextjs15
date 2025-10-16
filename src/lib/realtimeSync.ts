'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TABLES, CHANNELS } from '@/lib/supabase'

// Real-time subscription types
export interface RealtimeConfig {
  table: string
  filter?: string
  event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE'
  callback: (payload: any) => void
  immediate?: boolean
}

export interface RealtimeSubscription {
  id: string
  table: string
  channel: any
  isActive: boolean
}

// Real-time data manager
export class RealtimeDataManager {
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private reconnectAttempts: Map<string, number> = new Map()
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private supabase = createClient()

  // Subscribe to real-time updates
  subscribe(config: RealtimeConfig): string {
    const subscriptionId = `${config.table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const channel = this.supabase
      .channel(`${config.table}-realtime-${subscriptionId}`)
      .on(
        'postgres_changes',
        {
          event: config.event || '*',
          schema: 'public',
          table: config.table,
          filter: config.filter,
        },
        config.callback
      )
      .subscribe((status) => {
        console.log(`Realtime subscription ${subscriptionId} status:`, status)

        const subscription = this.subscriptions.get(subscriptionId)
        if (subscription) {
          subscription.isActive = status === 'SUBSCRIBED'
        }
      })

    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      table: config.table,
      channel,
      isActive: false
    }

    this.subscriptions.set(subscriptionId, subscription)

    // If immediate subscription is requested
    if (config.immediate) {
      this.reconnectSubscription(subscriptionId)
    }

    return subscriptionId
  }

  // Unsubscribe from real-time updates
  unsubscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId)
    
    if (subscription) {
      subscription.channel.unsubscribe()
      this.subscriptions.delete(subscriptionId)
      this.reconnectAttempts.delete(subscriptionId)
      return true
    }
    
    return false
  }

  // Unsubscribe from all real-time updates
  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.channel.unsubscribe()
    })
    this.subscriptions.clear()
    this.reconnectAttempts.clear()
  }

  // Reconnect subscription with retry logic
  private reconnectSubscription(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId)
    
    if (!subscription) {
      console.warn(`Subscription ${subscriptionId} not found`)
      return
    }

    const attempts = this.reconnectAttempts.get(subscriptionId) || 0
    
    if (attempts >= this.maxReconnectAttempts) {
      console.error(`Max reconnection attempts reached for ${subscriptionId}`)
      return
    }

    this.reconnectAttempts.set(subscriptionId, attempts + 1)

    setTimeout(() => {
      console.log(`Attempting to reconnect subscription ${subscriptionId} (attempt ${attempts + 1})`)
      
      subscription.channel.subscribe()
    }, this.reconnectDelay * Math.pow(2, attempts)) // Exponential backoff
  }

  // Get subscription status
  getSubscriptionStatus(subscriptionId: string): RealtimeSubscription | null {
    return this.subscriptions.get(subscriptionId) || null
  }

  // Get all active subscriptions
  getActiveSubscriptions(): RealtimeSubscription[] {
    return Array.from(this.subscriptions.values()).filter(sub => sub.isActive)
  }
}

// Create global instance
const realtimeManager = new RealtimeDataManager()

// React hook for real-time subscriptions
export function useRealtimeSubscription(config: RealtimeConfig): string {
  const subscriptionId = useRef<string>('')
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    subscriptionId.current = realtimeManager.subscribe({
      ...config,
      callback: (payload) => {
        // Update active status
        setIsActive(realtimeManager.getSubscriptionStatus(subscriptionId.current)?.isActive || false)
        
        // Call original callback
        config.callback(payload)
      }
    })

    return () => {
      realtimeManager.unsubscribe(subscriptionId.current)
    }
  }, [config.table, config.filter, config.event])

  return subscriptionId.current
}

// Game-specific real-time hooks
export function useGameRealtime(callback: (payload: any) => void) {
  return useRealtimeSubscription({
    table: TABLES.PUZZLES,
    event: 'UPDATE',
    callback
  })
}

export function useUserProgressRealtime(userId: string, callback: (payload: any) => void) {
  return useRealtimeSubscription({
    table: TABLES.USER_PROGRESS,
    filter: `user_id=eq.${userId}`,
    callback
  })
}

export function useGlobalGameUpdates(callback: (payload: any) => void) {
  return useRealtimeSubscription({
    table: TABLES.PUZZLES,
    event: 'INSERT',
    callback
  })
}

// Offline detection and sync
export class OfflineManager {
  private isOnline: boolean = true
  private pendingUpdates: Array<{ table: string; data: any }> = []
  private syncQueue: Array<{ table: string; data: any }> = []
  private reconnectTimer: NodeJS.Timeout | null = null

  constructor() {
    this.setupOnlineOfflineListeners()
  }

  private setupOnlineOfflineListeners(): void {
    window.addEventListener('online', () => {
      this.setOnlineStatus(true)
      this.syncPendingUpdates()
    })

    window.addEventListener('offline', () => {
      this.setOnlineStatus(false)
    })
  }

  private setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline
    console.log(`Online status changed: ${isOnline}`)
  }

  // Queue update for sync when back online
  queueUpdate(table: string, data: any): void {
    this.syncQueue.push({ table, data })
    
    if (this.isOnline) {
      this.syncToServer(table, data)
    }
  }

  // Sync pending updates to server
  private async syncPendingUpdates(): Promise<void> {
    if (!this.isOnline) return

    const updates = [...this.syncQueue]
    this.syncQueue = []

    for (const update of updates) {
      try {
        await this.syncToServer(update.table, update.data)
      } catch (error) {
        console.error('Failed to sync update:', error)
        // Put back in queue for next attempt
        this.syncQueue.push(update)
      }
    }
  }

  private async syncToServer(table: string, data: any): Promise<void> {
    switch (table) {
      case TABLES.USER_PROGRESS:
        await supabase.from(table).upsert(data)
        break
      case TABLES.GAME_SESSIONS:
        await supabase.from(table).upsert(data)
        break
      default:
        console.warn(`No sync handler for table: ${table}`)
    }
  }

  // Get pending update count
  getPendingUpdateCount(): number {
    return this.syncQueue.length
  }
}

// Create global offline manager instance
const offlineManager = new OfflineManager()

// React hook for offline status
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline }
}