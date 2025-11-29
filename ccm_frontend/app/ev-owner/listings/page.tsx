"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/ev-owner/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Tag, Loader2, ShoppingCart, Gavel, X, DollarSign, Clock, History } from "lucide-react"
import { listingsApi, type Listing, type CreateListingRequest, type Transaction } from "@/lib/api/listings"
import { walletsApi, type CarbonWallet } from "@/lib/api/wallets"

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [carbonWallet, setCarbonWallet] = useState<CarbonWallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cancelListing, setCancelListing] = useState<Listing | null>(null)
  const [formData, setFormData] = useState<CreateListingRequest>({
    amount: 0,
    price: 0,
    listingType: "DIRECT_SALE",
    expiresAt: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [listingsRes, transactionsRes, walletRes] = await Promise.all([
        listingsApi.getMyListings(),
        listingsApi.getSalesHistory(),
        walletsApi.getCarbonWallet(),
      ])
      setListings(listingsRes.result)
      setTransactions(transactionsRes.result)
      setCarbonWallet(walletRes.result)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await listingsApi.createListing(formData)
      setIsDialogOpen(false)
      setFormData({
        amount: 0,
        price: 0,
        listingType: "DIRECT_SALE",
        expiresAt: "",
      })
      fetchData()
    } catch (error) {
      console.error("Failed to create listing:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelListing) return
    try {
      await listingsApi.cancelListing(cancelListing.listingId)
      setCancelListing(null)
      fetchData()
    } catch (error) {
      console.error("Failed to cancel listing:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success/10 text-success"
      case "SOLD":
        return "bg-info/10 text-info"
      case "CANCELLED":
        return "bg-destructive/10 text-destructive"
      case "EXPIRED":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang bán"
      case "SOLD":
        return "Đã bán"
      case "CANCELLED":
        return "Đã hủy"
      case "EXPIRED":
        return "Hết hạn"
      default:
        return status
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  const activeListings = listings.filter((l) => l.status === "ACTIVE")
  const soldListings = listings.filter((l) => l.status === "SOLD")

  return (
    <div className="min-h-screen">
      <Header title="Bán tín chỉ" description="Niêm yết và quản lý bài bán tín chỉ carbon" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Có thể bán</p>
                  <p className="text-xl font-bold">{carbonWallet?.balance ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Đang bán</p>
                  <p className="text-xl font-bold">{activeListings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                  <History className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Đã bán</p>
                  <p className="text-xl font-bold">{soldListings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(transactions.reduce((sum, t) => sum + t.totalMoney, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-between">
          <div />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Tạo bài bán
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50 max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo bài bán tín chỉ</DialogTitle>
                <DialogDescription>Niêm yết tín chỉ carbon để bán trên marketplace</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">Số dư khả dụng:</p>
                  <p className="text-xl font-bold text-primary">{carbonWallet?.balance ?? 0} tín chỉ</p>
                </div>

                <div className="space-y-2">
                  <Label>Loại bán</Label>
                  <Select
                    value={formData.listingType}
                    onValueChange={(value: "DIRECT_SALE" | "AUCTION") =>
                      setFormData({ ...formData, listingType: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50">
                      <SelectItem value="DIRECT_SALE">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Bán trực tiếp
                        </div>
                      </SelectItem>
                      <SelectItem value="AUCTION">
                        <div className="flex items-center gap-2">
                          <Gavel className="h-4 w-4" />
                          Đấu giá
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Số lượng tín chỉ</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="VD: 10"
                    value={formData.amount || ""}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="bg-secondary/50 border-border/50"
                    max={carbonWallet?.balance || 0}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    {formData.listingType === "AUCTION" ? "Giá khởi điểm (VND/tín chỉ)" : "Giá bán (VND/tín chỉ)"}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="VD: 100000"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Ngày hết hạn</Label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>

                <div className="p-3 rounded-lg bg-secondary/30 text-sm text-muted-foreground">
                  Tổng giá trị:{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(formData.amount * formData.price)} VND
                  </span>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={
                      isSubmitting ||
                      !formData.amount ||
                      !formData.price ||
                      formData.amount > (carbonWallet?.balance || 0)
                    }
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tạo bài bán"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="listings" className="space-y-4">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="listings">Bài bán của tôi</TabsTrigger>
            <TabsTrigger value="history">Lịch sử giao dịch</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Danh sách bài bán</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-10">
                    <Tag className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">Chưa có bài bán nào</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listings.map((listing) => (
                      <div
                        key={listing.listingId}
                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            listing.listingType === "AUCTION" ? "bg-warning/10" : "bg-primary/10"
                          }`}
                        >
                          {listing.listingType === "AUCTION" ? (
                            <Gavel className={`h-5 w-5 text-warning`} />
                          ) : (
                            <ShoppingCart className={`h-5 w-5 text-primary`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{listing.amount} tín chỉ</p>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}
                            >
                              {getStatusLabel(listing.status)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(listing.price)} VND/tín chỉ
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Hết hạn: {new Date(listing.expiresAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                        {listing.status === "ACTIVE" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                            onClick={() => setCancelListing(listing)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Hủy
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Lịch sử giao dịch</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-10">
                    <History className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground">Chưa có giao dịch nào</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Người mua</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Số lượng</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Đơn giá</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Tổng tiền</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Loại</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ngày</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.transactionId} className="border-b border-border/30 hover:bg-secondary/20">
                            <td className="py-3 px-4 text-sm font-mono">#{tx.transactionId}</td>
                            <td className="py-3 px-4 text-sm">{tx.buyerName}</td>
                            <td className="py-3 px-4 text-sm text-right">{tx.amount}</td>
                            <td className="py-3 px-4 text-sm text-right">{formatCurrency(tx.pricePerCredit)}</td>
                            <td className="py-3 px-4 text-sm text-right font-medium text-success">
                              +{formatCurrency(tx.totalMoney)}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  tx.type === "AUCTION" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                                }`}
                              >
                                {tx.type === "AUCTION" ? "Đấu giá" : "Mua ngay"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Confirmation */}
      <AlertDialog open={!!cancelListing} onOpenChange={() => setCancelListing(null)}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy bài bán</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy bài bán {cancelListing?.amount} tín chỉ? Tín chỉ sẽ được hoàn lại vào ví của
              bạn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Không</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Hủy bài bán
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
