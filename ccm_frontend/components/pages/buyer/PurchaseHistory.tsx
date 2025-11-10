import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Separator } from '../../ui/separator';
import { Download, FileText, CheckCircle, Calendar, MapPin, Award } from 'lucide-react';
import { toast } from 'sonner';

export function PurchaseHistory() {
  const { transactions, user } = useAppContext();

  // Filter transactions for current user
  const myTransactions = transactions.filter(
    t => t.buyerEmail === user?.email || t.buyer === user?.name
  );

  const totalSpent = myTransactions.reduce((sum, t) => sum + (t.finalPrice || 0), 0);
  const totalCredits = myTransactions.reduce((sum, t) => sum + (t.quantity || 0), 0);

  const downloadCertificate = (transaction: any) => {
    // Generate PDF-like content
    const certificateContent = `
=============================================================
           CHỨNG CHỈ TÍN CHỈ CARBON
=============================================================

Mã chứng chỉ: ${transaction.certificateId}
Ngày phát hành: ${new Date(transaction.purchaseDate).toLocaleDateString('vi-VN')}

-------------------------------------------------------------
THÔNG TIN GIAO DỊCH
-------------------------------------------------------------
Tên dự án: ${transaction.creditTitle}
Số lượng: ${transaction.quantity} tCO₂
Giá trên tín chỉ: ${transaction.pricePerCredit.toLocaleString('vi-VN')} ₫
Tổng tiền: ${transaction.totalPrice.toLocaleString('vi-VN')} ₫
Phí nền tảng (5%): ${transaction.platformFee.toLocaleString('vi-VN')} ₫
Tổng thanh toán: ${transaction.finalPrice.toLocaleString('vi-VN')} ₫

-------------------------------------------------------------
NGƯỜI MUA
-------------------------------------------------------------
Tên: ${transaction.buyer}
Email: ${transaction.buyerEmail}

-------------------------------------------------------------
NGƯỜI BÁN
-------------------------------------------------------------
Tên: ${transaction.seller}
Email: ${transaction.sellerEmail}

-------------------------------------------------------------
THÔNG TIN TÍN CHỈ
-------------------------------------------------------------
Khu vực: ${transaction.region}
Phương tiện: ${transaction.vehicle}
Năm phát hành: ${transaction.vintage}
Số seri: ${transaction.serialNumber}

-------------------------------------------------------------
XÁC MINH
-------------------------------------------------------------
Tiêu chuẩn: ${transaction.standard}
Tổ chức xác minh: ${transaction.organization}
Trạng thái: ${transaction.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}

-------------------------------------------------------------
Phương thức thanh toán: ${transaction.paymentMethod}
Mã giao dịch: ${transaction.id}

=============================================================
     Marketplace Tín Chỉ Carbon Xe Điện Việt Nam
          https://carbonmarket.vn
=============================================================

Chứng chỉ này xác nhận việc mua ${transaction.quantity} tCO₂ 
từ dự án "${transaction.creditTitle}".

Ngày tạo: ${new Date().toLocaleString('vi-VN')}
`;

    // Create blob and download
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate_${transaction.certificateId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Đã tải xuống chứng chỉ!');
  };

  const downloadAllCertificates = () => {
    myTransactions.forEach((transaction, index) => {
      setTimeout(() => {
        downloadCertificate(transaction);
      }, index * 500); // Delay to avoid browser blocking
    });
    toast.success(`Đang tải ${myTransactions.length} chứng chỉ...`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1>Lịch sử mua hàng</h1>
            <p className="text-muted-foreground mt-2">
              Xem lại các giao dịch và tải chứng chỉ carbon
            </p>
          </div>
          {myTransactions.length > 0 && (
            <Button variant="outline" onClick={downloadAllCertificates}>
              <Download className="w-4 h-4 mr-2" />
              Tải tất cả chứng chỉ
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{myTransactions.length}</div>
                <p className="text-sm text-muted-foreground mt-1">Giao dịch</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{totalCredits.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground mt-1">tCO₂ đã mua</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {totalSpent.toLocaleString('vi-VN')} ₫
                </div>
                <p className="text-sm text-muted-foreground mt-1">Tổng chi tiêu</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        {myTransactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Chưa có giao dịch nào</h3>
              <p className="text-muted-foreground mb-4">
                Lịch sử mua hàng sẽ hiển thị ở đây sau khi bạn thực hiện giao dịch đầu tiên
              </p>
              <Button onClick={() => window.location.href = '/buyer/marketplace'}>
                Khám phá thị trường
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {myTransactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{transaction.creditTitle}</CardTitle>
                        <Badge className="bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(transaction.purchaseDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Mã GD: {transaction.id}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadCertificate(transaction)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Tải chứng chỉ
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Thông tin tín chỉ</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Khu vực:</span>
                            <span className="font-medium">{transaction.region}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Phương tiện:</span>
                            <span className="font-medium">{transaction.vehicle}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Award className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Tiêu chuẩn:</span>
                            <Badge variant="outline" className="text-xs">
                              {transaction.standard}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Người bán</div>
                        <div className="font-medium">{transaction.seller}</div>
                        <div className="text-sm text-muted-foreground">{transaction.sellerEmail}</div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="text-sm text-muted-foreground mb-3">Chi tiết thanh toán</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Số lượng:</span>
                            <span className="font-medium">{transaction.quantity} tCO₂</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Giá mỗi tCO₂:</span>
                            <span className="font-medium">
                              {transaction.pricePerCredit.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tổng tiền:</span>
                            <span className="font-medium">
                              {transaction.totalPrice.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Phí nền tảng (5%):</span>
                            <span className="font-medium">
                              {transaction.platformFee.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium">Tổng thanh toán:</span>
                            <span className="text-lg font-bold text-green-700">
                              {transaction.finalPrice.toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Mã chứng chỉ: <span className="font-mono">{transaction.certificateId}</span></div>
                        <div>Phương thức: {transaction.paymentMethod}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Download All Table (Alternative View) */}
        {myTransactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Bảng tổng hợp</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Dự án</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.purchaseDate).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.creditTitle}</div>
                        <div className="text-sm text-muted-foreground">{transaction.region}</div>
                      </TableCell>
                      <TableCell>{transaction.quantity} tCO₂</TableCell>
                      <TableCell className="font-medium">
                        {transaction.finalPrice.toLocaleString('vi-VN')} ₫
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-600">Hoàn thành</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadCertificate(transaction)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
