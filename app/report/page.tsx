import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from '@/supabase/supabaseClient';

import {
  ChevronLeft,
  MapPin,
  Mic,
  Camera,
  Shield,
  AlertTriangle,
  Wallet,
  UserX,
  Car,
  Home,
  FileText,
  Info,
} from "lucide-react"
import Link from "next/link"
import ReportLocationMap from "@/components/report-location-map"
import { Progress } from "@/components/ui/progress"


// const handleFileUpload = async (files: FileList) => {
//   const uploadPromises = Array.from(files).map(async (file) => {
//     const formData = new FormData()
//     formData.append('file', file)
    
//     const response = await fetch('/api/upload', {
//       method: 'POST',
//       body: formData
//     })
    
//     return response.json()
//   })

//   const uploadedFiles = await Promise.all(uploadPromises)
//   setFormData({ ...formData, media: [...formData.media, ...uploadedFiles.map(f => f.url)] })
// }

//     // Generate public URL
//     const { data: publicUrlData } = supabase.storage.from(folder).getPublicUrl(fileName);

//     return publicUrlData?.publicUrl || null;
// }

export default function ReportPage() {
  return (
    <main className="flex min-h-screen flex-col pb-16 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Report Incident</h1>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="space-y-6 max-w-md mx-auto">
          {/* Step indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Step 1 of 3</span>
              <span className="text-muted-foreground">Basic Details</span>
            </div>
            <Progress value={33} className="h-2" />
          </div>

          {/* Location Card */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
              <CardTitle className="flex items-center text-white">
                <MapPin className="mr-2 h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ReportLocationMap />
              <div className="p-4 space-y-3">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md flex items-start">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Your location has been automatically detected. You can adjust it if needed.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">Current location:</p>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <p className="font-medium">123 Main Street, Cityville</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Adjust Location
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Incident Type Card */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle>Incident Type</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center items-center border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mb-2">
                    <Wallet className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span>Theft</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center items-center border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mb-2">
                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span>Assault</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center items-center border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mb-2">
                    <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span>Harassment</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center items-center border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mb-2">
                    <Car className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span>Vehicle</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center items-center border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mb-2">
                    <Home className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span>Property</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col justify-center items-center border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span>Other</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="voice">Voice</TabsTrigger>
                </TabsList>
                <TabsContent value="text">
                  <Textarea placeholder="Describe what happened in detail..." className="min-h-[120px] resize-none" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Be as specific as possible</span>
                    <span>0/500</span>
                  </div>
                </TabsContent>
                <TabsContent value="voice" className="flex flex-col items-center justify-center h-[120px]">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full h-16 w-16 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Mic className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">Tap to start recording</p>
                </TabsContent>
              </Tabs>

              <div className="mt-4 space-y-3">
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Camera className="mr-2 h-4 w-4" />
                  Add Photos/Videos
                </Button>

                <Button variant="outline" className="w-full flex items-center justify-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Attach Documents
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Anonymous Toggle */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonymous-mode" className="text-base font-medium">
                    Anonymous Report
                  </Label>
                  <p className="text-sm text-muted-foreground">Hide your identity from public</p>
                </div>
                <Switch id="anonymous-mode" />
              </div>

              <div className="mt-4 bg-yellow-50 dark:bg-yellow-950/30 p-3 rounded-md">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start">
                  <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    Your information will still be available to law enforcement officials but hidden from public
                    records.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="space-y-3">
            <Link href="/report/confirmation">
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 h-12 font-medium">
                Continue
              </Button>
            </Link>
            <p className="text-center text-xs text-muted-foreground">
              By continuing, you confirm that this report is truthful to the best of your knowledge.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

