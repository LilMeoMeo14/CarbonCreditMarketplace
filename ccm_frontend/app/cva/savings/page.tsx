"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Leaf, Search, CheckCircle, XCircle, Clock, Car, Calendar, Loader2 } from "lucide-react"
import { cvaApi, type PendingCarbonSaving, type SavingVerifyStatus } from "@/lib/api/cva"
import { toast } from "sonner"

export default function CarbonSavingsPage() {
    const [savings, setSavings] = useState<PendingCarbonSaving[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSaving, setSelectedSaving] = useState<PendingCarbonSaving | null>(null)
    const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
    const [verifyStatus, setVerifyStatus] = useState<SavingVerifyStatus>("APPROVED")
    const [verifyNote, setVerifyNote] = useState("")
    const [verifying, setVerifying] = useState(false)

    const fetchSavings = async () => {
        try {
            setLoading(true)
            const response = await cvaApi.getPendingSavings()
            setSavings(response.result || [])
        } catch (error) {
            console.error("Error fetching savings:", error)
            toast.error("Không thể tải danh sách carbon saving")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSavings()
    }, [])

    const filteredSavings = savings.filter((saving) => {
        const searchLower = searchTerm.toLowerCase();

        // Kiểm tra an toàn: Nếu trường dữ liệu tồn tại thì mới lowercase, ngược lại trả về chuỗi rỗng
        const plate = saving.licensePlate ? saving.licensePlate.toLowerCase() : "";
        const model = saving.vehicleModel ? saving.vehicleModel.toLowerCase() : "";

        return plate.includes(searchLower) || model.includes(searchLower);
    });

    const handleOpenVerifyDialog = (saving: PendingCarbonSaving) => {
        setSelectedSaving(saving)
        setVerifyStatus("APPROVED")
        setVerifyNote("")
        setVerifyDialogOpen(true)
    }

    const handleVerify = async () => {
        if (!selectedSaving) return

        try {
            setVerifying(true)
            await cvaApi.verifySaving(selectedSaving.savingId, verifyStatus, verifyNote || undefined)

            const statusText =
                verifyStatus === "APPROVED" ? "Đã duyệt" : verifyStatus === "REJECTED" ? "Đã từ chối" : "Đang chờ"
            toast.success(`${statusText} carbon saving #${selectedSaving.savingId}`)

            setVerifyDialogOpen(false)
            fetchSavings()
        } catch (error) {
            console.error("Error verifying saving:", error)
            toast.error("Không thể xác minh carbon saving")
        } finally {
            setVerifying(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                        <Clock className="h-3 w-3 mr-1" />
                        Chờ duyệt
                    </Badge>
                )
            case "APPROVED":
                return (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Đã duyệt
                    </Badge>
                )
            case "REJECTED":
                return (
                    <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                        <XCircle className="h-3 w-3 mr-1" />
                        Từ chối
                    </Badge>
                )
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Duyệt Carbon Saving</h1>
                <p className="text-muted-foreground">Xác minh và phê duyệt dữ liệu tiết kiệm CO₂ từ các xe điện</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Chờ duyệt</p>
                                <p className="text-2xl font-bold">{savings.filter((s) => s.status === "PENDING").length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Leaf className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng CO₂ tiết kiệm</p>
                                <p className="text-2xl font-bold">{savings.reduce((sum, s) => sum + s.co2SavedKg, 0).toFixed(1)} kg</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Car className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Tổng quãng đường</p>
                                <p className="text-2xl font-bold">{savings.reduce((sum, s) => sum + s.distanceKm, 0).toFixed(1)} km</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Danh sách Carbon Saving</CardTitle>
                            <CardDescription>{filteredSavings.length} bản ghi carbon saving</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm theo biển số, model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredSavings.length === 0 ? (
                        <div className="text-center py-12">
                            <Leaf className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">Không có carbon saving nào</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Biển số</TableHead>
                                    <TableHead>Model xe</TableHead>
                                    <TableHead>Quãng đường</TableHead>
                                    <TableHead>CO₂ tiết kiệm</TableHead>
                                    <TableHead>Phương pháp</TableHead>
                                    <TableHead>Ngày ghi nhận</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSavings.map((saving) => (
                                    <TableRow key={saving.savingId}>
                                        <TableCell className="font-medium">#{saving.savingId}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Car className="h-4 w-4 text-muted-foreground" />
                                                {saving.licensePlate}
                                            </div>
                                        </TableCell>
                                        <TableCell>{saving.vehicleModel}</TableCell>
                                        <TableCell>{saving.distanceKm.toFixed(1)} km</TableCell>
                                        <TableCell>
                                            <span className="text-emerald-600 font-medium">{saving.co2SavedKg.toFixed(2)} kg</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{saving.calculationMethod}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(saving.recordedDate).toLocaleDateString("vi-VN")}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(saving.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenVerifyDialog(saving)}>
                                                Xác minh
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Verify Dialog */}
            <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Xác minh Carbon Saving</DialogTitle>
                        <DialogDescription>Xác minh bản ghi CO₂ tiết kiệm #{selectedSaving?.savingId}</DialogDescription>
                    </DialogHeader>

                    {selectedSaving && (
                        <div className="space-y-4">
                            {/* Saving Info */}
                            <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Biển số:</span>
                                    <span className="font-medium">{selectedSaving.licensePlate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Model:</span>
                                    <span className="font-medium">{selectedSaving.vehicleModel}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Quãng đường:</span>
                                    <span className="font-medium">{selectedSaving.distanceKm} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">CO₂ tiết kiệm:</span>
                                    <span className="font-medium text-emerald-600">{selectedSaving.co2SavedKg} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phương pháp:</span>
                                    <span className="font-medium">{selectedSaving.calculationMethod}</span>
                                </div>
                            </div>

                            {/* Status Select */}
                            <div className="space-y-2">
                                <Label>Trạng thái xác minh</Label>
                                <Select value={verifyStatus} onValueChange={(value) => setVerifyStatus(value as SavingVerifyStatus)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="APPROVED">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                                Phê duyệt
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="REJECTED">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="h-4 w-4 text-red-600" />
                                                Từ chối
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="PENDING">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-amber-600" />
                                                Chờ xử lý
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Note */}
                            <div className="space-y-2">
                                <Label>Ghi chú (tùy chọn)</Label>
                                <Textarea
                                    placeholder="Nhập ghi chú xác minh..."
                                    value={verifyNote}
                                    onChange={(e) => setVerifyNote(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button onClick={handleVerify} disabled={verifying}>
                            {verifying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Xác nhận
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
