import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function ensureUserProfile(userId: string) {
  try {
    // Use upsert to create or update
    const { error } = await supabase
      .from('users')
      .upsert([{ 
        id: userId,
        updated_at: new Date().toISOString()
      }], {
        onConflict: 'id',
        ignoreDuplicates: true
      });
      
    if (error) {
      console.error("Error ensuring user profile:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Exception ensuring user profile:", error);
    return false;
  }
}