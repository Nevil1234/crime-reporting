import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const createReport = async (data) => {
  try {
    const { data: report, error } = await supabase
      .from('crime_reports')
      .insert([{
        crime_type: data.crimeType,
        description: data.description,
        location: data.location,
        media: data.media
      }])
      .select('id')
      .single()

    if (error) throw error

    return { success: true, reportId: report.id }
  } catch (error) {
    console.error('Database error:', error)
    return { success: false }
  }
}