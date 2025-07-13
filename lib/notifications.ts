"use client"

import { toast } from "sonner"
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"

export type NotificationType = "success" | "error" | "warning" | "info"

interface NotificationOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const notify = {
  success: (message: string, options?: NotificationOptions) => {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <CheckCircle className="h-4 w-4" />,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    })
  },

  error: (message: string, options?: NotificationOptions) => {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      icon: <XCircle className="h-4 w-4" />,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    })
  },

  warning: (message: string, options?: NotificationOptions) => {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      icon: <AlertTriangle className="h-4 w-4" />,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    })
  },

  info: (message: string, options?: NotificationOptions) => {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <Info className="h-4 w-4" />,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
    })
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    },
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    })
  },
}

// Notification preferences
export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  expiryReminders: boolean
  recipesSuggestions: boolean
  weeklyReports: boolean
}

export const defaultNotificationPreferences: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  expiryReminders: true,
  recipesSuggestions: true,
  weeklyReports: true,
}
