import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { TrendingUp, Download, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function CarbonTracking() {
  const [timeRange, setTimeRange] = React.useState('6months');

  const monthlyData = [
    { month: 'T4', distance: 520, electricity: 78, carbon: 31.2 },
    { month: 'T5', distance: 480, electricity: 72, carbon: 28.8 },
    { month: 'T6', distance: 650, electricity: 97.5, carbon: 39 },
    { month: 'T7', distance: 720, electricity: 108, carbon: 43.2 },
    { month: 'T8', distance: 580, electricity: 87, carbon: 34.8 },
    { month: 'T9', distance: 690, electricity: 103.5, carbon: 41.4 },
  ];

  const totalCarbon = monthlyData.reduce((sum, m) => sum + m.carbon, 0);
  const totalDistance = monthlyData.reduce((sum, m) => sum + m.distance, 0);
  const totalElectricity = monthlyData.reduce((sum, m) => sum + m.electricity, 0);
  const avgEfficiency = totalElectricity / totalDistance * 100;

  const exportToCSV = () => {
    const csv = [
      ['Tháng', 'Quãng đường (km)', 'Điện tiêu thụ (kWh)', 'Carbon tiết kiệm (kg)'],
      ...monthlyData.map(m => [m.month, m.distance, m.electricity, m.carbon])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carbon-tracking.csv';
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Theo dõi carbon</h1>
            <p className="text-muted-foreground mt-2">
              Phân tích chi tiết quá trình tiết kiệm carbon của bạn
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 tháng gần nhất</SelectItem>
                <SelectItem value="6months">6 tháng gần nhất</SelectItem>
                <SelectItem value="12months">12 tháng gần nhất</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Xuất CSV
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{totalCarbon.toFixed(1)} kg</div>
                <p className="text-sm text-muted-foreground mt-1">CO₂ tiết kiệm</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalDistance.toLocaleString()} km</div>
                <p className="text-sm text-muted-foreground mt-1">Tổng quãng đường</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalElectricity.toFixed(1)} kWh</div>
                <p className="text-sm text-muted-foreground mt-1">Điện tiêu thụ</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{avgEfficiency.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground mt-1">kWh/100km</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carbon Savings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Biểu đồ tiết kiệm carbon</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="carbon" stroke="hsl(var(--chart-1))" name="Carbon tiết kiệm (kg)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distance & Electricity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Quãng đường & Điện tiêu thụ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="distance" fill="hsl(var(--chart-2))" name="Quãng đường (km)" />
                <Bar yAxisId="right" dataKey="electricity" fill="hsl(var(--chart-3))" name="Điện (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Tác động môi trường</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Tương đương trồng cây</div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(totalCarbon / 20)} cây xanh trồng trong 1 năm
                  </p>
                </div>
                <div className="text-2xl">🌳</div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Tương đương giảm xe xăng</div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round(totalDistance * 0.12)} lít xăng tiết kiệm được
                  </p>
                </div>
                <div className="text-2xl">⛽</div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Đóng góp cho môi trường</div>
                  <p className="text-sm text-muted-foreground">
                    Top 15% người dùng tiết kiệm carbon nhiều nhất
                  </p>
                </div>
                <div className="text-2xl">🏆</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}