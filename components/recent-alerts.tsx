import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Clock, ChevronRight, Bell, Shield } from "lucide-react"

export default function RecentAlerts() {
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
            <Bell className="mr-2 h-5 w-5" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-l-4 border-red-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Badge variant="destructive" className="mr-2">
                    Urgent
                  </Badge>
                  <p className="font-medium">Robbery in Progress</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Downtown, 5th Avenue</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>15 minutes ago</span>
                </div>
                <p className="text-sm mt-1">Armed robbery reported at First National Bank. Avoid the area.</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-l-4 border-yellow-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 mr-2"
                  >
                    Warning
                  </Badge>
                  <p className="font-medium">Suspicious Activity</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Westside Park</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>1 hour ago</span>
                </div>
                <p className="text-sm mt-1">
                  Multiple reports of suspicious individuals in the park area. Exercise caution.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-l-4 border-blue-500 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800 mr-2"
                  >
                    Notice
                  </Badge>
                  <p className="font-medium">Road Closure</p>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Main Street & 3rd Avenue</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>3 hours ago</span>
                </div>
                <p className="text-sm mt-1">Road closed due to police investigation. Use alternate routes.</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
                Increased theft reports in the downtown area. Keep valuables secure and be aware of your surroundings.
              </p>
              <Button variant="link" className="text-red-600 dark:text-red-400 p-0 h-auto mt-1 text-sm">
                View safety tips
              </Button>
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
                Join your neighborhood watch program to help keep your community safe.
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

