import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Plus, Edit, Trash2, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function ListingsManagement() {
  const { credits, user } = useAppContext();
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({
    creditAmount: '',
    price: '',
    type: 'direct',
    auctionDuration: '7'
  });

  const myListings = credits.filter(c => c.ownerId === user?.id);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã tạo listing thành công!');
    setShowCreateDialog(false);
    setFormData({ creditAmount: '', price: '', type: 'direct', auctionDuration: '7' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Quản lý niêm yết</h1>
            <p className="text-muted-foreground mt-2">
              Tạo và quản lý các listings bán tín chỉ carbon
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tạo listing mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo listing mới</DialogTitle>
                <DialogDescription>
                  Tạo một listing để bán tín chỉ carbon của bạn trên marketplace
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateListing} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Số lượng tín chỉ (tCO₂)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.creditAmount}
                    onChange={(e) => setFormData({ ...formData, creditAmount: e.target.value })}
                    placeholder="10.50"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Giá mỗi tCO₂ (VNĐ)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="85000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Loại bán</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct">Bán trực tiếp</SelectItem>
                      <SelectItem value="auction">Đấu giá</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.type === 'auction' && (
                  <div>
                    <Label htmlFor="duration">Thời gian đấu giá (ngày)</Label>
                    <Select value={formData.auctionDuration} onValueChange={(value) => setFormData({ ...formData, auctionDuration: value })}>
                      <SelectTrigger id="duration">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 ngày</SelectItem>
                        <SelectItem value="7">7 ngày</SelectItem>
                        <SelectItem value="14">14 ngày</SelectItem>
                        <SelectItem value="30">30 ngày</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button type="submit" className="w-full">
                  Tạo listing
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Listings đang hoạt động ({myListings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {myListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Chưa có listing nào
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  Tạo listing đầu tiên
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tín chỉ</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Lượt xem</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myListings.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{listing.projectInfo?.title}</div>
                          <div className="text-sm text-muted-foreground">{listing.region}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{listing.projectInfo?.availableCredits} tCO₂</div>
                          <div className="text-sm text-muted-foreground">
                            Còn lại / {listing.amount}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {listing.price.toLocaleString('vi-VN')} ₫
                      </TableCell>
                      <TableCell>
                        <Badge variant={listing.type === 'auction' ? 'default' : 'secondary'}>
                          {listing.type === 'direct' ? 'Trực tiếp' : 'Đấu giá'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">245</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Đang bán</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{myListings.reduce((sum, l) => sum + (l.amount - (l.projectInfo?.availableCredits || 0)), 0).toFixed(2)}</div>
                <p className="text-sm text-muted-foreground mt-1">tCO₂ đã bán</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-sm text-muted-foreground mt-1">Tổng lượt xem</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">85%</div>
                <p className="text-sm text-muted-foreground mt-1">Tỷ lệ chuyển đổi</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
