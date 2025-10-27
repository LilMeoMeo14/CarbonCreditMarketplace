import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Car, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function EVProfile() {
  const { user } = useAppContext();
  const [vehicles, setVehicles] = React.useState([
    {
      id: '1',
      make: 'VinFast',
      model: 'VF8',
      year: 2024,
      vin: 'LVSHCAMB1PE123456',
      licensePlate: '30A-12345',
      batteryCapacity: 87.7,
      verified: true,
      registrationDoc: 'registration_VF8.pdf'
    }
  ]);

  const [showAddForm, setShowAddForm] = React.useState(false);
  const [formData, setFormData] = React.useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    licensePlate: '',
    batteryCapacity: ''
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle = {
      id: Date.now().toString(),
      ...formData,
      year: parseInt(formData.year),
      batteryCapacity: parseFloat(formData.batteryCapacity),
      verified: false,
      registrationDoc: ''
    };
    setVehicles([...vehicles, newVehicle]);
    setFormData({ make: '', model: '', year: '', vin: '', licensePlate: '', batteryCapacity: '' });
    setShowAddForm(false);
    toast.success('Đã thêm xe thành công! Chờ xác minh.');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1>Hồ sơ xe điện</h1>
            <p className="text-muted-foreground mt-2">
              Quản lý thông tin xe điện của bạn
            </p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm xe mới
          </Button>
        </div>

        {/* Add Vehicle Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Thêm xe điện mới</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Hãng xe</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      placeholder="VinFast, Tesla, Hyundai..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Mẫu xe</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="VF8, Model 3..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Năm sản xuất</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="2024"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">Biển số xe</Label>
                    <Input
                      id="licensePlate"
                      value={formData.licensePlate}
                      onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                      placeholder="30A-12345"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="vin">Số VIN</Label>
                    <Input
                      id="vin"
                      value={formData.vin}
                      onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                      placeholder="LVSHCAMB1PE123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="battery">Dung lượng pin (kWh)</Label>
                    <Input
                      id="battery"
                      type="number"
                      step="0.1"
                      value={formData.batteryCapacity}
                      onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                      placeholder="87.7"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Thêm xe</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Vehicles List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách xe điện ({vehicles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Chưa có xe điện nào được đăng ký
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  Thêm xe đầu tiên
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Xe</TableHead>
                    <TableHead>Biển số</TableHead>
                    <TableHead>VIN</TableHead>
                    <TableHead>Pin (kWh)</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                          <div className="text-sm text-muted-foreground">Năm {vehicle.year}</div>
                        </div>
                      </TableCell>
                      <TableCell>{vehicle.licensePlate}</TableCell>
                      <TableCell className="font-mono text-sm">{vehicle.vin}</TableCell>
                      <TableCell>{vehicle.batteryCapacity} kWh</TableCell>
                      <TableCell>
                        {vehicle.verified ? (
                          <Badge className="bg-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Đã xác minh
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chờ xác minh</Badge>
                        )}
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
      </div>
    </DashboardLayout>
  );
}
