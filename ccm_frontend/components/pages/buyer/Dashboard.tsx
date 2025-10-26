import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { useRouter } from '../../../contexts/RouterContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { ShoppingCart, Award, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { navigateTo } = useRouter();
  const { credits, transactions, user } = useAppContext();

  // Calculate stats
  const myPurchases = transactions.filter(t => t.buyer === user?.name);
  const totalCredits = myPurchases.reduce((sum, t) => sum + t.quantity, 0);
  const totalSpent = myPurchases.reduce((sum, t) => sum + t.finalPrice, 0);
  const availableCredits = credits.length;

  const kpis = [
    { 
      icon: Award, 
      label: 'Tín chỉ đã mua', 
      value: `${totalCredits.toFixed(2)} tCO₂`, 
      change: myPurchases.length > 0 ? `${myPurchases.length} giao dịch` : 'Chưa có',
      color: 'text-green-600'
    },
    { 
      icon: DollarSign, 
      label: 'Tổng chi tiêu', 
      value: `${totalSpent.toLocaleString('vi-VN')} ₫`, 
      change: totalSpent > 0 ? '30 ngày qua' : '',
      color: 'text-blue-600'
    },
    { 
      icon: ShoppingCart, 
      label: 'Credits khả dụng', 
      value: `${availableCredits}`, 
      change: 'Trên marketplace',
      color: 'text-purple-600'
    },
    { 
      icon: TrendingDown, 
      label: 'CO₂ đã bù trừ', 
      value: `${totalCredits.toFixed(2)} tCO₂`, 
      change: 'Đóng góp môi trường',
      color: 'text-emerald-600'
    },
  ];

  const chartData = [
    { month: 'T1', credits: 0 },
    { month: 'T2', credits: 0 },
    { month: 'T3', credits: 0 },
    { month: 'T4', credits: 0 },
    { month: 'T5', credits: 0 },
    { month: 'T6', credits: totalCredits * 0.3 },
    { month: 'T7', credits: totalCredits * 0.5 },
    { month: 'T8', credits: totalCredits * 0.7 },
    { month: 'T9', credits: totalCredits },
  ];

  const recentActivity = [
    { date: '10/10/2025', message: 'Đăng ký tài khoản thành công' },
    ...myPurchases.slice(0, 4).map(t => ({
      date: new Date(t.purchaseDate).toLocaleDateString('vi-VN'),
      message: `Mua ${t.quantity} tCO₂ từ ${t.seller}`
    }))
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1>Chào mừng trở lại!</h1>
          <p className="text-muted-foreground mt-2">
            Khám phá và mua tín chỉ carbon từ các chủ xe điện
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{kpi.label}</p>
                      <h3 className="mt-2">{kpi.value}</h3>
                      {kpi.change && (
                        <p className="text-sm text-muted-foreground mt-1">{kpi.change}</p>
                      )}
                    </div>
                    <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Purchase Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử mua tín chỉ</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="credits" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Chưa có hoạt động nào
                  </p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                      <div className="text-sm text-muted-foreground min-w-[80px]">{activity.date}</div>
                      <div className="text-sm flex-1">{activity.message}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo('/buyer/marketplace')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3>Khám phá Marketplace</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Xem và mua tín chỉ carbon đã được xác minh
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo('/buyer/history')}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3>Lịch sử giao dịch</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Xem các giao dịch và chứng chỉ đã mua
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Credits Preview */}
        {credits.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tín chỉ nổi bật</CardTitle>
              <Button variant="ghost" onClick={() => navigateTo('/buyer/marketplace')}>
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {credits.slice(0, 3).map((credit) => (
                  <Card key={credit.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo(`/credit/${credit.id}`)}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <h4 className="line-clamp-1">{credit.projectInfo?.title}</h4>
                        <p className="text-sm text-muted-foreground">{credit.region}</p>
                        <div className="flex items-baseline justify-between pt-2">
                          <span className="text-xs text-muted-foreground">Giá</span>
                          <span className="font-bold">{credit.price.toLocaleString('vi-VN')} ₫/tCO₂</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs text-muted-foreground">Còn lại</span>
                          <span className="text-sm">{credit.projectInfo?.availableCredits || 0} tCO₂</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
