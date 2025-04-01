"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CrimeMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would initialize a map library like Google Maps or Mapbox
    // For this prototype, we'll just simulate a map with CSS

    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Safely try to get user's location with proper error handling
    if (navigator.geolocation) {
      try {
        // Just attempt to get permission, but don't wait for the result
        navigator.permissions
          .query({ name: "geolocation" as PermissionName })
          .then((permissionStatus) => {
            console.log("Geolocation permission status:", permissionStatus.state)
          })
          .catch((error) => {
            console.log("Permission API not available")
          })
      } catch (error) {
        console.log("Geolocation error handled gracefully")
      }
    }

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-56 bg-gray-100 dark:bg-gray-800 overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <>
          <div ref={mapRef} className="w-full h-full">
            {/* Simulated map with CSS */}
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] bg-cover bg-center opacity-50"></div>

            {/* User location marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute -top-1 -left-1 h-6 w-6 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
            </div>

            {/* Sample incident markers with tooltips */}
            <div className="absolute top-[30%] left-[40%] group">
              <div className="relative">
                <MapPin className="h-6 w-6 text-red-500 filter drop-shadow-md" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-white dark:bg-gray-900 p-2 rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-bold">Theft Reported</p>
                  <p className="text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="absolute top-[60%] left-[70%] group">
              <div className="relative">
                <MapPin className="h-6 w-6 text-red-500 filter drop-shadow-md" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-white dark:bg-gray-900 p-2 rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-bold">Harassment</p>
                  <p className="text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
            <div className="absolute top-[45%] left-[20%] group">
              <div className="relative">
                <MapPin className="h-6 w-6 text-yellow-500 filter drop-shadow-md" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-white dark:bg-gray-900 p-2 rounded shadow-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="font-bold">Suspicious Activity</p>
                  <p className="text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-3 right-3 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-white dark:bg-gray-800 shadow-md"
            >
              <Navigation className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-white dark:bg-gray-800 shadow-md"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-md text-xs shadow-md">
            <div className="flex items-center mb-1">
              <div className="h-2 w-2 bg-red-500 rounded-full mr-1"></div>
              <span>Recent Incidents</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></div>
              <span>Suspicious Activity</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

