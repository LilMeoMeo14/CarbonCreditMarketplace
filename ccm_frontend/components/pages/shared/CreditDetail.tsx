import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
import { ArrowLeft, CheckCircle, ShieldCheck, Leaf, Car, MapPin, FileText, Calendar, Lock, ShoppingCart } from 'lucide-react';
import { useRouter, useAppContext } from '../../../App';
//import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';

export function CreditDetail({ creditId }: { creditId: string }) {
  const { navigate } = useRouter();
  const { credits, addToCart, purchaseCredits } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  
  const credit = credits.find(c => c.id === creditId);
  
  if (!credit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Không tìm thấy tín chỉ</h2>
          <Button onClick={() => navigate('/')}>
            Quay lại Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const availableCredits = credit.projectInfo?.availableCredits || 0;
  const pricePerCredit = credit.price;
  const subtotal = pricePerCredit * quantity;
  const platformFee = subtotal * 0.05;
  const totalPrice = subtotal + platformFee;

  const handleAddToCart = () => {
    const result = addToCart(credit.id, quantity);
    if (result?.success === false) {
      toast.error(result.message);
    } else {
      toast.success(`Đã thêm ${quantity} tín chỉ vào giỏ hàng`);
      navigate('/nguoimua');
    }
  };

  const handleBuyNow = () => {
    const result = purchaseCredits([{ creditId: credit.id, quantity }]);
    if (result.success) {
      toast.success('Mua thành công! Chứng nhận sẽ được gửi qua email.');
      navigate('/nguoimua');
    } else {
      toast.error('Có lỗi xảy ra khi mua tín chỉ');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      setQuantity(1);
    } else if (newQuantity > availableCredits) {
      setQuantity(availableCredits);
      toast.error(`Chỉ còn ${availableCredits} tín chỉ có sẵn`);
    } else {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại Marketplace</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image and Title */}
            <Card>
              <CardContent className="p-0">
                <div className="relative h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-t-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1672542128826-5f0d578713d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt="Dự án xe điện"
                    className="w-full h-full object-cover"
                    onError={(e) => { // Xử lý lỗi đơn giản 
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Ngăn lặp vô hạn
                     target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Ảnh trống 1px
                   }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        <span>{credit.projectInfo?.title || `Dự án xe điện ${credit.region}`}</span>
                      </div>
                      <div className="flex gap-2">
                        {credit.verificationInfo?.organization?.includes('Verra') && (
                          <Badge className="bg-blue-600">Verra</Badge>
                        )}
                        {credit.verificationInfo?.organization?.includes('Gold Standard') && (
                          <Badge className="bg-yellow-600">Gold Standard</Badge>
                        )}
                        {credit.verificationInfo?.organization?.includes('TÜV SÜD') && (
                          <Badge className="bg-purple-600">TÜV SÜD</Badge>
                        )}
                        {credit.verificationInfo?.organization?.includes('SCS Global') && (
                          <Badge className="bg-indigo-600">SCS Global</Badge>
                        )}
                        {credit.verificationInfo?.organization?.includes('ERM CVS') && (
                          <Badge className="bg-teal-600">ERM CVS</Badge>
                        )}
                      </div>
                    </div>
                    <h1 className="text-3xl mb-2">{credit.region} Q{credit.projectInfo?.quarter || '3'}/{credit.projectInfo?.vintage || '2025'}</h1>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Vintage: {credit.projectInfo?.vintage || '2025'}</span>
                      </div>
                      {credit.status === 'verified' && (
                        <div className="flex items-center gap-1 text-green-300">
                          <CheckCircle className="h-4 w-4" />
                          <span>Đã xác minh</span>
                        </div>
                      )}
                      {credit.type === 'auction' && credit.projectInfo?.availableCredits && credit.projectInfo.availableCredits <= 10 && (
                        <Badge className="bg-red-600">Cực hiếm - Chỉ còn {credit.projectInfo.availableCredits}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Section */}
            <Card>
              <CardHeader>
                <CardTitle>Mô tả</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* About Project */}
                <div>
                  <h3 className="mb-3">Về dự án này</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {credit.projectInfo?.description || `Tín chỉ carbon này được tạo ra từ một nhóm ${credit.projectInfo?.evCount || '125'} chủ xe điện tại ${credit.region} trong Quý ${credit.projectInfo?.quarter || '3'} năm ${credit.projectInfo?.vintage || '2025'}. Mỗi ngày, các thành viên trong cộng đồng này di chuyển bằng xe điện, giảm thiểu phát thải CO₂ so với việc sử dụng xe xăng truyền thống.`}
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tổng quãng đường di chuyển:</span>
                      <span className="font-medium">{credit.projectInfo?.totalDistance || credit.distance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lượng CO₂ giảm được:</span>
                      <span className="font-medium text-green-600">{credit.amount} tấn</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Environmental Impact */}
                <div>
                  <h3 className="mb-4">Tác động môi trường</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 mb-1">Giảm phát thải</div>
                      <div className="text-2xl text-green-600">{credit.amount}</div>
                      <div className="text-sm text-gray-600">tấn CO₂</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 mb-1">Quãng đường xanh</div>
                      <div className="text-2xl text-blue-600">{credit.distance.replace(/[^\d,]/g, '')}</div>
                      <div className="text-sm text-gray-600">km</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* About Community */}
                <div>
                  <h3 className="mb-3">Về cộng đồng</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {credit.projectInfo?.communityDescription || `Dự án này được thực hiện bởi một cộng đồng gồm ${credit.projectInfo?.evCount || '125'} chủ xe điện có trách nhiệm tại ${credit.region}. Họ cam kết sử dụng xe điện cho các nhu cầu di chuyển hàng ngày, đóng góp vào việc cải thiện chất lượng không khí và giảm phát thải khí nhà kính tại địa phương.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  Thông tin xác minh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Tiêu chuẩn xác minh</div>
                    <div className="font-medium">{credit.verificationInfo?.standard || 'VCS v4.5'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Tổ chức xác minh</div>
                    <div className="font-medium">{credit.verificationInfo?.organization || 'Carbon Verify Asia (CVA)'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Ngày xác minh</div>
                    <div className="font-medium">{credit.verificationInfo?.date || '15/09/2025'}</div>
                  </div>
                  
                  {credit.verificationInfo?.certifications && (
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Chứng nhận</div>
                      <div className="flex flex-wrap gap-1">
                        {credit.verificationInfo.certifications.map((cert: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {credit.verificationInfo?.accreditation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-900 font-medium mb-1">Công nhận quốc tế</div>
                    <p className="text-sm text-blue-700">{credit.verificationInfo.accreditation}</p>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <div className="text-sm text-gray-600 mb-2">Phương pháp luận</div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {credit.verificationInfo?.methodology || 'Tín chỉ này được tính toán dựa trên phương pháp "Transportation Baseline and Credit" được công nhận bởi VCS. Dữ liệu quãng đường được thu thập tự động qua GPS và được kiểm chứng chéo với dữ liệu của nhà sản xuất xe.'}
                  </p>
                </div>
                
                {credit.verificationInfo?.sdgImpacts && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Đóng góp vào SDGs</div>
                    <div className="flex flex-wrap gap-2">
                      {credit.verificationInfo.sdgImpacts.map((sdg: string, idx: number) => (
                        <Badge key={idx} className="bg-green-600">
                          {sdg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {(credit.verificationInfo?.technicalReview || credit.verificationInfo?.auditors) && (
                  <div className="bg-gray-50 border rounded-lg p-3 space-y-2">
                    {credit.verificationInfo.technicalReview && (
                      <div>
                        <div className="text-xs text-gray-600">Technical Review</div>
                        <div className="text-sm">{credit.verificationInfo.technicalReview}</div>
                      </div>
                    )}
                    {credit.verificationInfo.auditors && (
                      <div>
                        <div className="text-xs text-gray-600">Lead Auditor</div>
                        <div className="text-sm">{credit.verificationInfo.auditors}</div>
                      </div>
                    )}
                    {credit.verificationInfo.assuranceLevel && (
                      <div>
                        <div className="text-xs text-gray-600">Assurance Level</div>
                        <div className="text-sm font-medium">{credit.verificationInfo.assuranceLevel}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ledger Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Thông tin sổ cái
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Năm phát hành (Vintage)</div>
                    <div className="font-medium">{credit.ledgerInfo?.vintage || credit.projectInfo?.vintage || '2025'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">ID Dự án</div>
                    <div className="font-medium font-mono text-sm">{credit.ledgerInfo?.projectId || `EV-${credit.region.substring(0, 2).toUpperCase()}-2025-Q3-${credit.id}`}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-600 mb-1">Số sê-ri (Serial Numbers)</div>
                    <div className="font-medium font-mono text-sm bg-gray-50 p-2 rounded">
                      {credit.ledgerInfo?.serialNumbers || `VN-VCS-2025-EV-${credit.id.padStart(6, '0')}-001 đến VN-VCS-2025-EV-${credit.id.padStart(6, '0')}-${Math.floor(credit.amount * 100)}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Trạng thái</div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {credit.ledgerInfo?.status || 'Đang giao dịch'}
                    </Badge>
                  </div>
                </div>
                
                {(credit.ledgerInfo?.registryUrl || credit.ledgerInfo?.blockchainHash) && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    {credit.ledgerInfo.registryUrl && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Registry Link</div>
                        <a 
                          href={credit.ledgerInfo.registryUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Lock className="h-3 w-3" />
                          {credit.ledgerInfo.registryUrl}
                        </a>
                      </div>
                    )}
                    {credit.ledgerInfo.blockchainHash && (
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Blockchain Verification</div>
                        <div className="font-mono text-xs bg-gray-50 p-2 rounded border">
                          {credit.ledgerInfo.blockchainHash}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Purchase Panel - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card>
                <CardHeader>
                  <div className="text-center">
                    <div className="text-3xl text-green-600 mb-1">
                      {formatPrice(credit.price)}
                    </div>
                    <div className="text-sm text-gray-600">/tín chỉ</div>
                    <div className="text-sm text-gray-600 mt-2">
                      {credit.projectInfo?.availableCredits || Math.floor(credit.amount * 100)} tín chỉ có sẵn
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Quantity Selector */}
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">
                      Số lượng muốn mua
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max={availableCredits}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                      className="text-center"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tối đa: {availableCredits} tín chỉ
                    </p>
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đơn giá × {quantity}</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí nền tảng (5%)</span>
                      <span className="font-medium">{formatPrice(platformFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Tổng cộng</span>
                      <span className="font-medium text-green-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {availableCredits > 0 ? (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleBuyNow}
                      >
                        Mua ngay
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Thêm vào giỏ hàng
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">Đã hết tín chỉ</p>
                    </div>
                  )}

                  <Separator />

                  {/* Trust Badges */}
                  <div className="space-y-3 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Thanh toán an toàn & mã hóa</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Đã xác minh bởi tổ chức độc lập</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Chứng nhận retire sau khi mua</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
