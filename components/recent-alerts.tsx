"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Clock, ChevronRight, Shield, Link } from "lucide-react"
import clsx from "clsx"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Incident {
  id: string
  crime_type: string
  description: string
  created_at: string
  location: string
  status: string
}

export default function RecentAlerts() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const { data, error } = await supabase
          .from('crime_reports')
          .select(`
            id,
            crime_type,
            description,
            created_at,
            location,
            status
          `)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        setIncidents(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load alerts")
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [])

  const parseLocation = (wkt: string) => {
    const matches = wkt.match(/SRID=4326;POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/)
    return matches ? { lng: +matches[1], lat: +matches[2] } : null
  }

  const formatTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getBadgeType = (incident: Incident) => {
    switch (incident.crime_type.toLowerCase()) {
      case 'theft':
      case 'robbery':
        return 'urgent'
      case 'assault':
      case 'harassment':
        return 'warning'
      default:
        return 'notice'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Community Alerts</h2>
        <Button variant="ghost" size="sm" className="text-xs flex items-center">
          View All
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4">
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Recent Incidents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {incidents.map((incident) => {
            const location = parseLocation(incident.location)
            const badgeType = getBadgeType(incident)
            
            return (
              <div 
                key={incident.id}
                className={clsx("border-l-4 p-4", {
                  'border-red-500': badgeType === 'urgent',
                  'border-yellow-500': badgeType === 'warning',
                  'border-blue-500': badgeType === 'notice'
                })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={clsx("mr-2", {
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800': badgeType === 'urgent',
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800': badgeType === 'warning',
                          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800': badgeType === 'notice'
                        })}
                      >
                        {badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}
                      </Badge>
                      <p className="font-medium">{incident.crime_type}</p>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {location ? (
                        <span>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                      ) : (
                        <span>Unknown location</span>
                      )}
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTime(incident.created_at)}</span>
                    </div>
                    <p className="text-sm mt-1">{incident.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-medium">Safety Alert</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Always be aware of your surroundings and report any suspicious activity immediately.
              </p>
              <Link href="https://www.saferwatchapp.com/blog/report-suspicious-activity/">
              <Button variant="link" className="text-red-600 dark:text-red-400 p-0 h-auto mt-1 text-sm">
                View safety tips
              </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-medium">Community Watch</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Join local neighborhood watch programs to help keep your community safe.
              </p>
              <Button variant="link" className="text-green-600 dark:text-green-400 p-0 h-auto mt-1 text-sm">
                Learn more
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}