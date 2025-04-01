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

export default function StatusPage() {
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
                <Input placeholder="e.g. A7X29B" className="font-mono" />
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <Search className="h-4 w-4" />
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

          {/* Status Tabs */}
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              {/* Status Timeline Card */}
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Report #A7X29B
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                    >
                      In Progress
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-6">
                    {/* Timeline */}
                    <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                      {/* Step 1 */}
                      <div className="relative">
                        <div className="absolute -left-[25px] h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Report Received</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Today, 10:30 AM</span>
                          </div>
                          <p className="text-sm mt-1">
                            Your report has been successfully submitted and is being reviewed.
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="relative">
                        <div className="absolute -left-[25px] h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Under Review</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Today, 10:45 AM</span>
                          </div>
                          <p className="text-sm mt-1">Officer Johnson has been assigned to review your case.</p>
                          <div className="flex items-center mt-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2">
                              <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-medium">Officer Johnson</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              Badge #4872
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="relative">
                        <div className="absolute -left-[25px] h-6 w-6 rounded-full bg-yellow-500 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Investigation</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>In progress</span>
                          </div>
                          <p className="text-sm mt-1">Officers are investigating your report and gathering evidence.</p>
                          <Button variant="link" className="p-0 h-auto text-sm text-blue-600 dark:text-blue-400 mt-1">
                            View investigation details
                          </Button>
                        </div>
                      </div>
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
                        <span className="font-medium">A7X29B</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">Theft</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Date Reported</span>
                        <span className="font-medium">March 29, 2025</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Time Reported</span>
                        <span className="font-medium">10:30 AM</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">123 Main Street, Cityville</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                        >
                          In Progress
                        </Badge>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Assigned Officer</span>
                        <span className="font-medium">Officer Johnson (#4872)</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                        My wallet was stolen while I was at the coffee shop on Main Street. It contained my ID, credit
                        cards, and about $50 in cash.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Evidence Submitted</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gray-100 dark:bg-gray-800 aspect-square rounded-md flex items-center justify-center">
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 aspect-square rounded-md flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
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

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                      <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start">
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          Officer Johnson is en route to your location. You can contact them directly using the button
                          below.
                        </span>
                      </p>
                    </div>

                    <Button className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Officer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

