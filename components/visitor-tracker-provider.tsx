"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { getVisitorTracker } from "@/lib/visitor-tracker"

export function VisitorTrackerProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize visitor tracking
    const tracker = getVisitorTracker()

    // Track page view on route change
    if (tracker) {
      tracker.trackPageView(pathname)
    }
  }, [pathname])

  return <>{children}</>
}
