'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronLeft,
  MapPin,
  AlertTriangle,
  Shield,
  User,
  Phone,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import InteractiveMap from "@/components/interactive-map"
import { Progress } from "@/components/ui/progress"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SosPage() {
  const router = useRouter()
  const [location, setLocation] = useState<[number, number] | null>(null)
  const [address, setAddress] = useState('Detecting location...')
  const [contacts, setContacts] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState(0)

  // Get current user
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  useEffect(() => {
    const loadContacts = async () => {
      if (!user?.id) return
      
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('id, phone_number, name, relationship')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
  
      if (error) {
        console.error('Error loading emergency contacts:', error)
        return
      }
  
      if (data) setContacts(data)
    }
    
    if (user) loadContacts()
  }, [user])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  // Get initial location
  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation([latitude, longitude])
        const addr = await reverseGeocode(latitude, longitude)
        setAddress(addr)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setAddress('Location detection failed - using last known position')
      }
    )
  }, [])

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      )
      const data = await response.json()
      return data.features[0]?.place_name || 'Unknown location'
    } catch (error) {
      return 'Location detection failed'
    }
  }

  const sendEmergencyAlert = async () => {
    setIsSending(true)
    try {
      // 1. Create emergency report
      const reportData = {
        crime_type: 'EMERGENCY',
        description: 'SOS Emergency Alert Activated',
        location: `SRID=4326;POINT(${location?.[1]} ${location?.[0]})`,
        status: 'received',
        priority: 'EMERGENCY',
        complainant_id: user.id
      }

      const { data: report, error } = await supabase
        .from('crime_reports')
        .insert([reportData])
        .select('id')
        .single()

      if (error) throw error

      // 2. Find nearest available officers
      const { data: officers } = await supabase
        .from('police_officers')
        .select('*, current_location')
        .eq('is_available', true)
        .order('current_location', {
          ascending: true,
          foreignTable: 'police_officers.current_location',
          options: {
            referencePoint: location?.join(',')
          }
        })
        .limit(3)

      // 3. Send alerts to officers
      if (officers && officers.length > 0) {
        await Promise.all(officers.map(async (officer) => {
          await supabase
            .from('notifications')
            .insert({
              user_id: officer.user_id,
              message: `EMERGENCY ALERT: User at ${address}`,
              type: 'emergency',
              report_id: report.id
            })
        }))
        setProgress(30)
      }

      // 4. Send SMS to emergency contacts
      // Fix the SMS sending code in the sendEmergencyAlert function

// 4. Send SMS to emergency contacts
if (contacts.length > 0) {
  await Promise.all(contacts.map(async (contact) => {
    await fetch('/api/send-sms', { // Fixed API path
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: contact.phone_number, // Fixed to use contact.phone_number
        body: `EMERGENCY: I need help at ${address}. My current location: https://maps.google.com/?q=${location?.[0]},${location?.[1]}`
      })
    })
  }))
  setProgress(70)
}

      // 5. Create status update
      await supabase
        .from('status_updates')
        .insert([{
          report_id: report.id,
          status: 'emergency_dispatched',
          description: 'Emergency services notified'
        }])

      setProgress(100)
      router.push(`/report/confirmation?id=${report.id}`)

    } catch (error) {
      console.error('Emergency failed:', error)
      alert('Emergency activation failed. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col pb-16 bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Emergency SOS</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="space-y-6 max-w-md mx-auto">
          {/* Location Card */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-red-600 text-white p-4">
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Your Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[300px] mb-4">
                {location ? (
                  <InteractiveMap 
                    initialLocation={location}
                    onLocationChange={() => {}} // Add required prop with no-op function since we don't need to track changes in static mode
                  />
                ) : (
                  <div className="bg-gray-100 h-full animate-pulse rounded-md" />
                )}
              </div>
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                <MapPin className="h-4 w-4 mr-2" />
                <p className="font-medium">{address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-red-600 text-white p-4">
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
              <Button 
  variant="outline" 
  className="w-full h-14 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/30"
  onClick={() => router.push('/profile')}
>
  + Add Emergency Contacts
</Button>
                

{contacts.map((contact, index) => (
  <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
    <div className="flex items-center">
      <User className="h-4 w-4 mr-2" />
      <div>
        <p className="font-medium">{contact.name}</p>
        <p className="text-xs text-muted-foreground">{contact.phone_number}</p>
      </div>
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setContacts(prev => prev.filter(p => p.phone_number !== contact.phone_number))}
      className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
    >
      Remove
    </Button>
  </div>
))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          {isSending && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Activating emergency response...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* SOS Button */}
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 h-16 text-xl font-bold animate-pulse"
            onClick={sendEmergencyAlert}
            disabled={isSending || !location}
          >
            {isSending ? (
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Activating SOS...
              </div>
            ) : (
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                ACTIVATE EMERGENCY SOS
              </div>
            )}
          </Button>

<div className="text-center mt-4">
  <p className="text-sm text-muted-foreground mb-2">
    Can't type? Use voice assistance
  </p>
  <a 
    href="/components/index.html" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700"
  >
    <Phone className="h-4 w-4" />
    <span className="underline">Call Emergency Assistant</span>
  </a>
</div>
        </div>
      </div>
    </main>
  )
}