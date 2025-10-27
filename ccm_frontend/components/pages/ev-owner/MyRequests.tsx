import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { useRouter } from '../../../contexts/RouterContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';

export function MyRequests() {
  const { pendingCredits, verifiedCredits, user } = useAppContext();
  const { navigateTo } = useRouter();

  // Filter requests by current user
  const myRequests = [...pendingCredits, ...verifiedCredits].filter(
    req => req.ownerId === user?.id || req.ownerName === user?.name
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Chờ duyệt</Badge>;
      case 'verified':
        return <Badge className="gap-1 bg-green-500"><CheckCircle className="w-3 h-3" /> Đã duyệt</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Từ chối</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1>Hồ sơ của tôi</h1>
          <p className="text-muted-foreground mt-2">
            Danh sách các hồ sơ phát thải đã gửi và trạng thái xác minh
          </p>
        </div>
        <Button onClick={() => navigateTo('/ev-owner/submit-emission')}>
          Gửi hồ sơ mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ sơ ({myRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {myRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Bạn chưa gửi hồ sơ phát thải nào
              </p>
              <Button onClick={() => navigateTo('/ev-owner/submit-emission')}>
                Gửi hồ sơ đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead>Xe điện</TableHead>
                  <TableHead>Quãng đường</TableHead>
                  <TableHead>Tín chỉ (tCO₂)</TableHead>
                  <TableHead>Kỳ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {new Date(request.submittedAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell>{request.vehicle}</TableCell>
                    <TableCell>{request.distance}</TableCell>
                    <TableCell>{request.amount.toFixed(2)}</TableCell>
                    <TableCell>Q{request.quarter}/{request.year}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">
                {myRequests.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">Chờ duyệt</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">
                {myRequests.filter(r => r.status === 'verified').length}
              </div>
              <p className="text-sm text-muted-foreground">Đã duyệt</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">
                {myRequests.filter(r => r.status === 'rejected').length}
              </div>
              <p className="text-sm text-muted-foreground">Từ chối</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
