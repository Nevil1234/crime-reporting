'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Check, Copy, ChevronLeft, AlertTriangle, Share2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Create a client component that uses useSearchParams
function ConfirmationContent() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const reportId = searchParams.get('id')

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!reportId) {
          setLoading(false)
          return
        }
        
        const { data, error } = await supabase
          .from('crime_reports')
          .select(`
            id,
            crime_type,
            description,
            created_at,
            status,
            location,
            evidence(
              file_path,
              type
            ),
            assigned_officer:police_officers(
              badge_number
            )
          `)
          .eq('id', reportId)
          .single();

        if (error) throw error
        
        // Reverse geocode location
        const [lat, lng] = await getCoordinates(data.location)
        const address = await reverseGeocode(lat, lng)
        
        setReport({
          ...data,
          address,
          created_at: new Date(data.created_at).toLocaleDateString()
        })
      } catch (error) {
        console.error('Error fetching report:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [reportId, router])

  // Add real-time updates
  useEffect(() => {
    if (reportId) {
      // Clear Supabase cache for fresh data
      supabase.realtime.channel('reports').send({
        type: 'broadcast',
        event: 'refresh',
        payload: { report_id: reportId }
      });
    }
  }, [reportId]);

  const getCoordinates = async (location: string) => {
    // Extract coordinates from POINT format
    const match = location.match(/POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/) || 
    location.match(/SRID=\d+;POINT\((-?\d+\.?\d*) (-?\d+\.?\d*)\)/);
    if (match){
      return [parseFloat(match[2]), parseFloat(match[1])];
    }
    return [0, 0];
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      return data.features[0]?.place_name || 'Location not available';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Location detection failed';
    }
  };

  const copyTrackingCode = () => {
    if (!reportId) return
    navigator.clipboard.writeText(reportId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <Card className="border-none shadow-md overflow-hidden max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Report Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The report you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/report">
              <Button className="w-full">Submit a New Report</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Success Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <svg className="absolute top-0 left-0 h-24 w-24" viewBox="0 0 100 100">
              <circle
                className="text-green-600 dark:text-green-400"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="46"
                cx="50"
                cy="50"
                strokeDasharray="289.027"
                strokeDashoffset="0"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "center",
                  animation: "circle-animation 1s ease-in-out forwards",
                }}
              />
            </svg>
          </div>
        </div>

        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardTitle className="text-center text-white">Report Submitted Successfully</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <p className="text-center text-muted-foreground">
              Your report has been received and is being processed. Use the tracking code below to check the status of
              your report.
            </p>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md flex justify-between items-center">
              <span className="font-mono font-bold text-lg">{reportId}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={copyTrackingCode}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            {/* Rest of the component... */}
            {/* Content trimmed for brevity */}
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 p-6 pt-0">
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" size="sm" className="flex items-center justify-center" onClick={copyTrackingCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy ID
              </Button>
              <Button variant="outline" size="sm" className="flex items-center justify-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <Link href={`/status?id=${reportId}`} className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Track Report Status
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ConfirmationPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
        <Link href="/report" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Report Submitted</h1>
      </header>

      <Suspense fallback={
        <div className="flex-1 p-4 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading confirmation...</p>
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </main>
  );
}