"use client"

import { useState } from "react"
import { Header } from "@/components/cva/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileSpreadsheet, Download, Loader2, FileCheck, Calendar } from "lucide-react"
import { cvaApi } from "@/lib/api/cva"
import { toast } from "sonner"

export default function CVAReportsPage() {
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)
        try {
            await cvaApi.downloadIssuanceReport()
            toast.success("Tải báo cáo thành công!", {
                description: "File Excel đã được tải về máy của bạn.",
            })
        } catch (error) {
            console.error("Failed to download report:", error)
            toast.error("Không thể tải báo cáo", {
                description: "Vui lòng thử lại sau.",
            })
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="min-h-screen">
            <Header title="Báo cáo" description="Xuất báo cáo phát hành tín chỉ carbon" />

            <div className="p-6 space-y-6">
                {/* Report Download Card */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-primary" />
                            Báo cáo phát hành tín chỉ
                        </CardTitle>
                        <CardDescription>
                            Tải xuống báo cáo Excel chứa tất cả thông tin về các tín chỉ carbon đã phát hành
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Report Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <FileCheck className="h-4 w-4" />
                                    <span className="text-sm">Định dạng</span>
                                </div>
                                <p className="font-medium">Microsoft Excel (.xlsx)</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">Nội dung</span>
                                </div>
                                <p className="font-medium">Tất cả tín chỉ đã phát hành</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <FileSpreadsheet className="h-4 w-4" />
                                    <span className="text-sm">Bao gồm</span>
                                </div>
                                <p className="font-medium">Thông tin xe, CO₂, tín chỉ</p>
                            </div>
                        </div>

                        {/* Report Content Description */}
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                            <p className="text-sm text-muted-foreground mb-3">Báo cáo bao gồm các thông tin sau:</p>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    ID yêu cầu và trạng thái phê duyệt
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    Thông tin xe điện (biển số, model)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    Lượng CO₂ tiết kiệm được
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    Số lượng tín chỉ đã cấp
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    Ngày yêu cầu và ngày phê duyệt
                                </li>
                            </ul>
                        </div>

                        {/* Download Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                            >
                                {isDownloading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    <Download className="h-5 w-5 mr-2" />
                                )}
                                {isDownloading ? "Đang tải..." : "Tải báo cáo Excel"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
