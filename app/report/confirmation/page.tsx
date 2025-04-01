import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Copy, Check, Share2, Download, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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
                <span className="font-mono font-bold text-lg">A7X29B</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Copy className="h-4 w-4" />
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
                    <span className="font-medium">Theft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">123 Main Street, Cityville</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">March 29, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                    >
                      Processing
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3 p-6 pt-0">
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="outline" size="sm" className="flex items-center justify-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex items-center justify-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              <Link href="/status" className="w-full">
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

