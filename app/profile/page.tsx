import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  ChevronLeft,
  User,
  Bell,
  Moon,
  Globe,
  Shield,
  LogOut,
  ChevronRight,
  Phone,
  HelpCircle,
  FileText,
  Info,
  MapPin,
  AlertTriangle,
  Search,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function ProfilePage() {
  return (
    <main className="flex min-h-screen flex-col pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Profile</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="space-y-6 max-w-md mx-auto">
          {/* Profile Card */}
          <Card className="border-none shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-24"></div>
            <CardContent className="p-4 pt-0 -mt-12">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-900">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mt-2">John Doe</h2>
                <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                <div className="flex items-center mt-1">
                  <div className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-green-800 dark:text-green-400">Verified</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3">
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                      <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Label htmlFor="notifications" className="text-base">
                      Notifications
                    </Label>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                      <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Label htmlFor="dark-mode" className="text-base">
                      Dark Mode
                    </Label>
                  </div>
                  <Switch id="dark-mode" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                      <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Label className="text-base">Language</Label>
                      <p className="text-sm text-muted-foreground">English (US)</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <Label className="text-base">Privacy</Label>
                      <p className="text-sm text-muted-foreground">Manage your data</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                      <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Police</p>
                      <p className="text-sm text-muted-foreground">911</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                      <User className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Emergency Contact</p>
                      <p className="text-sm text-muted-foreground">Jane Doe (Wife)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-2">
                  Add Emergency Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support & Help */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Link href="/help">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="font-medium">Help & Support</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>

                <Separator />

                <Link href="/terms">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="font-medium">Terms & Privacy</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>

                <Separator />

                <Link href="/about">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="font-medium">About SafeReport</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>

          <p className="text-center text-xs text-muted-foreground">SafeReport v2.0.1 • © 2025</p>
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
            <div className="bg-red-100 dark:bg-red-900/30 p-1.5 rounded-full">
              <User className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs mt-1 font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </main>
  )
}

