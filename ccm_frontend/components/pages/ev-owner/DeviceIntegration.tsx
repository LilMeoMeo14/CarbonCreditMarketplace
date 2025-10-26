import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Smartphone, Wifi, Key, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function DeviceIntegration() {
  const [apiKey, setApiKey] = React.useState(import.meta.env.VITE_STRIPE_SECRET_KEY || '');
  const [devices, setDevices] = React.useState([
    {
      id: '1',
      name: 'VinFast VF8 - OBD Device',
      type: 'OBD-II',
      status: 'connected',
      lastSync: '2 phút trước',
      dataPoints: 1250
    }
  ]);

  const generateNewApiKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast.success('Đã tạo API key mới!');
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('Đã sao chép API key!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1>Kết nối thiết bị</h1>
          <p className="text-muted-foreground mt-2">
            Tích hợp thiết bị và API để tự động theo dõi dữ liệu xe điện
          </p>
        </div>

        <Tabs defaultValue="devices">
          <TabsList>
            <TabsTrigger value="devices">Thiết bị</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="integrations">Tích hợp</TabsTrigger>
          </TabsList>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thiết bị đã kết nối</CardTitle>
                    <CardDescription>Quản lý các thiết bị OBD-II và telematics</CardDescription>
                  </div>
                  <Button>
                    <Smartphone className="w-4 h-4 mr-2" />
                    Thêm thiết bị
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Wifi className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-muted-foreground">{device.type}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đang hoạt động
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Đồng bộ: {device.lastSync}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{device.dataPoints.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Điểm dữ liệu</div>
                        <Button size="sm" variant="ghost" className="mt-2">
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Đồng bộ
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Supported Devices */}
            <Card>
              <CardHeader>
                <CardTitle>Thiết bị được hỗ trợ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['OBD-II Bluetooth', 'OBD-II WiFi', 'Telematics GPS', 'Smartphone App', 'VinFast Connect', 'Tesla API'].map((device) => (
                    <div key={device} className="p-4 border rounded-lg text-center">
                      <Smartphone className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="font-medium">{device}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Sử dụng API key để tích hợp dữ liệu từ ứng dụng của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key hiện tại</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="apiKey"
                      value={apiKey}
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={copyApiKey}>
                      Sao chép
                    </Button>
                    <Button variant="outline" onClick={generateNewApiKey}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Tạo mới
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Ví dụ sử dụng API</h4>
                  <pre className="text-sm bg-background p-3 rounded overflow-x-auto">
{`curl -X POST https://api.carbonmarket.vn/v1/data \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "distance": 125.5,
    "electricity": 18.8,
    "timestamp": "2025-10-11T10:00:00Z"
  }'`}
                  </pre>
                </div>

                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
                  <p className="text-sm">
                    ⚠️ <strong>Bảo mật:</strong> Không chia sẻ API key của bạn với người khác. 
                    Nếu key bị lộ, hãy tạo key mới ngay lập tức.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tích hợp sẵn có</CardTitle>
                <CardDescription>Kết nối với các nền tảng và dịch vụ khác</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'VinFast Connect', status: 'available', desc: 'Tự động đồng bộ dữ liệu từ VinFast' },
                    { name: 'Tesla API', status: 'available', desc: 'Kết nối trực tiếp với xe Tesla' },
                    { name: 'Google Maps', status: 'connected', desc: 'Theo dõi lộ trình di chuyển' },
                    { name: 'Zapier', status: 'available', desc: 'Tự động hóa workflow' },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{integration.name}</div>
                        <p className="text-sm text-muted-foreground">{integration.desc}</p>
                      </div>
                      {integration.status === 'connected' ? (
                        <Badge className="bg-green-500">Đã kết nối</Badge>
                      ) : (
                        <Button variant="outline">Kết nối</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
