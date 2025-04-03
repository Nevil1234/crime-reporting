"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Shield,
  AlertTriangle,
  Wallet,
  UserX,
  Bell,
  User,
  ChevronRight,
  TrendingUp,
  Clock,
  FileText,
  Phone,
} from "lucide-react"
import CrimeMap from "@/components/crime-map"
import QuickReportChip from "@/components/quick-report-chip"
import NetworkStatus from "@/components/network-status"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RecentAlerts from "@/components/recent-alerts"
import StatisticCard from "@/components/statistic-card"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Header with SOS toggle */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-red-600 to-red-500 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            SafeReport
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          </Link>
          <Link href="/profile">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                JD
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </header>

      {/* Network Status Indicator */}
      <NetworkStatus />

      {/* Emergency SOS Button */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white/20 p-1.5 rounded-full mr-3">
            <Phone className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium">Emergency Assistance</p>
            <p className="text-white/80 text-xs">Tap for immediate help</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="bg-white text-red-600 hover:bg-white/90 rounded-full px-4 font-bold"
          onClick={() => router.push("/emergency-report")}
        >
          SOS
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-6 max-w-5xl mx-auto w-full">
        {/* Tabs for different views */}
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {/* Map Section */}
            <Card className="overflow-hidden border-none shadow-md">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-white">Nearby Incidents</h2>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/20">
                      Live
                    </Badge>
                  </div>
                </div>
                <CrimeMap />
                <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Downtown, Cityville</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs flex items-center">
                    View Details
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Report Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Quick Report</h2>
                <Link href="/report-types">
                  <Button variant="ghost" size="sm" className="text-xs flex items-center">
                    View All
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <QuickReportChip
                  icon={<Wallet className="h-5 w-5" />}
                  label="Theft"
                  href="/report?type=theft"
                  description="Property stolen"
                />
                <QuickReportChip
                  icon={<Shield className="h-5 w-5" />}
                  label="Assault"
                  href="/report?type=assault"
                  description="Physical attack"
                />
                <QuickReportChip
                  icon={<UserX className="h-5 w-5" />}
                  label="Harassment"
                  href="/report?type=harassment"
                  description="Threatening behavior"
                />
                <QuickReportChip
                  icon={<AlertTriangle className="h-5 w-5" />}
                  label="Other"
                  href="/report"
                  description="Custom report"
                />
              </div>
            </div>

            {/* Recent Reports */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Reports</h2>
                <Link href="/reports">
                  <Button variant="ghost" size="sm" className="text-xs flex items-center">
                    View All
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <Card className="bg-white dark:bg-gray-900 border-none shadow-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="border-l-4 border-yellow-500 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 mr-2"
                          >
                            In Progress
                          </Badge>
                          <p className="font-medium">Report #A7X29B</p>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>0.8 miles away</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>2 hours ago</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-full">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="border-l-4 border-green-500 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800 mr-2"
                          >
                            Resolved
                          </Badge>
                          <p className="font-medium">Report #B8Y31C</p>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>1.2 miles away</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Yesterday</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-full">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Safety Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-none shadow-md overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-medium">Safety Tip</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Always be aware of your surroundings, especially when walking alone at night.
                    </p>
                    <Button variant="link" className="text-blue-600 dark:text-blue-400 p-0 h-auto mt-1 text-sm">
                      View more tips
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <RecentAlerts />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <StatisticCard
                title="Reports Today"
                value="24"
                change="+12%"
                icon={<FileText className="h-5 w-5" />}
                trend="up"
              />
              <StatisticCard
                title="Response Time"
                value="18 min"
                change="-5%"
                icon={<Clock className="h-5 w-5" />}
                trend="down"
              />
              <StatisticCard
                title="Resolution Rate"
                value="86%"
                change="+3%"
                icon={<TrendingUp className="h-5 w-5" />}
                trend="up"
              />
              <StatisticCard
                title="Active Cases"
                value="142"
                change="-8%"
                icon={<FileText className="h-5 w-5" />}
                trend="down"
              />
            </div>

            <Card className="border-none shadow-md overflow-hidden">
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Crime Trends (Last 30 Days)</h3>
                <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Chart visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4">
        <Link href="/report">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-lg border-none"
          >
            <AlertTriangle className="h-6 w-6 text-white" />
            <span className="sr-only">Report Crime</span>
          </Button>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t py-2 shadow-lg">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center p-2">
            <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
              <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs mt-1 font-medium">Home</span>
          </Link>
          <Link href="/report" className="flex flex-col items-center p-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
              <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <span className="text-xs mt-1">Report</span>
          </Link>
          <Link href="/status" className="flex flex-col items-center p-2">
            <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full">
              <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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

