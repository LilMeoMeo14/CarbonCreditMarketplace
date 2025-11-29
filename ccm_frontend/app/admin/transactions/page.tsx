"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    Loader2,
    Wallet,
} from "lucide-react"
import { adminApi, type PendingTransaction } from "@/lib/api/admin"
import { toast } from "sonner"

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<PendingTransaction[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<PendingTransaction[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")

    // Dialog state
    const [selectedTx, setSelectedTx] = useState<PendingTransaction | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)

    const fetchTransactions = async () => {
        try {
            const response = await adminApi.getPendingTransactions()
            setTransactions(response.result || [])
            setFilteredTransactions(response.result || [])
        } catch (error) {
            console.error("Failed to fetch transactions:", error)
            toast.error("Không thể tải danh sách giao dịch")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    useEffect(() => {
        let filtered = transactions

        // Filter by type
        if (typeFilter !== "all") {
            filtered = filtered.filter((t) => t.type === typeFilter)
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (t) =>
                    t.transactionId.toString().includes(query) ||
                    t.walletId.toString().includes(query) ||
                    t.description?.toLowerCase().includes(query),
            )
        }

        setFilteredTransactions(filtered)
    }, [transactions, searchQuery, typeFilter])

    const handleApprove = async (tx: PendingTransaction) => {
        setIsProcessing(true)
        try {
            if (tx.type === "WITHDRAW") {
                await adminApi.approveWithdraw(tx.transactionId)
            } else {
                await adminApi.approveTransaction(tx.transactionId)
            }
            toast.success(`Đã duyệt giao dịch #${tx.transactionId}`)
            setDialogOpen(false)
            fetchTransactions()
        } catch (error) {
            console.error("Failed to approve:", error)
            toast.error("Không thể duyệt giao dịch")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReject = async (tx: PendingTransaction) => {
        if (tx.type === "WITHDRAW" && !rejectReason.trim()) {
            toast.error("Vui lòng nhập lý do từ chối")
            return
        }

        setIsProcessing(true)
        try {
            if (tx.type === "WITHDRAW") {
                await adminApi.rejectWithdraw(tx.transactionId, rejectReason)
            } else {
                await adminApi.rejectTransaction(tx.transactionId)
            }
            toast.success(`Đã từ chối giao dịch #${tx.transactionId}`)
            setDialogOpen(false)
            setRejectReason("")
            fetchTransactions()
        } catch (error) {
            console.error("Failed to reject:", error)
            toast.error("Không thể từ chối giao dịch")
        } finally {
            setIsProcessing(false)
        }
    }

    const stats = {
        total: transactions.length,
        deposits: transactions.filter((t) => t.type === "DEPOSIT").length,
        withdraws: transactions.filter((t) => t.type === "WITHDRAW").length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    }

    return (
        <div className="min-h-screen">
            <Header title="Duyệt tài chính" description="Quản lý yêu cầu nạp/rút tiền" />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-warning/10">
                                    <Clock className="h-5 w-5 text-warning" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Chờ duyệt</p>
                                    <p className="text-xl font-bold">{stats.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-success/10">
                                    <ArrowUpCircle className="h-5 w-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Nạp tiền</p>
                                    <p className="text-xl font-bold">{stats.deposits}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-destructive/10">
                                    <ArrowDownCircle className="h-5 w-5 text-destructive" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Rút tiền</p>
                                    <p className="text-xl font-bold">{stats.withdraws}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Wallet className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng tiền</p>
                                    <p className="text-xl font-bold">{stats.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm theo ID, Ví, Mô tả..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Loại giao dịch" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="DEPOSIT">Nạp tiền</SelectItem>
                                    <SelectItem value="WITHDRAW">Rút tiền</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Danh sách giao dịch chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="text-center py-8">
                                <CheckCircle2 className="h-12 w-12 mx-auto text-success/50 mb-3" />
                                <p className="text-muted-foreground">Không có giao dịch nào chờ duyệt</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Loại</TableHead>
                                        <TableHead>Ví</TableHead>
                                        <TableHead>Số tiền</TableHead>
                                        <TableHead>Mô tả</TableHead>
                                        <TableHead>Ngày tạo</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((tx) => (
                                        <TableRow key={tx.transactionId}>
                                            <TableCell className="font-medium">#{tx.transactionId}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        tx.type === "DEPOSIT"
                                                            ? "bg-success/10 text-success border-success/30"
                                                            : "bg-destructive/10 text-destructive border-destructive/30"
                                                    }
                                                >
                                                    {tx.type === "DEPOSIT" ? (
                                                        <>
                                                            <ArrowUpCircle className="h-3 w-3 mr-1" /> Nạp
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ArrowDownCircle className="h-3 w-3 mr-1" /> Rút
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>#{tx.walletId}</TableCell>
                                            <TableCell
                                                className={`font-semibold ${tx.type === "DEPOSIT" ? "text-success" : "text-destructive"}`}
                                            >
                                                {tx.type === "DEPOSIT" ? "+" : "-"}
                                                {tx.amount.toLocaleString()} VNĐ
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">{tx.description || "-"}</TableCell>
                                            <TableCell>{new Date(tx.createdAt).toLocaleString("vi-VN")}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Chờ duyệt
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedTx(tx)
                                                        setDialogOpen(true)
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Xem
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Transaction Detail Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết giao dịch #{selectedTx?.transactionId}</DialogTitle>
                        <DialogDescription>
                            Xem và xử lý yêu cầu {selectedTx?.type === "DEPOSIT" ? "nạp" : "rút"} tiền
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTx && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-secondary/30">
                                    <p className="text-sm text-muted-foreground">Loại giao dịch</p>
                                    <p className="font-medium flex items-center gap-2 mt-1">
                                        {selectedTx.type === "DEPOSIT" ? (
                                            <>
                                                <ArrowUpCircle className="h-4 w-4 text-success" /> Nạp tiền
                                            </>
                                        ) : (
                                            <>
                                                <ArrowDownCircle className="h-4 w-4 text-destructive" /> Rút tiền
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/30">
                                    <p className="text-sm text-muted-foreground">Ví</p>
                                    <p className="font-medium mt-1">#{selectedTx.walletId}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/30 col-span-2">
                                    <p className="text-sm text-muted-foreground">Số tiền</p>
                                    <p
                                        className={`text-2xl font-bold mt-1 ${selectedTx.type === "DEPOSIT" ? "text-success" : "text-destructive"
                                            }`}
                                    >
                                        {selectedTx.type === "DEPOSIT" ? "+" : "-"}
                                        {selectedTx.amount.toLocaleString()} VNĐ
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/30 col-span-2">
                                    <p className="text-sm text-muted-foreground">Mô tả</p>
                                    <p className="font-medium mt-1">{selectedTx.description || "Không có mô tả"}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/30 col-span-2">
                                    <p className="text-sm text-muted-foreground">Ngày tạo</p>
                                    <p className="font-medium mt-1">{new Date(selectedTx.createdAt).toLocaleString("vi-VN")}</p>
                                </div>
                            </div>

                            {selectedTx.type === "WITHDRAW" && (
                                <div>
                                    <label className="text-sm font-medium">Lý do từ chối (nếu từ chối)</label>
                                    <Textarea
                                        placeholder="Nhập lý do từ chối yêu cầu rút tiền..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isProcessing}>
                            Đóng
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedTx && handleReject(selectedTx)}
                            disabled={isProcessing}
                        >
                            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                            Từ chối
                        </Button>
                        <Button onClick={() => selectedTx && handleApprove(selectedTx)} disabled={isProcessing}>
                            {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            Duyệt
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
