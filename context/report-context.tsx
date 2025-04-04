// context/report-context.tsx
"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ReportContext = createContext(null)

export function ReportProvider({ children }) {
  const [pendingReport, setPendingReport] = useState(null)

  // Load pending report from localStorage
  useEffect(() => {
    const savedReport = localStorage.getItem('pendingReport')
    if (savedReport) setPendingReport(JSON.parse(savedReport))
  }, [])

  // Save pending report to localStorage
  useEffect(() => {
    if (pendingReport) {
      localStorage.setItem('pendingReport', JSON.stringify(pendingReport))
    } else {
      localStorage.removeItem('pendingReport')
    }
  }, [pendingReport])

  const submitReport = async (reportData) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setPendingReport(reportData)
      return { redirect: '/login' }
    }

    const { data, error } = await supabase
      .from('crime_reports')
      .insert({
        ...reportData,
        user_id: user.id
      })
      .select()

    return { data, error }
  }

  return (
    <ReportContext.Provider value={{ pendingReport, submitReport, clearPendingReport: () => setPendingReport(null) }}>
      {children}
    </ReportContext.Provider>
  )
}

export function useReport() {
  return useContext(ReportContext)
}