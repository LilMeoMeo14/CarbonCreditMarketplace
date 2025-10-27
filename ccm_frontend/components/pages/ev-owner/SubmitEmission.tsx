import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { useRouter } from '../../../contexts/RouterContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Upload, FileText, AlertCircle, Info, TrendingUp, CheckCircle2, Clock, Award } from 'lucide-react';
import { Alert, AlertDescription } from '../../ui/alert';
import { toast } from 'sonner';
import { Badge } from '../../ui/badge';

export function SubmitEmission() {
  const { addCredit, user } = useAppContext();
  const { navigateTo } = useRouter();
  const [formData, setFormData] = React.useState({
    ownerName: '',
    vehicleBrand: '',
    vehicleModel: '',
    distance: '',
    electricityUsed: '',
    carbonSaved: '',
    region: '',
    quarter: '',
    year: '2025',
    emissionFactor: '',
    additionalNotes: '',
    evidence: [] as string[],
    saleMethod: 'direct', // 'direct' or 'auction'
    directPrice: '',
    auctionStartPrice: '',
  });

  // Auto-calculate carbon saved
  React.useEffect(() => {
    if (formData.distance && formData.electricityUsed) {
      // Formula: distance * 0.12 (kg CO2/km baseline) - electricity * 0.5 (kg CO2/kWh)
      const distance = parseFloat(formData.distance);
      const electricity = parseFloat(formData.electricityUsed);
      const baselineEmission = distance * 0.12; // Xe xăng
      const evEmission = electricity * 0.5; // Grid emission factor
      const carbonSaved = (baselineEmission - evEmission) / 1000; // Convert to tCO2
      setFormData(prev => ({ 
        ...prev, 
        carbonSaved: carbonSaved > 0 ? carbonSaved.toFixed(2) : '0'
      }));
    }
  }, [formData.distance, formData.electricityUsed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const carbonAmount = parseFloat(formData.carbonSaved);
    
    const newCredit = {
      ownerId: user?.id,
      ownerName: formData.ownerName,
      ownerEmail: user?.email,
      vehicle: `${formData.vehicleBrand} ${formData.vehicleModel}`,
      distance: `${formData.distance} km`,
      electricityUsed: `${formData.electricityUsed} kWh`,
      amount: carbonAmount,
      region: formData.region,
      quarter: formData.quarter,
      year: formData.year,
      evidence: formData.evidence,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      additionalNotes: formData.additionalNotes,
      type: formData.saleMethod, // 'direct' or 'auction'
      price: formData.saleMethod === 'direct' ? parseFloat(formData.directPrice) : parseFloat(formData.auctionStartPrice),
      currentBid: formData.saleMethod === 'auction' ? parseFloat(formData.auctionStartPrice) : undefined,
      projectInfo: {
        title: `Tín chỉ Carbon ${formData.region} Q${formData.quarter}/${formData.year}`,
        quarter: formData.quarter,
        vintage: formData.year,
        evCount: 1,
        totalDistance: formData.distance + ' km',
        description: formData.additionalNotes,
        communityDescription: `Xe ${formData.vehicleBrand} ${formData.vehicleModel} được sử dụng tại ${formData.region}.`,
        availableCredits: carbonAmount
      }
    };

    addCredit(newCredit);
    toast.success('✅ Đã gửi hồ sơ phát thải thành công! CVA sẽ xem xét trong vòng 2-3 ngày làm việc.');
    
    // Reset form
    setFormData({
      ownerName: '',
      vehicleBrand: '',
      vehicleModel: '',
      distance: '',
      electricityUsed: '',
      carbonSaved: '',
      region: '',
      quarter: '',
      year: '2025',
      emissionFactor: '',
      additionalNotes: '',
      evidence: [],
      saleMethod: 'direct',
      directPrice: '',
      auctionStartPrice: '',
    });
    
    navigateTo('/ev-owner/my-requests');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setFormData({ ...formData, evidence: [...formData.evidence, ...fileNames] });
      toast.success(`📎 Đã tải lên ${files.length} file`);
    }
  };

  const estimatedValue = parseFloat(formData.carbonSaved || '0') * 30000; // 30,000 VND/tCO2 average

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1>Gửi hồ sơ phát thải</h1>
          <p className="text-muted-foreground mt-2">
            Điền thông tin phát thải carbon từ việc sử dụng xe điện của bạn để được cấp tín chỉ carbon
          </p>
        </div>

        <Alert className="border-primary/50 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Lưu ý quan trọng:</strong> Tín chỉ carbon sẽ được tính dựa trên quãng đường di chuyển và lượng điện tiêu thụ. 
            Vui lòng cung cấp đầy đủ file minh chứng (ảnh công tơ điện, hóa đơn tiền điện, video hành trình).
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin xe điện */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Xe Điện</CardTitle>
                  <CardDescription>Điền đầy đủ thông tin về xe và quãng đường di chuyển</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ownerName">Tên chủ xe <span className="text-destructive">*</span></Label>
                    <Input
                      id="ownerName"
                      placeholder="Nhập tên đầy đủ"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicleBrand">Hãng xe <span className="text-destructive">*</span></Label>
                      <Select value={formData.vehicleBrand} onValueChange={(value) => setFormData({ ...formData, vehicleBrand: value })}>
                        <SelectTrigger id="vehicleBrand">
                          <SelectValue placeholder="Chọn hãng xe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VinFast">VinFast</SelectItem>
                          <SelectItem value="Tesla">Tesla</SelectItem>
                          <SelectItem value="Hyundai">Hyundai</SelectItem>
                          <SelectItem value="Kia">Kia</SelectItem>
                          <SelectItem value="BMW">BMW</SelectItem>
                          <SelectItem value="Mercedes">Mercedes</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="vehicleModel">Dòng xe <span className="text-destructive">*</span></Label>
                      <Input
                        id="vehicleModel"
                        placeholder="VD: VF8, Model 3, Kona Electric..."
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="distance">Quãng đường (km) <span className="text-destructive">*</span></Label>
                      <Input
                        id="distance"
                        type="number"
                        placeholder="2500"
                        value={formData.distance}
                        onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="electricity">Điện tiêu thụ (kWh) <span className="text-destructive">*</span></Label>
                      <Input
                        id="electricity"
                        type="number"
                        placeholder="375"
                        value={formData.electricityUsed}
                        onChange={(e) => setFormData({ ...formData, electricityUsed: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="carbonSaved">CO₂ tiết kiệm được (tCO₂) <span className="text-destructive">*</span></Label>
                    <Input
                      id="carbonSaved"
                      type="number"
                      value={formData.carbonSaved}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      ✓ Sẽ được tính tự động
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="region">Khu vực <span className="text-destructive">*</span></Label>
                      <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                        <SelectTrigger id="region">
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                          <SelectItem value="TP.HCM">TP.HCM</SelectItem>
                          <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                          <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                          <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quarter">Quý <span className="text-destructive">*</span></Label>
                      <Select value={formData.quarter} onValueChange={(value) => setFormData({ ...formData, quarter: value })}>
                        <SelectTrigger id="quarter">
                          <SelectValue placeholder="Chọn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Q1</SelectItem>
                          <SelectItem value="2">Q2</SelectItem>
                          <SelectItem value="3">Q3</SelectItem>
                          <SelectItem value="4">Q4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="year">Năm <span className="text-destructive">*</span></Label>
                      <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                        <SelectTrigger id="year">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="emissionFactor">Hệ số phát thải (kgCO₂/kWh)</Label>
                    <Input
                      id="emissionFactor"
                      type="number"
                      step="0.01"
                      placeholder="0.5"
                      value={formData.emissionFactor}
                      onChange={(e) => setFormData({ ...formData, emissionFactor: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Được tính dựa trên so sánh với xe xăng tương đương
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="notes">Ghi chú thêm</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      placeholder="Thông tin thêm về việc sử dụng xe, lộ trình thường đi..."
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sale Method & Pricing */}
              <Card className="border-2 border-primary/30">
                <CardHeader>
                  <CardTitle>Phương thức bán & Định giá</CardTitle>
                  <CardDescription>Chọn cách bạn muốn bán tín chỉ carbon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Phương thức bán <span className="text-destructive">*</span></Label>
                    <Select value={formData.saleMethod} onValueChange={(value) => setFormData({ ...formData, saleMethod: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">
                          <div className="flex items-center gap-2">
                            <span>💰</span>
                            <div>
                              <div className="font-medium">Bán trực tiếp (Giá cố định)</div>
                              <div className="text-xs text-muted-foreground">Người mua sẽ mua ngay với giá bạn đặt</div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="auction">
                          <div className="flex items-center gap-2">
                            <span>🔥</span>
                            <div>
                              <div className="font-medium">Đấu giá</div>
                              <div className="text-xs text-muted-foreground">Để người mua cạnh tranh, có thể bán giá cao hơn</div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.saleMethod === 'direct' && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <Label htmlFor="directPrice">Giá bán cố định (VNĐ/tCO₂) <span className="text-destructive">*</span></Label>
                      <Input
                        id="directPrice"
                        type="number"
                        placeholder="VD: 85000"
                        value={formData.directPrice}
                        onChange={(e) => setFormData({ ...formData, directPrice: e.target.value })}
                        required
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        💡 Giá thị trường: 25,000 - 35,000 VNĐ/tCO₂. Đề xuất: {(30000).toLocaleString('vi-VN')} VNĐ
                      </p>
                      {formData.directPrice && formData.carbonSaved && (
                        <div className="mt-3 p-2 bg-white rounded border border-green-300">
                          <div className="text-sm font-medium">Tổng giá trị ước tính:</div>
                          <div className="text-xl font-bold text-green-700">
                            {(parseFloat(formData.directPrice) * parseFloat(formData.carbonSaved)).toLocaleString('vi-VN')} VNĐ
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ({formData.carbonSaved} tCO₂ × {parseFloat(formData.directPrice).toLocaleString('vi-VN')} VNĐ)
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.saleMethod === 'auction' && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-300">
                      <Label htmlFor="auctionStartPrice">Giá khởi điểm đấu giá (VNĐ/tCO₂) <span className="text-destructive">*</span></Label>
                      <Input
                        id="auctionStartPrice"
                        type="number"
                        placeholder="VD: 70000"
                        value={formData.auctionStartPrice}
                        onChange={(e) => setFormData({ ...formData, auctionStartPrice: e.target.value })}
                        required
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        🔥 Giá khởi điểm nên thấp hơn giá thị trường để thu hút người mua. Đề xuất: {(25000).toLocaleString('vi-VN')} VNĐ
                      </p>
                      {formData.auctionStartPrice && formData.carbonSaved && (
                        <div className="mt-3 p-2 bg-white rounded border border-orange-300">
                          <div className="text-sm font-medium">Giá khởi điểm tổng:</div>
                          <div className="text-xl font-bold text-orange-700">
                            {(parseFloat(formData.auctionStartPrice) * parseFloat(formData.carbonSaved)).toLocaleString('vi-VN')} VNĐ
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            ✓ Có thể bán cao hơn khi người mua đấu giá
                          </div>
                        </div>
                      )}
                      <div className="mt-3 text-xs bg-white p-2 rounded border border-orange-200">
                        <strong>Lưu ý:</strong> Đấu giá sẽ kéo dài 7 ngày sau khi CVA xác minh
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* File minh chứng */}
              <Card>
                <CardHeader>
                  <CardTitle>File minh chứng</CardTitle>
                  <CardDescription>
                    Tải lên các file chứng minh quãng đường và điện tiêu thụ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <div className="mb-2">
                      <Label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-primary hover:underline">Kéo thả file hoặc chọn file</span>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        accept="image/*,application/pdf,video/*"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hỗ trợ: JPG, PNG, PDF, MP4 (tối đa 10MB mỗi file)
                    </p>
                  </div>

                  {formData.evidence.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label>File đã tải lên ({formData.evidence.length}):</Label>
                      <div className="space-y-2">
                        {formData.evidence.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm flex-1">{file}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newEvidence = formData.evidence.filter((_, i) => i !== index);
                                setFormData({ ...formData, evidence: newEvidence });
                              }}
                              className="text-destructive hover:underline text-sm"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Ảnh công tơ điện
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Hóa đơn tiền điện
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Video hành trình
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" size="lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Gửi Hồ Sơ
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigateTo('/ev-owner/dashboard')}
                  size="lg"
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quy trình xác minh */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quy Trình Xác Minh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="w-0.5 h-12 bg-border mt-2"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-medium">Gửi hồ sơ</h4>
                    <p className="text-sm text-muted-foreground">Upload dữ liệu và minh chứng</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="w-0.5 h-12 bg-border mt-2"></div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-medium">CVA xác minh</h4>
                    <p className="text-sm text-muted-foreground">2-3 ngày làm việc</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h4 className="font-medium">Cấp tín chỉ</h4>
                    <p className="text-sm text-muted-foreground">Niêm yết trên marketplace</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ước tính giá trị */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Ước Tính Giá Trị
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá thị trường trung bình:</span>
                  <span className="font-medium">25,000 - 35,000 VNĐ/tCO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí CVA (5%):</span>
                  <span className="font-medium">~1,500 VNĐ/tCO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí nền tảng (3%):</span>
                  <span className="font-medium">~900 VNĐ/tCO₂</span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium">Thực nhận:</span>
                  <span className="font-bold text-primary text-base">~22,600 - 32,600 VNĐ/tCO₂</span>
                </div>
                {formData.carbonSaved && (
                  <div className="bg-primary/20 p-3 rounded-lg mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Dự kiến thu nhập của bạn:</div>
                    <div className="text-xl font-bold text-primary">
                      {(estimatedValue * 0.92).toLocaleString('vi-VN')} VNĐ
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ({formData.carbonSaved} tCO₂ × ~30,000 VNĐ × 92%)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hỗ trợ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hỗ Trợ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <div>
                    <div className="font-medium">Hotline: 1900-1234</div>
                    <div className="text-xs text-muted-foreground">8:00 - 20:00 hàng ngày</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <div>
                    <div className="font-medium">Email: seller@carbonmarketplace.vn</div>
                    <div className="text-xs text-muted-foreground">Phản hồi trong 24h</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <div>
                    <div className="font-medium">Chat trực tuyến 24/7</div>
                    <div className="text-xs text-muted-foreground">Hỗ trợ ngay lập tức</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
