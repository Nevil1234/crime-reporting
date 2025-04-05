// app/login/page.tsx
"use client"
import { useEffect } from "react"
import { AuthForm } from "@/components/auth-form"
import { useReport } from "@/context/report-context"
import { useRouter } from "next/navigation"
import { ensureUserProfile } from "@/lib/auth-helpers"

export default function LoginPage() {
  const reportContext = useReport()
  const pendingReport = reportContext?.pendingReport
  const clearPendingReport = reportContext?.clearPendingReport
  const router = useRouter()

  useEffect(() => {
    if (pendingReport) {
      router.push('/report')
    }
  }, [pendingReport, router])

  return (
    <div>
      <AuthForm onSuccess={async (email, password) => {
        const { data: { user } } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (user) {
          await ensureUserProfile(user.id);
          if (pendingReport) {
            clearPendingReport()
            router.push('/report')
          } else {
            router.push('/')
          }
        }
      }} />
    </div>
  )
}