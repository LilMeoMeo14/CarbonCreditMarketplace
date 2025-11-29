"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BuyerSidebar } from "@/components/buyer/sidebar"
import { authApi } from "@/lib/api/auth"
import { Loader2 } from "lucide-react"

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = authApi.getCurrentUser()
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "BUYER") {
      router.push("/login")
      return
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <BuyerSidebar />
      <main className="ml-64 min-h-screen transition-all duration-300">{children}</main>
    </div>
  )
}
