import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChevronLeft,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  FileText,
  User,
  Trash2,
  Search,
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  return (
    <main className="flex min-h-screen flex-col pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="space-y-6 max-w-md mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="updates">Updates</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4">
                    <div className="flex items-start">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Emergency Alert</p>
                          <Badge variant="destructive">New</Badge>
                        </div>
                        <p className="text-sm mt-1">Robbery reported near your location. Stay vigilant.</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Downtown, 5th Avenue</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>15 minutes ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-blue-500 p-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">New Message</p>
                        <p className="text-sm mt-1">Officer Johnson has sent you a message regarding your report.</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>1 hour ago</span>
                        </div>
                        <Button variant="link" className="text-blue-600 dark:text-blue-400 p-0 h-auto mt-1 text-sm">
                          View message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-green-500 p-4">
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Report Status Update</p>
                        <p className="text-sm mt-1">
                          Your report #B8Y31C has been resolved. Thank you for your cooperation.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Yesterday</span>
                        </div>
                        <Button variant="link" className="text-green-600 dark:text-green-400 p-0 h-auto mt-1 text-sm">
                          View details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-gray-300 dark:border-gray-700 p-4">
                    <div className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3 flex-shrink-0">
                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">System Notification</p>
                        <p className="text-sm mt-1">
                          SafeReport has been updated to version 2.0.1 with new features and improvements.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>2 days ago</span>
                        </div>
                        <Button variant="link" className="text-gray-600 dark:text-gray-400 p-0 h-auto mt-1 text-sm">
                          Learn more
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-3">
              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4">
                    <div className="flex items-start">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Emergency Alert</p>
                          <Badge variant="destructive">New</Badge>
                        </div>
                        <p className="text-sm mt-1">Robbery reported near your location. Stay vigilant.</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>Downtown, 5th Avenue</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>15 minutes ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-yellow-500 p-4">
                    <div className="flex items-start">
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="font-medium">Weather Alert</p>
                        <p className="text-sm mt-1">
                          Heavy rain expected in your area. Be cautious of potential flooding.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>3 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="updates" className="space-y-3">
              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-blue-500 p-4">
                    <div className="flex items-start">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">New Message</p>
                        <p className="text-sm mt-1">Officer Johnson has sent you a message regarding your report.</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>1 hour ago</span>
                        </div>
                        <Button variant="link" className="text-blue-600 dark:text-blue-400 p-0 h-auto mt-1 text-sm">
                          View message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-green-500 p-4">
                    <div className="flex items-start">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Report Status Update</p>
                        <p className="text-sm mt-1">
                          Your report #B8Y31C has been resolved. Thank you for your cooperation.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Yesterday</span>
                        </div>
                        <Button variant="link" className="text-green-600 dark:text-green-400 p-0 h-auto mt-1 text-sm">
                          View details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-gray-300 dark:border-gray-700 p-4">
                    <div className="flex items-start">
                      <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full mr-3 flex-shrink-0">
                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">System Notification</p>
                        <p className="text-sm mt-1">
                          SafeReport has been updated to version 2.0.1 with new features and improvements.
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>2 days ago</span>
                        </div>
                        <Button variant="link" className="text-gray-600 dark:text-gray-400 p-0 h-auto mt-1 text-sm">
                          Learn more
                        </Button>
                      </div>
                    </div>
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
              <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-xs mt-1">Report</span>
          </Link>
          <Link href="/status" className="flex flex-col items-center p-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-xs mt-1">Status</span>
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

