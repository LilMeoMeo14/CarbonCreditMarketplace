import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { CheckCircle, Calendar } from 'lucide-react';

export function IssuanceHistory() {
  const { credits, user } = useAppContext();

  // Filter issued credits by current user
  const myIssuedCredits = credits.filter(c => c.ownerId === user?.id);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1>Lịch sử phát hành</h1>
        <p className="text-muted-foreground mt-2">
          Danh sách tín chỉ carbon đã được CVA phát hành cho bạn
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tín chỉ đã phát hành ({myIssuedCredits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {myIssuedCredits.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-2">
                Chưa có tín chỉ nào được phát hành
              </p>
              <p className="text-sm text-muted-foreground">
                Gửi hồ sơ phát thải và chờ CVA xác minh để nhận tín chỉ
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày phát hành</TableHead>
                  <TableHead>Dự án</TableHead>
                  <TableHead>Số lượng (tCO₂)</TableHead>
                  <TableHead>Giá (₫/tCO₂)</TableHead>
                  <TableHead>Vintage</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myIssuedCredits.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(credit.postedAt || credit.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{credit.projectInfo?.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {credit.vehicle} - {credit.region}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{credit.amount.toFixed(2)}</TableCell>
                    <TableCell>{credit.price.toLocaleString('vi-VN')}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{credit.projectInfo?.vintage || '2025'}</Badge>
                    </TableCell>
                    <TableCell>
                      {credit.status === 'published' ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Đang giao dịch
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{credit.status}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {myIssuedCredits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {myIssuedCredits.reduce((sum, c) => sum + c.amount, 0).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Tổng tín chỉ phát hành (tCO₂)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {myIssuedCredits.reduce((sum, c) => sum + (c.projectInfo?.availableCredits || 0), 0).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Còn lại (tCO₂)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {myIssuedCredits.reduce((sum, c) => {
                    const sold = c.amount - (c.projectInfo?.availableCredits || 0);
                    return sum + sold;
                  }, 0).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Đã bán (tCO₂)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
