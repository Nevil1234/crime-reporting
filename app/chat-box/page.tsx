"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

// Dynamically import the chat component with SSR disabled
const ComplainantChat = dynamic(
  () => import("@/components/ComplainantChat"),
  { ssr: false } // This prevents the component from being rendered on the server
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ChatBoxPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Authenticate user
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          // Redirect to login if not authenticated
          router.push('/login');
          return;
        }
        
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center shadow-sm">
        <Link href="/status" className="mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Chat with Officer</h1>
      </header>

      <div className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin"></div>
          </div>
        ) : (
          user && <ComplainantChat userId={user.id} />
        )}
      </div>
    </main>
  );
}