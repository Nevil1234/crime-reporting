"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Show the status briefly when coming back online
      setIsVisible(true)
      setTimeout(() => setIsVisible(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setIsVisible(true)
    }

    try {
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      // Set initial state safely
      setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true)
    } catch (error) {
      console.error("Error setting up network listeners:", error)
      // Default to online if we can't detect
      setIsOnline(true)
    }

    return () => {
      try {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      } catch (error) {
        console.error("Error removing network listeners:", error)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <Alert
      variant={isOnline ? "default" : "destructive"}
      className="rounded-none border-x-0 animate-in fade-in slide-in-from-top duration-300"
    >
      {isOnline ? (
        <AlertDescription className="flex items-center">
          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
          You're back online.
        </AlertDescription>
      ) : (
        <AlertDescription className="flex items-center">
          <WifiOff className="h-4 w-4 mr-2" />
          You're offline. Some features may be limited.
        </AlertDescription>
      )}
    </Alert>
  )
}

