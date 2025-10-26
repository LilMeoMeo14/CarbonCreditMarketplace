import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { useRouter } from '../../../contexts/RouterContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Search, Filter, ShoppingCart, MapPin, Calendar, Award, TrendingUp, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function Marketplace() {
  const { credits, addToCart } = useAppContext();
  const { navigateTo } = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [selectedRegion, setSelectedRegion] = React.useState<string>('all');
  const [priceRange, setPriceRange] = React.useState({ min: '', max: '' });
  const [selectedYear, setSelectedYear] = React.useState<string>('all');
  const [selectedCreditType, setSelectedCreditType] = React.useState<string>('all');

  // Filter published credits only
  const publishedCredits = credits.filter(c => c.status === 'published');

  // Apply filters
  const filteredCredits = publishedCredits.filter(credit => {
    // Search query
    if (searchQuery && !credit.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !credit.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !credit.region.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (selectedType !== 'all' && credit.type !== selectedType) {
      return false;
    }

    // Region filter
    if (selectedRegion !== 'all' && credit.region !== selectedRegion) {
      return false;
    }

    // Year filter
    if (selectedYear !== 'all' && credit.year !== selectedYear) {
      return false;
    }

    // Credit type filter (verification standard)
    if (selectedCreditType !== 'all') {
      const creditOrg = credit.verificationInfo?.organization || '';
      if (!creditOrg.toLowerCase().includes(selectedCreditType.toLowerCase())) {
        return false;
      }
    }

    // Price range
    if (priceRange.min && credit.price < parseFloat(priceRange.min)) {
      return false;
    }
    if (priceRange.max && credit.price > parseFloat(priceRange.max)) {
      return false;
    }

    return true;
  });

  const handleAddToCart = (creditId: string) => {
    const result = addToCart(creditId, 1);
    if (result.success) {
      toast.success('Đã thêm vào giỏ hàng!');
      navigateTo('/buyer/cart');
    } else {
      toast.error(result.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  // Stats
  const stats = [
    {
      label: 'Tổng tín chỉ có sẵn',
      value: publishedCredits.reduce((sum, c) => sum + c.amount, 0).toFixed(2),
      suffix: 'tCO₂',
      icon: Award,
      color: 'from-primary to-accent'
    },
    {
      label: 'Đang bán trực tiếp',
      value: publishedCredits.filter(c => c.type === 'direct').length,
      suffix: 'tín chỉ',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Đang đấu giá',
      value: publishedCredits.filter(c => c.type === 'auction').length,
      suffix: 'tín chỉ',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Giá trung bình',
      value: publishedCredits.length > 0 
        ? (publishedCredits.reduce((sum, c) => sum + c.price, 0) / publishedCredits.length / 1000).toFixed(0)
        : '0',
      suffix: 'K ₫/tCO₂',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2">🌿 Thị trường Tín chỉ Carbon</h1>
          <p className="text-muted-foreground text-lg">
            Tín chỉ đã được CVA xác minh và sẵn sàng để mua
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </span>
                        <span className="text-sm text-muted-foreground">{stat.suffix}</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Bộ lọc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Tìm kiếm</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Tên, xe, khu vực..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                {/* Type Filter */}
                <div>
                  <Label>Loại bán</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="direct">💰 Bán trực tiếp</SelectItem>
                      <SelectItem value="auction">🔥 Đấu giá</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Region Filter */}
                <div>
                  <Label>Khu vực</Label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                      <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                      <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                      <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                      <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div>
                  <Label>Năm phát hành</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Credit Type / Standard Filter */}
                <div>
                  <Label>Loại tín chỉ</Label>
                  <Select value={selectedCreditType} onValueChange={setSelectedCreditType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="verra">Verra - VCS</SelectItem>
                      <SelectItem value="gold">Gold Standard</SelectItem>
                      <SelectItem value="tuv">TÜV SÜD</SelectItem>
                      <SelectItem value="scs">SCS Global Services</SelectItem>
                      <SelectItem value="erm">ERM CVS</SelectItem>
                      <SelectItem value="gcv">Green Cert Vietnam</SelectItem>
                      <SelectItem value="cva">Carbon Verify Asia</SelectItem>
                      <SelectItem value="vccb">Vietnam Carbon Credit Bureau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label>Khoảng giá (₫/tCO₂)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Từ"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Đến"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    />
                  </div>
                </div>

                {/* Reset Filters */}
                <Button 
                  variant="outline" 
                  className="w-full border-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedRegion('all');
                    setSelectedYear('all');
                    setSelectedCreditType('all');
                    setPriceRange({ min: '', max: '' });
                  }}
                >
                  Đặt lại bộ lọc
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Credits Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                Hiển thị <strong className="text-primary">{filteredCredits.length}</strong> tín chỉ
              </p>
            </div>

            {filteredCredits.length === 0 ? (
              <Card className="border-2">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="mb-2">Không tìm thấy tín chỉ nào</h3>
                  <p className="text-muted-foreground mb-4">
                    Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                  </p>
                  <Button variant="outline" className="border-2" onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedRegion('all');
                    setSelectedYear('all');
                    setSelectedCreditType('all');
                    setPriceRange({ min: '', max: '' });
                  }}>
                    Xóa tất cả bộ lọc
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCredits.map((credit) => (
                  <Card key={credit.id} className="hover:shadow-xl hover:shadow-primary/10 transition-all border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 space-x-2">
                          <Badge className={credit.type === 'direct' ? 'bg-primary' : 'bg-orange-500'}>
                            {credit.type === 'direct' ? '💰 Bán trực tiếp' : '🔥 Đấu giá'}
                          </Badge>
                          <Badge variant="outline" className="border-primary/50">
                            {credit.certificateId ? '✓ Đã xác minh' : 'Đang xử lý'}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{credit.vehicle}</CardTitle>
                      <p className="text-sm text-muted-foreground">Người bán: {credit.ownerName}</p>
                      {credit.verificationInfo?.organization && (
                        <p className="text-xs text-primary font-medium mt-1">
                          🏅 {credit.verificationInfo.organization}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Credit Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          <div>
                            <div className="text-muted-foreground">Số lượng</div>
                            <div className="font-medium">{credit.amount} tCO₂</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="text-muted-foreground">Khu vực</div>
                            <div className="font-medium">{credit.region}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <div>
                            <div className="text-muted-foreground">Năm</div>
                            <div className="font-medium">{credit.year}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-orange-600" />
                          <div>
                            <div className="text-muted-foreground">Quý</div>
                            <div className="font-medium">Q{credit.quarter}/{credit.year}</div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Pricing */}
                      <div>
                        {credit.type === 'direct' ? (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Giá bán cố định</div>
                            <div className="text-2xl font-bold text-primary">
                              {credit.price.toLocaleString('vi-VN')} ₫
                              <span className="text-sm font-normal text-muted-foreground">/tCO₂</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Tổng: {(credit.price * credit.amount).toLocaleString('vi-VN')} ₫
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Giá hiện tại</div>
                            <div className="text-2xl font-bold text-orange-600">
                              {(credit.currentBid || credit.price).toLocaleString('vi-VN')} ₫
                              <span className="text-sm font-normal text-muted-foreground">/tCO₂</span>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {credit.bidCount || 0} lượt đặt giá • Giá khởi điểm: {credit.price.toLocaleString('vi-VN')} ₫
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 border-2"
                          onClick={() => navigateTo(`/buyer/credit/${credit.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                        {credit.type === 'direct' ? (
                          <Button 
                            className="flex-1 bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
                            onClick={() => handleAddToCart(credit.id)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Mua ngay
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20"
                            onClick={() => navigateTo('/buyer/auctions')}
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Đấu giá
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
