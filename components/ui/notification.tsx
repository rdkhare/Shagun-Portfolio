"use client"

import { useState, useEffect } from 'react'
import { Check, X, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  isVisible: boolean
  onClose: () => void
}

export function Notification({
  type,
  title,
  message,
  duration = 4000,
  isVisible,
  onClose
}: NotificationProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full mx-auto',
        'transform transition-all duration-300 ease-in-out',
        isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : '-translate-y-2 opacity-0 scale-95 pointer-events-none'
      )}
    >
      <div className={cn(
        'rounded-lg border shadow-lg p-4',
        colors[type]
      )}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', iconColors[type])} />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {message && (
              <p className="mt-1 text-sm opacity-90">{message}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors"
          >
            <X className="h-4 w-4 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing notifications
export function useNotification() {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
  } | null>(null)

  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    duration?: number
  ) => {
    setNotification({ type, title, message, duration })
  }

  const hideNotification = () => {
    setNotification(null)
  }

  return {
    notification,
    showNotification,
    hideNotification
  }
}
