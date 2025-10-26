import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { ArrowLeft, Users, DollarSign, FileText, TrendingUp, Search, Download, Shield, AlertTriangle } from 'lucide-react';
import { useRouter } from '../../../contexts/RouterContext';
import { useAppContext } from '../../../contexts/AppContext';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { navigate } = useRouter();
  const { credits, pendingCredits, transactions } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState({
    platformFee: 5,
    cvaFee: 5,
    verificationMaxDays: 3
  });

  const mockUsers = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', role: 'EV Owner', status: 'active', joinDate: '2024-01-10' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', role: 'Buyer', status: 'active', joinDate: '2024-01-15' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', role: 'EV Owner', status: 'pending', joinDate: '2024-01-20' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', role: 'Buyer', status: 'active', joinDate: '2024-01-22' }
  ];

  const mockTransactions = [
    { id: 'TX001', buyer: 'Trần Thị B', seller: 'Nguyễn Văn A', amount: 3.2, value: 448000, date: '2024-01-25', status: 'completed' },
    { id: 'TX002', buyer: 'Phạm Thị D', seller: 'Lê Văn C', amount: 2.8, value: 350000, date: '2024-01-24', status: 'pending' },
    { id: 'TX003', buyer: 'Nguyễn Văn E', seller: 'Trần Thị B', amount: 1.5, value: 187500, date: '2024-01-23', status: 'completed' }
  ];

  const mockDisputes = [
    { id: 'DIS001', transaction: 'TX002', reporter: 'Phạm Thị D', issue: 'Chất lượng minh chứng không đúng', status: 'investigating', date: '2024-01-25' },
    { id: 'DIS002', transaction: 'TX001', reporter: 'Trần Thị B', issue: 'Chậm giao chứng nhận', status: 'resolved', date: '2024-01-20' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getTotalRevenue = () => {
    return mockTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.value, 0);
  };

  const getStatistics = () => {
    return {
      totalUsers: mockUsers.length,
      activeCredits: credits.length,
      pendingCredits: pendingCredits.length,
      totalTransactions: mockTransactions.length,
      totalRevenue: getTotalRevenue(),
      totalCO2: credits.reduce((sum, c) => sum + c.amount, 0) + 
               pendingCredits.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0),
      platformFee: getTotalRevenue() * 0.03
    };
  };

  const stats = getStatistics();

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 mr-4 text-white hover:bg-purple-800"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
              </Button>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Quản trị hệ thống</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng người dùng</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Doanh thu</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(stats.totalRevenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tín chỉ hoạt động</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.activeCredits}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng CO₂</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalCO2.toFixed(1)} tCO₂</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
            <TabsTrigger value="credits">Tín chỉ</TabsTrigger>
            <TabsTrigger value="disputes">Tranh chấp</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tín chỉ mới được tạo</span>
                      <Badge variant="outline">+2</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Giao dịch hoàn thành</span>
                      <Badge variant="outline">+1</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Người dùng mới đăng ký</span>
                      <Badge variant="outline">+3</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Tranh chấp mới</span>
                      <Badge variant="destructive">+1</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống kê doanh thu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Tổng giao dịch:</span>
                      <span className="font-medium">{formatPrice(stats.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí nền tảng (3%):</span>
                      <span className="font-medium text-green-600">{formatPrice(stats.platformFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số giao dịch:</span>
                      <span className="font-medium">{stats.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giá trung bình:</span>
                      <span className="font-medium">
                        {formatPrice(stats.totalRevenue / stats.totalTransactions)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quản lý người dùng</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tham gia</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status === 'active' ? 'Hoạt động' : 'Chờ duyệt'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Chi tiết
                            </Button>
                            {user.status === 'active' ? (
                              <Button size="sm" variant="destructive">
                                Ban
                              </Button>
                            ) : (
                              <Button size="sm" variant="default">
                                Kích hoạt
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý giao dịch</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã GD</TableHead>
                      <TableHead>Người mua</TableHead>
                      <TableHead>Người bán</TableHead>
                      <TableHead>Lượng CO₂</TableHead>
                      <TableHead>Giá trị</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.buyer}</TableCell>
                        <TableCell>{transaction.seller}</TableCell>
                        <TableCell>{transaction.amount} tCO₂</TableCell>
                        <TableCell>{formatPrice(transaction.value)}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tín chỉ đang niêm yết</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {credits.map((credit) => (
                      <div key={credit.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="font-medium">{credit.ownerName}</div>
                          <div className="text-sm text-gray-600">
                            {credit.amount} tCO₂ • {formatPrice(credit.price)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={credit.type === 'direct' ? 'default' : 'secondary'}>
                            {credit.type === 'direct' ? 'Trực tiếp' : 'Đấu giá'}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              if (confirm('Xóa tín chỉ này?')) {
                                toast.success('Đã xóa tín chỉ');
                              }
                            }}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tín chỉ chờ xác minh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingCredits.map((credit) => (
                      <div key={credit.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{credit.ownerName}</div>
                          <div className="text-sm text-gray-600">
                            {credit.vehicle} • {credit.distance}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Chờ CVA
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Xử lý tranh chấp</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDisputes.map((dispute) => (
                    <Card key={dispute.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">#{dispute.id}</div>
                            <div className="text-sm text-gray-600">
                              Giao dịch: {dispute.transaction}
                            </div>
                            <div className="text-sm text-gray-600">
                              Người báo cáo: {dispute.reporter}
                            </div>
                            <div className="text-sm mt-2">
                              Vấn đề: {dispute.issue}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={dispute.status === 'resolved' ? 'default' : 'destructive'}>
                              {dispute.status === 'resolved' ? 'Đã giải quyết' : 'Đang điều tra'}
                            </Badge>
                            <div className="text-sm text-gray-600 mt-1">
                              {dispute.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                          </Button>
                          {dispute.status !== 'resolved' && (
                            <Button size="sm">
                              Giải quyết
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Báo cáo hệ thống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Báo cáo giao dịch tháng
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Báo cáo người dùng
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Báo cáo tín chỉ carbon
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Báo cáo doanh thu
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt hệ thống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phí nền tảng (%)</label>
                    <Input 
                      type="number" 
                      value={settings.platformFee}
                      onChange={(e) => setSettings(prev => ({ ...prev, platformFee: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phí CVA (%)</label>
                    <Input 
                      type="number" 
                      value={settings.cvaFee}
                      onChange={(e) => setSettings(prev => ({ ...prev, cvaFee: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Thời gian xác minh tối đa (ngày)</label>
                    <Input 
                      type="number" 
                      value={settings.verificationMaxDays}
                      onChange={(e) => setSettings(prev => ({ ...prev, verificationMaxDays: parseInt(e.target.value) }))}
                    />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      toast.success('Đã lưu cài đặt hệ thống!');
                      console.log('Settings saved:', settings);
                    }}
                  >
                    Lưu cài đặt
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}