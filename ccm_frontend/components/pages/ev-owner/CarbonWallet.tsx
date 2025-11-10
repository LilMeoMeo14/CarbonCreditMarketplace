import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function CarbonWallet() {
  const { credits, transactions, user } = useAppContext();

  // Calculate wallet stats
  const myCredits = credits.filter(c => c.ownerId === user?.id);
  const totalCredits = myCredits.reduce((sum, c) => sum + (c.projectInfo?.availableCredits || 0), 0);
  const totalSold = myCredits.reduce((sum, c) => {
    const sold = (c.amount || 0) - (c.projectInfo?.availableCredits || 0);
    return sum + sold;
  }, 0);
  
  const myTransactions = transactions.filter(t => t.seller === user?.name);
  const totalRevenue = myTransactions.reduce((sum, t) => sum + (t.totalPrice || 0), 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1>Ví tín chỉ carbon</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý tín chỉ carbon của bạn và theo dõi doanh thu
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Tín chỉ khả dụng</CardTitle>
            <Wallet className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCredits.toFixed(2)} tCO₂</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đang niêm yết trên marketplace
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Đã bán</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSold.toFixed(2)} tCO₂</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tổng tín chỉ đã bán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Doanh thu</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')} ₫</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tổng doanh thu từ bán tín chỉ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Available Credits */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tín chỉ khả dụng</CardTitle>
          <CardDescription>Danh sách tín chỉ đang niêm yết</CardDescription>
        </CardHeader>
        <CardContent>
          {myCredits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Bạn chưa có tín chỉ nào được phát hành
            </div>
          ) : (
            <div className="space-y-4">
              {myCredits.map((credit) => (
                <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{credit.projectInfo?.title || 'Tín chỉ carbon'}</span>
                      <Badge variant="secondary">{credit.vintage || '2025'}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {credit.projectInfo?.availableCredits || 0} / {credit.amount} tCO₂ còn lại
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{credit.price.toLocaleString('vi-VN')} ₫/tCO₂</div>
                    <div className="text-sm text-muted-foreground">
                      Giá niêm yết
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
          <CardDescription>Các giao dịch bán tín chỉ gần đây</CardDescription>
        </CardHeader>
        <CardContent>
          {myTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có giao dịch nào
            </div>
          ) : (
            <div className="space-y-3">
              {myTransactions.slice(0, 5).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Bán {transaction.quantity} tCO₂</div>
                      <div className="text-sm text-muted-foreground">
                        Cho {transaction.buyer}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      +{transaction.totalPrice.toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.purchaseDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
