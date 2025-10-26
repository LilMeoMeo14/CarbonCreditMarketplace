import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Clock, Gavel, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export function Auctions() {
  const { credits } = useAppContext();
  const [bidAmount, setBidAmount] = React.useState<{ [key: string]: string }>({});
  const [myBids, setMyBids] = React.useState<Array<{
    creditId: string;
    amount: number;
    timestamp: string;
    status: 'active' | 'winning' | 'outbid';
  }>>([]);

  const auctionCredits = credits.filter(c => c.type === 'auction');

  const handlePlaceBid = (creditId: string) => {
    const amount = bidAmount[creditId];
    if (!amount) {
      toast.error('Vui lòng nhập số tiền đấu giá');
      return;
    }

    const credit = credits.find(c => c.id === creditId);
    const minBid = (credit?.currentBid || credit?.price || 0) * 1.05;
    
    if (parseFloat(amount) < minBid) {
      toast.error(`Giá thầu phải ít nhất ${minBid.toLocaleString('vi-VN')} ₫`);
      return;
    }

    // Add to my bids
    const newBid = {
      creditId,
      amount: parseFloat(amount),
      timestamp: new Date().toISOString(),
      status: 'winning' as const
    };

    // Update existing bids for this credit to 'outbid', add new bid as 'winning'
    setMyBids(prev => [
      ...prev.map(bid => 
        bid.creditId === creditId 
          ? { ...bid, status: 'outbid' as const }
          : bid
      ),
      newBid
    ]);

    toast.success('🎉 Đã đặt giá thầu thành công!');
    setBidAmount({ ...bidAmount, [creditId]: '' });
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime || Date.now() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days === 0 && hours < 6) {
      return { text: `${hours}h ${minutes}m`, urgent: true };
    }
    return { text: `${days}d ${hours}h`, urgent: false };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1>Đấu giá tín chỉ</h1>
          <p className="text-muted-foreground mt-2">
            Tham gia đấu giá để có được tín chỉ với giá tốt nhất
          </p>
        </div>

        {/* Active Auctions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionCredits.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <Gavel className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Hiện tại không có phiên đấu giá nào
                </p>
              </CardContent>
            </Card>
          ) : (
            auctionCredits.map((credit) => {
              const timeRemaining = getTimeRemaining(credit.auctionEndTime || '');
              return (
                <Card key={credit.id} className="hover:shadow-xl transition-all border-2 border-red-200 hover:border-red-400 relative overflow-hidden">
                  {/* Urgent banner for low stock */}
                  {(credit.projectInfo?.availableCredits || 0) < 30 && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs text-center py-1 font-bold animate-pulse">
                      ⚡ SỐ LƯỢNG CỰC KỲ GIỚI HẠN - CHỈ CÒN {credit.projectInfo?.availableCredits} tCO₂!
                    </div>
                  )}
                  <CardHeader className="pt-8">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-gradient-to-r from-red-600 to-orange-600">
                        <Gavel className="w-3 h-3 mr-1" />
                        🔥 Đấu giá
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${timeRemaining.urgent ? 'border-red-500 text-red-700 bg-red-50 animate-pulse' : 'border-orange-400'}`}
                      >
                        <Clock className="w-3 h-3" />
                        {timeRemaining.text}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{credit.projectInfo?.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border-2 border-red-200">
                        <div className="text-sm text-muted-foreground mb-1">Giá hiện tại</div>
                        <div className="text-3xl font-bold text-red-700">
                          {(credit.currentBid || credit.price).toLocaleString('vi-VN')} ₫
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          Giá khởi điểm: {credit.price.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="text-muted-foreground">Số lượt đặt</div>
                          <div className="font-bold flex items-center gap-1 text-orange-700">
                            <TrendingUp className="w-4 h-4" />
                            {credit.bidCount || 12} lượt
                          </div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="text-muted-foreground">Còn lại</div>
                          <div className="font-bold text-red-700">
                            {credit.projectInfo?.availableCredits} tCO₂
                          </div>
                        </div>
                      </div>

                      {timeRemaining.urgent && (
                        <div className="bg-red-100 border-2 border-red-400 p-3 rounded-lg text-center">
                          <div className="text-red-700 font-bold text-sm animate-pulse">
                            ⚠️ SẮP KẾT THÚC! ĐỪNG BỎ LỠ!
                          </div>
                        </div>
                      )}

                      <div className="border-t border-red-200 pt-4 space-y-2">
                        <Input
                          type="number"
                          placeholder={`Tối thiểu ${((credit.currentBid || credit.price) * 1.05).toLocaleString('vi-VN')} ₫`}
                          value={bidAmount[credit.id] || ''}
                          onChange={(e) => setBidAmount({ ...bidAmount, [credit.id]: e.target.value })}
                          className="border-red-300 focus:border-red-500"
                        />
                        <Button 
                          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg"
                          onClick={() => handlePlaceBid(credit.id)}
                        >
                          <Gavel className="w-4 h-4 mr-2" />
                          🔥 Đặt giá thầu ngay
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* My Bids */}
        <Card>
          <CardHeader>
            <CardTitle>Giá thầu của tôi</CardTitle>
            <CardDescription>
              {myBids.length > 0 ? `Bạn đang tham gia ${myBids.length} phiên đấu giá` : 'Danh sách các phiên đấu giá bạn đã tham gia'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myBids.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Gavel className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Bạn chưa tham gia đấu giá nào</p>
                <p className="text-sm mt-1">Đặt giá thầu ở các phiên đấu giá bên trên để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myBids.map((bid, index) => {
                  const credit = credits.find(c => c.id === bid.creditId);
                  if (!credit) return null;

                  return (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 ${
                        bid.status === 'winning' 
                          ? 'border-green-500 bg-green-50' 
                          : bid.status === 'outbid'
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium">{credit.projectInfo?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {credit.projectInfo?.availableCredits} tCO₂ • {credit.region}
                          </p>
                        </div>
                        <Badge 
                          variant={bid.status === 'winning' ? 'default' : 'secondary'}
                          className={
                            bid.status === 'winning' 
                              ? 'bg-green-600' 
                              : 'bg-orange-500'
                          }
                        >
                          {bid.status === 'winning' ? '🏆 Đang dẫn đầu' : '⚠️ Bị vượt giá'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Giá thầu của bạn</div>
                          <div className="font-bold text-lg">
                            {bid.amount.toLocaleString('vi-VN')} ₫
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Giá hiện tại</div>
                          <div className="font-bold text-lg text-red-600">
                            {(credit.currentBid || credit.price).toLocaleString('vi-VN')} ₫
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                        <span>Đặt lúc: {new Date(bid.timestamp).toLocaleString('vi-VN')}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Còn {getTimeRemaining(credit.auctionEndTime || '').text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}