import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { useRouter } from '../../../contexts/RouterContext';
import { Leaf, TrendingUp, Wallet, Store, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { navigateTo } = useRouter();

  const kpis = [
    { icon: Leaf, label: 'Total CO₂ Saved', value: '1,250 kg', change: '+12%' },
    { icon: Wallet, label: 'Available Credits', value: '1.25 CC', change: '+0.5' },
    { icon: Store, label: 'On Sale', value: '1.00 CC', change: '' },
    { icon: TrendingUp, label: 'Revenue (30d)', value: '$250', change: '+25%' },
  ];

  const chartData = [
    { month: 'Jan', co2: 100 },
    { month: 'Feb', co2: 150 },
    { month: 'Mar', co2: 200 },
    { month: 'Apr', co2: 180 },
    { month: 'May', co2: 220 },
    { month: 'Jun', co2: 250 },
  ];

  const recentActivity = [
    { date: '2025-10-08', message: 'Request #123 approved' },
    { date: '2025-10-05', message: 'Sold 0.5 credits for $50' },
    { date: '2025-10-01', message: 'Time to request Q3/2025 issuance' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1>EV Owner Dashboard</h1>
          <p className="text-muted-foreground">Track your carbon savings and earnings</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground mb-2">{kpi.label}</p>
                    <p className="text-2xl font-semibold">{kpi.value}</p>
                    {kpi.change && (
                      <p className="text-sm text-primary mt-1">{kpi.change}</p>
                    )}
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <kpi.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>CO₂ Savings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="co2" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-between" onClick={() => navigateTo('/ev-owner/request-issuance')}>
                Request Credit Issuance
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="w-full justify-between" variant="outline" onClick={() => navigateTo('/ev-owner/listings')}>
                Create New Listing
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="text-sm text-muted-foreground">{activity.date}</div>
                    <div className="text-sm">{activity.message}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
