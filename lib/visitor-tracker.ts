"use client"

import { createClient } from "@/lib/supabase/client"

interface VisitorInfo {
  ip_address: string
  user_agent: string
  page_url: string
  referrer: string
  country?: string
  city?: string
  device_type: string
  browser: string
  session_id: string
}

class VisitorTracker {
  private supabase = createClient()
  private sessionId: string
  private startTime: number
  private currentPage = ""

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.startTime = Date.now()

    if (typeof window !== "undefined") {
      this.init()
    }
  }

  private getOrCreateSessionId(): string {
    if (typeof window === "undefined") return ""

    let sessionId = sessionStorage.getItem("visitor_session_id")
    if (!sessionId) {
      sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem("visitor_session_id", sessionId)
    }
    return sessionId
  }

  private async getLocationInfo(): Promise<{ country?: string; city?: string }> {
    try {
      // Use a free IP geolocation service
      const response = await fetch("https://ipapi.co/json/")
      if (response.ok) {
        const data = await response.json()
        return {
          country: data.country_name,
          city: data.city,
        }
      }
    } catch (error) {
      console.log("Could not fetch location info:", error)
    }
    return {}
  }

  private getDeviceType(): string {
    if (typeof window === "undefined") return "desktop"

    const userAgent = navigator.userAgent.toLowerCase()
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return "mobile"
    } else if (/tablet|ipad/i.test(userAgent)) {
      return "tablet"
    }
    return "desktop"
  }

  private getBrowser(): string {
    if (typeof window === "undefined") return "unknown"

    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes("chrome")) return "Chrome"
    if (userAgent.includes("firefox")) return "Firefox"
    if (userAgent.includes("safari")) return "Safari"
    if (userAgent.includes("edge")) return "Edge"
    if (userAgent.includes("opera")) return "Opera"
    return "Unknown"
  }

  private async getClientIP(): Promise<string> {
    try {
      // Try to get IP from a free service
      const response = await fetch("https://api.ipify.org?format=json")
      if (response.ok) {
        const data = await response.json()
        return data.ip
      }
    } catch (error) {
      console.log("Could not fetch IP:", error)
    }
    return "unknown"
  }

  async trackPageView(pageUrl?: string): Promise<void> {
    if (typeof window === "undefined") return

    const currentUrl = pageUrl || window.location.pathname + window.location.search
    this.currentPage = currentUrl

    try {
      const [ip, location] = await Promise.all([this.getClientIP(), this.getLocationInfo()])

      const visitorInfo: VisitorInfo = {
        ip_address: ip,
        user_agent: navigator.userAgent,
        page_url: currentUrl,
        referrer: document.referrer || "",
        country: location.country,
        city: location.city,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        session_id: this.sessionId,
      }

      // Insert visitor tracking data
      const { error } = await this.supabase.from("visitor_tracking").insert([visitorInfo])

      if (error) {
        console.error("Error tracking visitor:", error)
      }
    } catch (error) {
      console.error("Error in trackPageView:", error)
    }
  }

  async trackPageExit(): Promise<void> {
    if (typeof window === "undefined") return

    const duration = Math.floor((Date.now() - this.startTime) / 1000)

    try {
      // Update the most recent visitor record with duration
      const { error } = await this.supabase
        .from("visitor_tracking")
        .update({ visit_duration: duration })
        .eq("session_id", this.sessionId)
        .eq("page_url", this.currentPage)
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Error updating visit duration:", error)
      }
    } catch (error) {
      console.error("Error in trackPageExit:", error)
    }
  }

  private init(): void {
    // Track initial page view
    this.trackPageView()

    // Track page exit
    window.addEventListener("beforeunload", () => {
      this.trackPageExit()
    })

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.trackPageExit()
      }
    })

    // Update start time when page becomes visible again
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        this.startTime = Date.now()
      }
    })
  }
}

// Create singleton instance
let visitorTracker: VisitorTracker | null = null

export function getVisitorTracker(): VisitorTracker {
  if (!visitorTracker && typeof window !== "undefined") {
    visitorTracker = new VisitorTracker()
  }
  return visitorTracker!
}

// Hook for easy usage in React components
export function useVisitorTracking() {
  const tracker = getVisitorTracker()

  return {
    trackPageView: (pageUrl?: string) => tracker?.trackPageView(pageUrl),
    trackPageExit: () => tracker?.trackPageExit(),
  }
}
