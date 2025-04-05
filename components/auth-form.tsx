// components/auth-form.tsx
"use client"

import { useState, useEffect } from "react" // Added useEffect
import { useForm } from "react-hook-form"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle } from "lucide-react" // Added CheckCircle
import { useRouter } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function AuthForm() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false) // Added success state
  const [successMessage, setSuccessMessage] = useState("") // Added success message
  const { register, handleSubmit } = useForm()

  const handleAuth = async (data: any) => {
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        if (error) throw error
        
        // Show success message
        setSuccess(true)
        setSuccessMessage("Login successful!")
        
        // Delay navigation to show success animation
        setTimeout(() => router.push("/"), 1500)
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            
            data: {
              username: data.username
            }
          }
        })
        if (error) throw error
        
        // Show success message
        setSuccess(true)
        setSuccessMessage("Account created successfully!")
        
        // Delay navigation to show success animation
        setTimeout(() => router.push("/"), 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
      setLoading(false)
    }
  }

  // Don't reset loading on success to keep button disabled
  useEffect(() => {
    if (!success) setLoading(false)
  }, [success])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-[350px] shadow-lg transition-all hover:shadow-xl">
        {success ? (
          // Success animation card content
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative flex items-center justify-center">
                <div className="absolute animate-ping h-16 w-16 rounded-full bg-green-400 opacity-30"></div>
                <div className="relative">
                  <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-center">{successMessage}</h3>
              <p className="mt-2 text-center text-gray-500">Redirecting you shortly...</p>
            </div>
          </CardContent>
        ) : (
          // Normal login/signup form
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleAuth)} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      {...register("username", { required: true })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...register("email", { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    {...register("password", { required: true })}
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                <div className="text-center text-sm mt-4">
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="text-blue-600 hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="text-blue-600 hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>

              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}