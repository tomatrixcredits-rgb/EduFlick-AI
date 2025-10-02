"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { isAdminEmail } from "@/lib/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    let isMounted = true
    const check = async () => {
      if (!supabase) {
        setAuthorized(false)
        router.replace("/admin/signin?next=" + encodeURIComponent(pathname || "/admin"))
        return
      }
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        if (!isMounted) return
        setAuthorized(false)
        router.replace("/admin/signin?next=" + encodeURIComponent(pathname || "/admin"))
        return
      }
      const { data: userData } = await supabase.auth.getUser()
      const email = userData.user?.email || null
      const ok = isAdminEmail(email)
      if (!isMounted) return
      if (!ok) {
        setAuthorized(false)
        router.replace("/")
        return
      }
      setAuthorized(true)
    }
    void check()
    return () => {
      isMounted = false
    }
  }, [pathname, router, supabase])

  if (authorized === null) {
    return <div className="min-h-screen bg-black text-white p-6">Checking admin access…</div>
  }

  if (!authorized) {
    return null
  }

  return <>{children}</>
}

