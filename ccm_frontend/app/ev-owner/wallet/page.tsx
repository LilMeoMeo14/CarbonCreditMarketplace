"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/ev-owner/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, Leaf, ArrowUpRight, ArrowDownLeft, Lock, Loader2 } from "lucide-react"
import { walletsApi, type CarbonWallet, type EWallet } from "@/lib/api/wallets"
import { toast } from "sonner"

export default function WalletPage() {
  const [carbonWallet, setCarbonWallet] = useState<CarbonWallet | null>(null)
  const [eWallet, setEWallet] = useState<EWallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [withdrawData, setWithdrawData] = useState({ amount: 0, bankInfo: "" })
  const [depositAmount, setDepositAmount] = useState(0)

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      const [carbonRes, eWalletRes] = await Promise.all([walletsApi.getCarbonWallet(), walletsApi.getEWallet()])
      setCarbonWallet(carbonRes.result)
      setEWallet(eWalletRes.result)
    } catch (error) {
      console.error("Failed to fetch wallets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async () => {
    setIsSubmitting(true)
    try {
      await walletsApi.withdrawRequest(withdrawData.amount, withdrawData.bankInfo)
      toast.success("Yêu cầu rút tiền đã được gửi!", {
        description: "Vui lòng chờ admin xử lý yêu cầu của bạn.",
      })
      setIsWithdrawDialogOpen(false)
      setWithdrawData({ amount: 0, bankInfo: "" })
      fetchWallets()
    } catch (error) {
      console.error("Failed to withdraw:", error)
      toast.error("Gửi yêu cầu thất bại", {
        description: "Vui lòng kiểm tra số dư và thử lại.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeposit = async () => {
    setIsSubmitting(true)
    try {
      await walletsApi.depositRequest(depositAmount)
      toast.success("Yêu cầu nạp tiền đã được gửi!", {
        description: "Vui lòng chuyển khoản theo hướng dẫn.",
      })
      setIsDepositDialogOpen(false)
      setDepositAmount(0)
      fetchWallets()
    } catch (error) {
      console.error("Failed to deposit:", error)
      toast.error("Gửi yêu cầu thất bại", {
        description: "Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  return (
    <div className="min-h-screen">
      <Header title="Ví" description="Quản lý tín chỉ carbon và số dư tiền của bạn" />

      <div className="p-6 space-y-6">
        {/* Wallet Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carbon Wallet */}
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ví Carbon</p>
                    <p className="font-medium">Tín chỉ Carbon</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Số dư khả dụng</p>
                  <p className="text-4xl font-bold text-primary">
                    {isLoading ? "..." : (carbonWallet?.balance ?? 0)}
                    <span className="text-lg font-normal text-muted-foreground ml-2">tín chỉ</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-warning" />
                  <span className="text-muted-foreground">Đang khóa:</span>
                  <span className="font-medium text-warning">
                    {isLoading ? "..." : (carbonWallet?.lockedAmount ?? 0)} tín chỉ
                  </span>
                </div>

                {carbonWallet?.updatedAt && (
                  <p className="text-xs text-muted-foreground">
                    Cập nhật: {new Date(carbonWallet.updatedAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* E-Wallet */}
          <Card className="bg-gradient-to-br from-info/20 to-info/5 border-info/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-info/20 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ví điện tử</p>
                    <p className="font-medium">{eWallet?.currency || "VND"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Số dư khả dụng</p>
                  <p className="text-4xl font-bold text-info">
                    {isLoading ? "..." : formatCurrency(eWallet?.balance ?? 0)}
                    <span className="text-lg font-normal text-muted-foreground ml-2">{eWallet?.currency || "VND"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-warning" />
                  <span className="text-muted-foreground">Đang khóa:</span>
                  <span className="font-medium text-warning">
                    {isLoading ? "..." : formatCurrency(eWallet?.lockedAmount ?? 0)} {eWallet?.currency || "VND"}
                  </span>
                </div>

                {eWallet?.updatedAt && (
                  <p className="text-xs text-muted-foreground">
                    Cập nhật: {new Date(eWallet.updatedAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-info hover:bg-info/90 text-info-foreground">
                      <ArrowDownLeft className="h-4 w-4 mr-2" />
                      Nạp tiền
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border/50 max-w-md">
                    <DialogHeader>
                      <DialogTitle>Nạp tiền vào ví</DialogTitle>
                      <DialogDescription>Nhập số tiền bạn muốn nạp</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="depositAmount">Số tiền ({eWallet?.currency || "VND"})</Label>
                        <Input
                          id="depositAmount"
                          type="number"
                          placeholder="VD: 1000000"
                          value={depositAmount || ""}
                          onChange={(e) => setDepositAmount(Number(e.target.value))}
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDepositDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button
                        onClick={handleDeposit}
                        className="bg-info hover:bg-info/90"
                        disabled={isSubmitting || !depositAmount}
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Nạp tiền"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Rút tiền
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border/50 max-w-md">
                    <DialogHeader>
                      <DialogTitle>Rút tiền về ngân hàng</DialogTitle>
                      <DialogDescription>Nhập số tiền và thông tin ngân hàng</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="withdrawAmount">Số tiền ({eWallet?.currency || "VND"})</Label>
                        <Input
                          id="withdrawAmount"
                          type="number"
                          placeholder="VD: 500000"
                          value={withdrawData.amount || ""}
                          onChange={(e) => setWithdrawData({ ...withdrawData, amount: Number(e.target.value) })}
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankInfo">Thông tin ngân hàng</Label>
                        <Textarea
                          id="bankInfo"
                          placeholder="VD: Vietcombank - 1234567890 - NGUYEN VAN A"
                          value={withdrawData.bankInfo}
                          onChange={(e) => setWithdrawData({ ...withdrawData, bankInfo: e.target.value })}
                          className="bg-secondary/50 border-border/50"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button
                        onClick={handleWithdraw}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={isSubmitting || !withdrawData.amount || !withdrawData.bankInfo}
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gửi yêu cầu"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Thông tin về ví</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <p className="font-medium">Ví Carbon</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lưu trữ tín chỉ carbon được phát hành từ lượng CO₂ tiết kiệm. Bạn có thể bán tín chỉ trên marketplace
                  hoặc tiêu hủy để nhận chứng chỉ.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-info" />
                  <p className="font-medium">Ví điện tử</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lưu trữ tiền từ việc bán tín chỉ carbon. Bạn có thể rút tiền về tài khoản ngân hàng bất cứ lúc nào.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
