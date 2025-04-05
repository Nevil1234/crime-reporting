"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
  Loader2
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  const [showAddContact, setShowAddContact] = useState(false)
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  })

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          // Redirect to login if not authenticated
          router.push('/login')
          return
        }
        
        setUser(user)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [router])

  useEffect(() => {
    const loadContacts = async () => {
      if (!user) return
      
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
  
      if (!error && data) setContacts(data)
    }
    
    loadContacts()
  }, [user])

  useEffect(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state based on saved preference or system preference
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(initialDarkMode);
    
    // Apply theme to document
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Add contact submission handler
  const handleAddContact = async () => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .insert([{
          user_id: user.id,
          name: newContact.name,
          phone_number: newContact.phone,
          relationship: newContact.relationship
        }])

      if (error) throw error

      // Refresh contacts
      const { data } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)

      if (data) setContacts(data)
      setShowAddContact(false)
      setNewContact({ name: '', phone: '', relationship: '' })

    } catch (error) {
      console.error('Error adding contact:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
      </main>
    )
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
                    {user?.email?.slice(0, 2).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mt-2">
                  {user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center mt-1">
                  <div className="bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-xs text-green-800 dark:text-green-400">
                      {user?.email_confirmed_at ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
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
                  <Switch 
                    id="dark-mode" 
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
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

          {/* Emergency Contacts Card - UPDATED */}
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                        <User className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.relationship} • {contact.phone_number}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
                      <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Police</p>
                      <p className="text-sm text-muted-foreground">100</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setShowAddContact(true)}
                >
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
            onClick={handleLogout}
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

      {/* Add contact modal */}
      <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({...prev, name: e.target.value}))}
            />
            <Input
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({...prev, phone: e.target.value}))}
            />
            <Input
              placeholder="Relationship (optional)"
              value={newContact.relationship}
              onChange={(e) => setNewContact(prev => ({...prev, relationship: e.target.value}))}
            />
            <Button onClick={handleAddContact} className="w-full">Save Contact</Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}