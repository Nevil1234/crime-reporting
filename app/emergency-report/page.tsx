'use client'
  import { useState, useEffect } from 'react'
  import { useRouter } from 'next/navigation'
  import { createClient } from '@supabase/supabase-js'
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Textarea } from "@/components/ui/textarea"
  import { Switch } from "@/components/ui/switch"
  import { Label } from "@/components/ui/label"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    X,
    Trash2,
  } from "lucide-react"
  import Link from "next/link"
  import InteractiveMap from "@/components/interactive-map"
  import { v4 as uuidv4 } from 'uuid'
  import { Progress } from "@/components/ui/progress"

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Define evidence types
  type EvidenceType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'

  export default function ReportPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
      crimeType: '',
      description: '',
      location: [37.7749, -122.4194] as [number, number], // Default to SF
      media: [] as string[],
      address: 'Detecting location...',
    })
    
    // Add file upload state
    const [files, setFiles] = useState<File[]>([])
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            const address = await reverseGeocode(latitude, longitude)
            setFormData(prev => ({
              ...prev,
              location: [latitude, longitude],
              address: address || 'Location detected'
            }))
          },
          () => {
            setFormData(prev => ({
              ...prev,
              address: 'Location detection failed'
            }))
          }
        )
      }
    }, [])

    const reverseGeocode = async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
        )
        const data = await response.json()
        return data.features[0]?.place_name
      } catch (error) {
        console.error('Geocoding failed:', error)
        return 'Unknown location'
      }
    }
    
    // File handling functions
    const handleFileUpload = async (file: File) => {
      const uniqueId = uuidv4()
      const fileExt = file.name.split('.').pop()
      const fileName = `${uniqueId}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('evidence')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) throw error
      return data.path
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files)
        setFiles(prev => [...prev, ...newFiles])
      }
    }

    const removeFile = (index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index))
    }
    
    // Helper function for file type
    const getFileType = (url: string): EvidenceType => {
      const extension = url.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'jpg': case 'jpeg': case 'png': case 'gif': return 'IMAGE';
        case 'mp4': case 'mov': case 'avi': return 'VIDEO';
        case 'mp3': case 'wav': return 'AUDIO';
        default: return 'DOCUMENT';
      }
    }

    // Updated handleSubmit function with status tracking and better file handling
    const handleSubmit = async () => {
      try {
        setIsSubmitting(true)
        
        // Upload files first
        const mediaUrls = await Promise.all(
          files.map(async (file) => {
            try {
              // Generate unique filename
              const fileExt = file.name.split('.').pop()
              const fileName = `${uuidv4()}.${fileExt}`
              
              // Upload to Supabase storage
              const { data, error } = await supabase.storage
                .from('evidence')
                .upload(fileName, file, {
                  cacheControl: '3600',
                  upsert: false,
                })

              if (error) throw error
              return { 
                path: data.path,
                type: file.type
              }
            } catch (error) {
              console.error('File upload error:', error)
              const errorMessage = error instanceof Error ? error.message : 'Unknown error'
              throw new Error(`Failed to upload ${file.name}: ${errorMessage}`)
            }
          })
        )
        
        // Get coordinates from state (latitude first in the array)
        const [lat, lng] = formData.location
        
        // Format using PostGIS-compatible EWKT
        const pointString = `SRID=4326;POINT(${lng} ${lat})`
        
        // Submit report with initial status
        const { data: report, error } = await supabase
          .from('crime_reports')
          .insert([{
            crime_type: formData.crimeType,
            description: formData.description,
            location: pointString,
            status: 'received',
            media: mediaUrls.map(item => item.path)
          }])
          .select('id')
          .single()

        if (error) {
          console.error('Database insert error:', error)
          throw new Error(`Database error: ${error.message}`)
        }
        
        // Create evidence records
        if (mediaUrls.length > 0) {
          const evidenceInserts = mediaUrls.map(item => ({
            file_path: item.path,
            type: getFileType(item.path), 
            report_id: report.id
          }))

          const { error: evidenceError } = await supabase
            .from('evidence')
            .insert(evidenceInserts)

          if (evidenceError) {
            console.error('Evidence insert error:', evidenceError)
            throw new Error(`Evidence save failed: ${evidenceError.message}`)
          }
        }
        
        // Create initial status update
        await supabase
          .from('status_updates')
          .insert([{
            report_id: report.id,
            status: 'received',
            description: 'Report submitted successfully'
          }])
          .then(({ error: statusError }) => {
            if (statusError) {
              console.error('Status update error:', statusError)
              // Don't throw here as the main report is already created
            }
          })
        
        router.push(`/report/confirmation?id=${report.id}`)
      } catch (error) {
        console.error('Full error:', error)
        alert(`Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <main className="flex min-h-screen flex-col pb-16 bg-gray-50 dark:bg-gray-950">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
          <Link href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Report Incident</h1>
        </header>

        <div className="flex-1 p-4">
          <div className="space-y-6 max-w-md mx-auto">
            {/* Location Card */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <InteractiveMap 
                    initialLocation={formData.location}
                    onLocationChange={(coords) => {
                      setFormData(prev => ({
                        ...prev,
                        location: coords,
                        address: 'Updating...'
                      }))
                      reverseGeocode(coords[0], coords[1]).then(address =>
                        setFormData(prev => ({ ...prev, address }))
                      )
                    }}
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Current location:</p>
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <MapPin className="h-4 w-4 mr-2" />
                      <p className="font-medium">{formData.address}</p>
                    </div>
                  </div>
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
                  {['Theft', 'Assault', 'Harassment', 'Vehicle', 'Property', 'Other'].map((type) => (
                    <Button
                      key={type}
                      variant={formData.crimeType === type ? 'default' : 'outline'}
                      className={`h-24 flex flex-col justify-center items-center border-2 transition-colors ${
                        formData.crimeType === type 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, crimeType: type }))}
                    >
                      <div className={`p-2 rounded-full mb-2 ${
                        formData.crimeType === type 
                          ? 'bg-white/20' 
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {type === 'Theft' && <Wallet className={`h-5 w-5 ${formData.crimeType === type ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />}
                        {type === 'Assault' && <Shield className={`h-5 w-5 ${formData.crimeType === type ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />}
                        {type === 'Harassment' && <UserX className={`h-5 w-5 ${formData.crimeType === type ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />}
                        {type === 'Vehicle' && <Car className={`h-5 w-5 ${formData.crimeType === type ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />}
                        {type === 'Property' && <Home className={`h-5 w-5 ${formData.crimeType === type ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />}
                        {type === 'Other' && <AlertTriangle className={`h-5 w-5 ${formData.crimeType === type ? 'text-white' : 'text-red-600 dark:text-red-400'}`} />}
                      </div>
                      <span>{type}</span>
                    </Button>
                  ))}
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
                    <Textarea 
                      placeholder="Describe what happened in detail..." 
                      className="min-h-[120px] resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Be specific</span>
                      <span>{formData.description.length}/500</span>
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
                    <p className="text-sm text-muted-foreground mt-3">Tap to record</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* File Upload Card - UPDATED */}
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="p-4">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Add Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="file-upload" className="w-full cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm font-medium">Upload photos, videos, or documents</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click to browse or drag and drop (max 10MB each)
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*, video/*, audio/*, .pdf, .doc, .docx"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </label>
                </div>
                
                {/* File preview */}
                {files.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Selected files ({files.length})</p>
                      {files.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setFiles([])}
                          className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 text-xs"
                        >
                          Remove All
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                      {files.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-md"
                        >
                          <div className="flex items-center space-x-3">
                            {file.type.startsWith('image/') ? (
                              <Camera className="h-5 w-5 text-blue-500" />
                            ) : file.type.startsWith('video/') ? (
                              <FileText className="h-5 w-5 text-purple-500" />
                            ) : (
                              <FileText className="h-5 w-5 text-gray-500" />
                            )}
                            <span className="text-sm font-medium truncate max-w-[200px]">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)}MB
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Upload progress */}
                {Object.keys(uploadProgress).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(uploadProgress).map(([id, progress]) => (
                      <div key={id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Uploading...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>


            {/* Submit Button */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 h-12 font-medium"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.crimeType || !formData.description}
              >
                {isSubmitting ? "Submitting..." : "Continue"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By submitting, you confirm the report is truthful
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }