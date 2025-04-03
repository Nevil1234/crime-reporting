'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Copy, Check, Share2, Download, AlertTriangle, Camera, FileText } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ConfirmationPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const reportId = searchParams.get('id')

  useEffect(() => {
    const fetchReport = async () => {
      try {
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
      <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
          <h1 className="text-xl font-bold">Loading Report...</h1>
        </header>
        <div className="flex-1 p-4 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
        </div>
      </main>
    )
  }

  if (!report) {
    return (
      <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
          <h1 className="text-xl font-bold">Report Not Found</h1>
        </header>
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
      </main>
    )
  }

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

      {/* Main Content */}
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

              <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Please save this tracking code. You'll need it to check the status of your report.</span>
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Report Details:</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{report.crime_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium truncate max-w-[220px]" title={report.address}>
                      {report.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{report.created_at}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                    >
                      {report.status || 'Processing'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Evidence Preview */}
              {report.evidence && report.evidence.length > 0 && (
  <div className="space-y-2">
    <p className="font-medium">Evidence:</p>
    <div className="grid grid-cols-3 gap-2">
      {report.evidence.map((evidence: any, index: number) => {
        const fileUrl = supabase.storage
          .from('evidence')
          .getPublicUrl(evidence.file_path).data.publicUrl;

        return (
          <a
            key={index}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 dark:bg-gray-800 aspect-square rounded-md flex items-center justify-center hover:opacity-75 transition-opacity relative group"
          >
            {evidence.type === 'IMAGE' ? (
              <>
                <img
                  src={fileUrl}
                  alt="Evidence"
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <Camera className="h-6 w-6 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            ) : (
              <div className="p-2 text-center">
                <FileText className="h-8 w-8 text-gray-500 dark:text-gray-400 mb-1" />
                <span className="text-xs break-all">{evidence.file_path.split('/').pop()}</span>
              </div>
            )}
          </a>
        );
      })}
    </div>
  </div>
)}

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

          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">What happens next?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your report will be reviewed by our team and assigned to an officer. You'll receive updates on the
                    status of your report through the tracking system.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}