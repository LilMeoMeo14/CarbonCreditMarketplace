"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/cva/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Car, Loader2, CheckCircle2, XCircle, Eye, Battery, Calendar, FileImage } from "lucide-react"
import { cvaApi, type PendingEVProfile } from "@/lib/api/cva"
import { toast } from "sonner"
import Image from "next/image"


const API_BASE_URL = "http://localhost:8080"

export default function CVAVehiclesPage() {
    const [profiles, setProfiles] = useState<PendingEVProfile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedProfile, setSelectedProfile] = useState<PendingEVProfile | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await cvaApi.getPendingProfiles()
            setProfiles(response.result)
        } catch (error) {
            console.error("Failed to fetch profiles:", error)
            toast.error("Không thể tải danh sách xe")
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewProfile = (profile: PendingEVProfile) => {
        setSelectedProfile(profile)
        setIsDialogOpen(true)
    }

    const handleApprove = async () => {
        if (!selectedProfile) return
        setIsProcessing(true)
        try {
            await cvaApi.approveProfile(selectedProfile.evProfileId)
            toast.success("Đã duyệt hồ sơ xe!", {
                description: `Xe ${selectedProfile.licensePlate} đã được xác minh.`,
            })
            setIsDialogOpen(false)
            fetchData()
        } catch (error) {
            console.error("Failed to approve profile:", error)
            toast.error("Không thể duyệt hồ sơ xe")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReject = async () => {
        if (!selectedProfile) return
        setIsProcessing(true)
        try {
            await cvaApi.rejectProfile(selectedProfile.evProfileId)
            toast.success("Đã từ chối hồ sơ xe!", {
                description: `Xe ${selectedProfile.licensePlate} đã bị từ chối.`,
            })
            setIsDialogOpen(false)
            fetchData()
        } catch (error) {
            console.error("Failed to reject profile:", error)
            toast.error("Không thể từ chối hồ sơ xe")
        } finally {
            setIsProcessing(false)
        }
    }
    const getFileUrl = (filename: string | null | undefined) => {
        if (!filename) return "/placeholder.svg" // Ảnh mặc định nếu null
        if (filename.startsWith("http")) return filename // Nếu đã là link full thì giữ nguyên
        return `${API_BASE_URL}/files/${filename}` // Ghép link backend vào
    }

    return (
        <div className="min-h-screen">
            <Header title="Duyệt xe" description="Xem xét và xác minh hồ sơ đăng ký xe điện" />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="flex items-center gap-4">
                    <StatBadge label="Tổng chờ duyệt" value={profiles.length} color="warning" />
                </div>

                {/* Profiles List */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle>Danh sách xe chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : profiles.length === 0 ? (
                            <div className="text-center py-10">
                                <Car className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground">Không có xe nào chờ duyệt</p>
                                <p className="text-sm text-muted-foreground">Tất cả hồ sơ xe đã được xử lý</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {profiles.map((profile) => (
                                    <div
                                        key={profile.evProfileId}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                                            <Car className="h-6 w-6 text-warning" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium">{profile.vehicleModel}</p>
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                                                    Chờ duyệt
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <span className="font-medium">{profile.licensePlate}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Battery className="h-3 w-3" />
                                                    {profile.batteryCapacityKwh} kWh
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(profile.registrationDate).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewProfile(profile)}
                                            className="border-border/50"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Xem chi tiết
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Profile Detail Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-card border-border/50 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Chi tiết hồ sơ xe</DialogTitle>
                            <DialogDescription>Xem xét thông tin và tài liệu xác minh để duyệt hoặc từ chối hồ sơ</DialogDescription>
                        </DialogHeader>
                        {selectedProfile && (
                            <div className="space-y-6 py-4">
                                {/* Vehicle Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-secondary/30">
                                        <p className="text-sm text-muted-foreground mb-1">Mẫu xe</p>
                                        <p className="font-medium">{selectedProfile.vehicleModel}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-secondary/30">
                                        <p className="text-sm text-muted-foreground mb-1">Biển số</p>
                                        <p className="font-medium">{selectedProfile.licensePlate}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-secondary/30">
                                        <p className="text-sm text-muted-foreground mb-1">Dung lượng pin</p>
                                        <p className="font-medium">{selectedProfile.batteryCapacityKwh} kWh</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-secondary/30">
                                        <p className="text-sm text-muted-foreground mb-1">Ngày đăng ký</p>
                                        <p className="font-medium">
                                            {new Date(selectedProfile.registrationDate).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                </div>

                                {/* Verification Document */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FileImage className="h-5 w-5 text-muted-foreground" />
                                        <p className="font-medium">Tài liệu xác minh</p>
                                    </div>
                                    {selectedProfile.verificationDocumentUrl ? (
                                        <div className="rounded-xl overflow-hidden border border-border/50 bg-secondary/20 relative">
                                            {/* 3. SỬA CHỖ NÀY: Gọi hàm getFileUrl()
                                                   Lưu ý: unoptimized={true} giúp tránh lỗi config domain tạm thời 
                                                */}
                                            <Image
                                                src={getFileUrl(selectedProfile.verificationDocumentUrl)}
                                                alt="Tài liệu xác minh"
                                                width={600}
                                                height={400}
                                                className="w-full h-auto object-contain max-h-[400px]"
                                                unoptimized={true}
                                            />

                                            {/* Nút mở tab mới xem cho rõ */}
                                            <a
                                                href={getFileUrl(selectedProfile.verificationDocumentUrl)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="p-8 rounded-xl bg-secondary/30 text-center">
                                            <FileImage className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
                                            <p className="text-muted-foreground">Không có tài liệu xác minh</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                onClick={handleReject}
                                disabled={isProcessing}
                                className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                            >
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                                Từ chối
                            </Button>
                            <Button
                                onClick={handleApprove}
                                disabled={isProcessing}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                {isProcessing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                )}
                                Duyệt
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

function StatBadge({ label, value, color }: { label: string; value: number; color?: string }) {
    const colorClass = color ? `text-${color}` : "text-foreground"

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
            <span className="text-sm text-muted-foreground">{label}:</span>
            <span className={`font-semibold ${colorClass}`}>{value}</span>
        </div>
    )
}
