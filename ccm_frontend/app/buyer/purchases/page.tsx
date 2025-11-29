"use client"

import { useEffect, useState } from "react"
import { BuyerHeader } from "@/components/buyer/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Loader2, Calendar, User, Leaf, DollarSign } from "lucide-react"
import { marketplaceApi, type Transaction } from "@/lib/api/marketplace"

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const response = await marketplaceApi.getPurchaseHistory()
      setPurchases(response.result || [])
    } catch (error) {
      console.error("Failed to fetch purchases:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.totalMoney, 0)
  const totalCredits = purchases.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="min-h-screen">
      <BuyerHeader title="Lịch sử mua hàng" description="Xem lại các giao dịch mua tín chỉ carbon của bạn" />

      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
                  <p className="text-2xl font-bold">{purchases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng tín chỉ đã mua</p>
                  <p className="text-2xl font-bold text-success">{totalCredits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng chi tiêu</p>
                  <p className="text-2xl font-bold text-info">{formatCurrency(totalSpent)} VND</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Purchase History Table */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Chi tiết giao dịch</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : purchases.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium mb-2">Chưa có giao dịch nào</p>
                <p className="text-muted-foreground">Mua tín chỉ trên sàn giao dịch để xem lịch sử tại đây</p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.transactionId}
                    className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Leaf className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">Giao dịch #{purchase.transactionId}</p>
                            <Badge
                              variant="secondary"
                              className={
                                purchase.type === "BUY_NOW"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-warning/20 text-warning"
                              }
                            >
                              {purchase.type === "BUY_NOW" ? "Mua ngay" : "Đấu giá"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>Từ: {purchase.sellerName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(purchase.createdAt).toLocaleDateString("vi-VN")}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 lg:text-right">
                        <div>
                          <p className="text-sm text-muted-foreground">Số lượng</p>
                          <p className="font-medium text-primary">{purchase.amount} tín chỉ</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Đơn giá</p>
                          <p className="font-medium">{formatCurrency(purchase.pricePerCredit)} VND</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tổng tiền</p>
                          <p className="font-bold text-lg text-info">{formatCurrency(purchase.totalMoney)} VND</p>
                        </div>
                      </div>
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
