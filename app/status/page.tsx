'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ChevronLeft,
  Search,
  Camera,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Share2,
  Download,
  User,
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import clsx from 'clsx';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function StatusPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [trackingCode, setTrackingCode] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchReport = async (id: string) => {
      setLoading(true);
      try {
        // Verify ID format first
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
          throw new Error('Invalid report ID format');
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
            assigned_officer:police_officers!crime_reports_assigned_officer_fkey(
              id,
              badge_number
            ),
            evidence(
              file_path,
              type
            ),
            status_updates(
              status,
              description,
              created_at
            ),
            current_status
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Supabase Error Details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            stack: error.stack
          });
          throw error;
        }

        // Ensure we have data before formatting
        if (!data) {
          console.error('No data found for report ID:', id);
          throw new Error('Report not found in database');
        }
        
        // Format the date
        data.formatted_date = new Date(data.created_at).toLocaleDateString();
        data.formatted_time = new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Format status updates if they exist
        if (data.status_updates && data.status_updates.length > 0) {
          data.status_updates = data.status_updates.map((update: any) => ({
            ...update,
            formatted_date: new Date(update.created_at).toLocaleDateString(),
            formatted_time: new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
        setReport(data);
      } catch (error) {
        // Comprehensive error logging with structured output
        console.error('Full Error:', JSON.stringify(
          error instanceof Error 
            ? {
                message: error.message,
                name: error.name,
                stack: error.stack,
                cause: error.cause
              } 
            : error, 
          null, 
          2
        ));
        setReport(null);
      } finally {
        setLoading(false);
      }
    }

    const id = searchParams.get('id')
    if (id) {
      setTrackingCode(id)
      fetchReport(id)
    }
  }, [searchParams])

  const handleSearch = () => {
    if (trackingCode.trim()) {
      router.push(`/status?id=${trackingCode}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <main className="flex min-h-screen flex-col pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Track Status</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="space-y-6 max-w-md mx-auto">
          {/* Token Entry Card */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="text-white">Enter Tracking Code</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="e.g. A7X29B" 
                  className="font-mono" 
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {loading && (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && report && (
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline">
                <Card className="border-none shadow-md overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Report #{report.id.substring(0, 6).toUpperCase()}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={clsx(
                          "border-0", // Remove default border
                          {
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': 
                              (report.current_status || report.status) === 'resolved',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': 
                              (report.current_status || report.status) === 'under_investigation',
                            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': 
                              (report.current_status || report.status) === 'received',
                            // Default styling if no match
                            'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300': 
                              !['resolved', 'under_investigation', 'received'].includes(report.current_status || report.status)
                          }
                        )}
                      >
                        {(report.current_status || report.status)?.replace(/_/g, ' ')?.toUpperCase() || 'In Progress'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-6">
                      {/* Timeline - Dynamic from status_updates */}
                      <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                        {report.status_updates && report.status_updates.length > 0 ? (
                          report.status_updates.map((update: any, index: number) => (
                            <div key={index} className="relative">
                              <div className={`absolute -left-[25px] h-6 w-6 rounded-full ${
                                index === 0 ? 'bg-green-500' : 'bg-blue-500'
                              } flex items-center justify-center`}>
                                {index === 0 ? (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                ) : (
                                  <div className="h-3 w-3 bg-white rounded-full" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium capitalize">
                                  {update.status.toLowerCase().replace(/_/g, ' ')}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{update.formatted_date}, {update.formatted_time}</span>
                                </div>
                                {update.description && (
                                  <p className="text-sm mt-1">
                                    {update.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          // Fallback if no status updates exist
                          <div className="relative">
                            <div className="absolute -left-[25px] h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">Report Received</p>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{report.formatted_date}, {report.formatted_time}</span>
                              </div>
                              <p className="text-sm mt-1">
                                Your {report.crime_type.toLowerCase()} report has been successfully submitted.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contact Button */}
                      <Button className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Responder
                      </Button>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card className="border-none shadow-md overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle>Report Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Report ID</span>
                          <span className="font-medium">{report.id.substring(0, 6).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Type</span>
                          <span className="font-medium">{report.crime_type}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Date Reported</span>
                          <span className="font-medium">{report.formatted_date}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Time Reported</span>
                          <span className="font-medium">{report.formatted_time}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Status</span>
                          <Badge
                            variant="outline"
                            className={clsx(
                              "border-0", 
                              {
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': 
                                  (report.current_status || report.status) === 'resolved',
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': 
                                  (report.current_status || report.status) === 'under_investigation',
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': 
                                  (report.current_status || report.status) === 'received',
                                'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300': 
                                  !['resolved', 'under_investigation', 'received'].includes(report.current_status || report.status)
                              }
                            )}
                          >
                            {(report.current_status || report.status)?.replace(/_/g, ' ')?.toUpperCase() || 'In Progress'}
                          </Badge>
                        </div>
                        {report.assigned_officer && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Assigned Officer</span>
                            <span className="font-medium">Officer {report.assigned_officer}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                          {report.description}
                        </p>
                      </div>

                      {report.evidence && report.evidence.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Evidence Submitted</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {report.evidence.map((evidence: any, index: number) => (
                              <a 
                                key={index}
                                href={supabase.storage.from('evidence').getPublicUrl(evidence.file_path).data.publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-100 dark:bg-gray-800 aspect-square rounded-md flex items-center justify-center hover:opacity-75 transition-opacity"
                              >
                                {evidence.type === 'IMAGE' ? (
                                  <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                ) : (
                                  <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                )}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="map">
                <Card className="border-none shadow-md overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle>Responder Location</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Map showing responder proximity */}
                      <div className="relative w-full h-60 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=800')] bg-cover bg-center opacity-50"></div>

                        {/* User location marker */}
                        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                          <div className="absolute -top-1 -left-1 h-5 w-5 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
                          <div className="text-xs mt-1 font-medium bg-white/80 dark:bg-gray-900/80 px-1 rounded">You</div>
                        </div>

                        {/* Responder location marker */}
                        <div className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                          <div className="absolute -top-1 -left-1 h-5 w-5 bg-green-500 rounded-full opacity-30 animate-ping"></div>
                          <div className="text-xs mt-1 font-medium bg-white/80 dark:bg-gray-900/80 px-1 rounded">
                            Officer
                          </div>
                        </div>

                        {/* Distance line */}
                        <div className="absolute top-1/2 left-1/3 w-[33%] h-[1px] bg-gray-400"></div>

                        {/* Map legend */}
                        <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 rounded-md text-xs shadow-md">
                          <div className="flex items-center mb-1">
                            <div className="h-2 w-2 bg-blue-500 rounded-full mr-1"></div>
                            <span>Your Location</span>
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                            <span>Officer Location</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>0.8 miles away</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>ETA: ~10 min</span>
                        </div>
                      </div>

                      {report.assigned_officer && (
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                          <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
                            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>
                              Officer {report.assigned_officer} is reviewing your report. You can contact them directly using the button below.
                            </span>
                          </p>
                        </div>
                      )}

                      <Button className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Officer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {!loading && !report && trackingCode && (
            <Card className="border-none shadow-md overflow-hidden">
              <CardContent className="p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-lg font-bold mb-2">Report Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  We couldn't find a report with the tracking code "{trackingCode}". Please check the code and try again.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t py-2 shadow-lg">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center p-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
              <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/report" className="flex flex-col items-center p-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
              <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-xs mt-1">Report</span>
          </Link>
          <Link href="/status" className="flex flex-col items-center p-2">
            <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
              <Search className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs mt-1 font-medium">Status</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center p-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}