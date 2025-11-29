"use client"

import { useEffect, useState } from "react"
import { BuyerHeader } from "@/components/buyer/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ShoppingCart, Award, TrendingUp, ArrowRight, Loader2 } from "lucide-react"
import { walletsApi, type EWallet, type CarbonWallet } from "@/lib/api/wallets"
import { marketplaceApi, type Transaction } from "@/lib/api/marketplace"
import Link from "next/link"

export default function BuyerDashboardPage() {
  const [eWallet, setEWallet] = useState<EWallet | null>(null)
  const [carbonWallet, setCarbonWallet] = useState<CarbonWallet | null>(null)
  const [recentPurchases, setRecentPurchases] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [eWalletRes, carbonRes, purchasesRes] = await Promise.all([
        walletsApi.getEWallet(),
        walletsApi.getCarbonWallet(),
        marketplaceApi.getPurchaseHistory(),
      ])
      setEWallet(eWalletRes.result)
      setCarbonWallet(carbonRes.result)
      setRecentPurchases(purchasesRes.result?.slice(0, 5) || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  const totalSpent = recentPurchases.reduce((sum, p) => sum + p.totalMoney, 0)
  const totalCreditsBought = recentPurchases.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen">
      <BuyerHeader title="Tổng quan" description="Xem tổng quan hoạt động mua tín chỉ carbon của bạn" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Số dư ví</p>
                  <p className="text-2xl font-bold text-info">
                    {isLoading ? "..." : formatCurrency(eWallet?.balance ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">{eWallet?.currency || "VND"}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tín chỉ sở hữu</p>
                  <p className="text-2xl font-bold text-primary">{isLoading ? "..." : (carbonWallet?.balance ?? 0)}</p>
                  <p className="text-xs text-muted-foreground">tín chỉ carbon</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng đã mua</p>
                  <p className="text-2xl font-bold text-success">{isLoading ? "..." : totalCreditsBought}</p>
                  <p className="text-xs text-muted-foreground">tín chỉ</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                  <p className="text-2xl font-bold text-warning">{isLoading ? "..." : formatCurrency(totalSpent)}</p>
                  <p className="text-xs text-muted-foreground">VND</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Sàn giao dịch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Khám phá và mua tín chỉ carbon từ các chủ xe điện. Tìm kiếm theo giá, số lượng và loại xe.
              </p>
              <Link href="/buyer/marketplace">
                <Button className="bg-primary hover:bg-primary/90">
                  Mua tín chỉ ngay
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/20 to-info/5 border-info/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-info" />
                Chứng chỉ Carbon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Tiêu hủy tín chỉ để nhận chứng chỉ giảm phát thải carbon cho báo cáo CSR của doanh nghiệp.
              </p>
              <Link href="/buyer/certificates">
                <Button variant="outline" className="border-info text-info hover:bg-info/10 bg-transparent">
                  Xem chứng chỉ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Purchases */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Giao dịch gần đây</CardTitle>
            <Link href="/buyer/purchases">
              <Button variant="ghost" size="sm">
                Xem tất cả
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentPurchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có giao dịch nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPurchases.map((purchase) => (
                  <div
                    key={purchase.transactionId}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30"
                  >
                    <div>
                      <p className="font-medium">Mua từ {purchase.sellerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(purchase.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{purchase.amount} tín chỉ</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(purchase.totalMoney)} VND</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
