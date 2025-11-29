"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/ev-owner/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Leaf, Wallet, Award, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { walletsApi, type CarbonWallet, type EWallet } from "@/lib/api/wallets"
import { evProfilesApi, type EVProfile } from "@/lib/api/ev-profiles"

export default function DashboardPage() {
  const [carbonWallet, setCarbonWallet] = useState<CarbonWallet | null>(null)
  const [eWallet, setEWallet] = useState<EWallet | null>(null)
  const [vehicles, setVehicles] = useState<EVProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carbonRes, eWalletRes, vehiclesRes] = await Promise.all([
          walletsApi.getCarbonWallet(),
          walletsApi.getEWallet(),
          evProfilesApi.getMyVehicles(),
        ])
        setCarbonWallet(carbonRes.result)
        setEWallet(eWalletRes.result)
        setVehicles(vehiclesRes.result)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    {
      title: "Tín chỉ Carbon",
      value: carbonWallet?.balance ?? 0,
      unit: "tín chỉ",
      icon: Leaf,
      change: "+12%",
      trend: "up",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Số dư ví",
      value: eWallet?.balance ?? 0,
      unit: eWallet?.currency ?? "VND",
      icon: Wallet,
      change: "+8%",
      trend: "up",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Xe đã đăng ký",
      value: vehicles.length,
      unit: "xe",
      icon: Car,
      change: "0",
      trend: "neutral",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "CO₂ tiết kiệm",
      value: "1,234",
      unit: "kg",
      icon: TrendingUp,
      change: "+24%",
      trend: "up",
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header title="Tổng quan" description="Xem tổng quan về tài khoản của bạn" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  {stat.trend !== "neutral" && (
                    <div
                      className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-success" : "text-destructive"
                        }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">
                    {isLoading ? "..." : stat.value.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickActionButton icon={Car} label="Thêm xe mới" href="/ev-owner/vehicles" />
              <QuickActionButton icon={Leaf} label="Báo cáo Odometer" href="/ev-owner/carbon-tracking" />
              <QuickActionButton icon={Award} label="Yêu cầu tín chỉ" href="/ev-owner/requests" />
              <QuickActionButton icon={Wallet} label="Bán tín chỉ" href="/ev-owner/listings" />
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Xe của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Đang tải...</p>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Chưa có xe nào được đăng ký</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <div key={vehicle.evProfileId} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{vehicle.vehicleModel}</p>
                        <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                      </div>
                      <StatusBadge status={vehicle.verificationStatus} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function QuickActionButton({ icon: Icon, label, href }: { icon: typeof Car; label: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
    >
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <span className="font-medium">{label}</span>
    </a>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    VERIFIED: "bg-success/10 text-success",
    PENDING: "bg-warning/10 text-warning",
    REJECTED: "bg-destructive/10 text-destructive",
  }
  const labels = {
    VERIFIED: "Đã xác minh",
    PENDING: "Chờ duyệt",
    REJECTED: "Từ chối",
  }
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.PENDING}`}
    >
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}
