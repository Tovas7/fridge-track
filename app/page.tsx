"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { ErrorBoundary } from "@/components/error-boundary"
import { Loading } from "@/components/ui/loading"
import { Toaster } from "sonner"
import UserAuth from "@/components/auth/user-auth"
import ProfessionalUserDashboard from "@/components/dashboard/professional-user-dashboard"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <Loading fullScreen text="Loading FridgeTrack..." />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        {user ? <ProfessionalUserDashboard /> : <UserAuth />}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
