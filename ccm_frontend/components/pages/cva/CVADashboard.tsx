import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Separator } from '../../ui/separator';
import { ArrowLeft, Eye, Check, X, FileText, Image, Video, AlertCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from '../../../contexts/RouterContext';
import { useAppContext } from '../../../contexts/AppContext';
import { toast } from 'sonner';

export function CVADashboard() {
  const { navigate } = useRouter();
  const { pendingCredits, verifiedCredits, updateCredit, publishCredit } = useAppContext();
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  
  // Verification form data
  const [verificationData, setVerificationData] = useState({
    cvaOrganization: '',
    standard: '',
    methodology: '',
    certifications: '',
    accreditation: '',
    projectTitle: '',
    evCount: '',
    communityDescription: '',
    technicalReview: '',
    additionalNotes: ''
  });

  const cvaOrganizations = [
    { 
      value: 'verra', 
      label: 'Verra - Verified Carbon Standard',
      standard: 'VCS v4.5 (Verified Carbon Standard)',
      certifications: 'ISO 14065, ISO 17029',
      accreditation: 'Được công nhận bởi UNFCCC và ICAO CORSIA'
    },
    { 
      value: 'gold-standard', 
      label: 'Gold Standard Foundation',
      standard: 'Gold Standard for Global Goals',
      certifications: 'ISO 14065, ISO 14064-3, CDM Executive Board',
      accreditation: 'Công nhận bởi UNFCCC, ICAO CORSIA, và hơn 80 chính phủ toàn cầu'
    },
    { 
      value: 'tuv-sud', 
      label: 'TÜV SÜD - Germany',
      standard: 'VCS v4.5 + ISO 14064-2',
      certifications: 'ISO 14065, ISO 17029, DAkkS Accredited',
      accreditation: 'Được công nhận bởi UNFCCC CDM, European Emissions Trading System (EU ETS)'
    },
    { 
      value: 'scs-global', 
      label: 'SCS Global Services',
      standard: 'VCS v4.5 + CAR (Climate Action Reserve)',
      certifications: 'ISO 14065, ISO 17029, ANSI Accredited',
      accreditation: 'Được công nhận bởi California Air Resources Board (CARB), ICAO CORSIA'
    },
    { 
      value: 'erm-cvs', 
      label: 'ERM Certification and Verification Services',
      standard: 'VCS v4.5 + CCB Standards',
      certifications: 'ISO 14065 Accredited, UKAS Accredited, ANAB Accredited',
      accreditation: 'Được công nhận bởi UNFCCC, ICAO CORSIA, California ARB, UK ETS'
    },
    { 
      value: 'gcv', 
      label: 'Green Cert Vietnam (GCV)',
      standard: 'VCS v4.5',
      certifications: 'ISO 14065',
      accreditation: 'Tổ chức xác minh carbon Việt Nam'
    },
    { 
      value: 'cva', 
      label: 'Carbon Verify Asia (CVA)',
      standard: 'VCS v4.5',
      certifications: 'ISO 14065',
      accreditation: 'Tổ chức xác minh carbon độc lập tại Việt Nam'
    },
    { 
      value: 'vccb', 
      label: 'Vietnam Carbon Credit Bureau (VCCB)',
      standard: 'VCS v4.5',
      certifications: 'ISO 14065',
      accreditation: 'Văn phòng tín chỉ carbon Việt Nam'
    }
  ];

  const handleOrgChange = (value: string) => {
    const org = cvaOrganizations.find(o => o.value === value);
    if (org) {
      setVerificationData(prev => ({
        ...prev,
        cvaOrganization: value,
        standard: org.standard,
        certifications: org.certifications,
        accreditation: org.accreditation
      }));
    }
  };

  const handleVerificationInputChange = (field: string, value: string) => {
    setVerificationData(prev => ({ ...prev, [field]: value }));
  };

  const handleApprove = () => {
    if (!verificationData.cvaOrganization) {
      toast.error('Vui lòng chọn tổ chức CVA xác minh');
      return;
    }

    if (!verificationData.projectTitle || !verificationData.evCount || !verificationData.methodology) {
      toast.error('Vui lòng điền đầy đủ thông tin xác minh');
      return;
    }

    const selectedOrg = cvaOrganizations.find(o => o.value === verificationData.cvaOrganization);
    const creditId = selectedCredit.id;
    const timestamp = Date.now();
    const projectIdPrefix = verificationData.cvaOrganization === 'verra' ? 'VCS' : 
                           verificationData.cvaOrganization === 'gold-standard' ? 'GS' :
                           verificationData.cvaOrganization === 'scs-global' ? 'SCS-VCS-CAR' :
                           verificationData.cvaOrganization === 'erm-cvs' ? 'ERM-VCS-CCB' :
                           'VN-VCS';

    const serialPrefix = verificationData.cvaOrganization === 'gold-standard' ? 'GS-VN-EV' :
                        verificationData.cvaOrganization === 'scs-global' ? 'SCS-VN-EV' :
                        verificationData.cvaOrganization === 'erm-cvs' ? 'ERM-VCS-CCB' :
                        'VN-VCS';

    const availableCredits = Math.floor(selectedCredit.amount * 10); // Convert tCO2 to credits

    const updates = {
      status: 'verified',
      reviewedAt: new Date().toISOString().split('T')[0],
      reviewedBy: `${selectedOrg.label} - CVA Reviewer`,
      certificateId: `CERT-${timestamp}-${creditId}`,
      verificationNotes: reviewNotes || 'Hồ sơ đầy đủ, dữ liệu chính xác',
      createdAt: new Date().toISOString().split('T')[0],
      postedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      projectInfo: {
        title: verificationData.projectTitle,
        quarter: selectedCredit.quarter || '3',
        vintage: selectedCredit.year || '2025',
        evCount: parseInt(verificationData.evCount),
        totalDistance: selectedCredit.distance,
        description: verificationData.additionalNotes || `Dự án xe điện được xác minh bởi ${selectedOrg.label}`,
        communityDescription: verificationData.communityDescription || 'Cộng đồng xe điện cam kết sử dụng năng lượng sạch và giảm thiểu khí thải.',
        availableCredits: availableCredits
      },
      verificationInfo: {
        standard: verificationData.standard,
        organization: selectedOrg.label,
        certifications: verificationData.certifications.split(',').map(c => c.trim()),
        accreditation: verificationData.accreditation,
        date: new Date().toISOString().split('T')[0].split('-').reverse().join('/'),
        methodology: verificationData.methodology,
        ...(verificationData.technicalReview && { technicalReview: verificationData.technicalReview })
      },
      ledgerInfo: {
        vintage: selectedCredit.year || '2025',
        serialNumbers: `${serialPrefix}-${selectedCredit.year || '2025'}-${creditId.padStart(6, '0')}-001 đến ${serialPrefix}-${selectedCredit.year || '2025'}-${creditId.padStart(6, '0')}-${availableCredits.toString().padStart(3, '0')}`,
        projectId: `${projectIdPrefix}-${selectedCredit.region?.substring(0, 2).toUpperCase() || 'VN'}-${selectedCredit.year || '2025'}-Q${selectedCredit.quarter || '3'}-${creditId}`,
        status: 'Đang giao dịch',
        ...(verificationData.cvaOrganization === 'verra' && { registryUrl: 'https://registry.verra.org' }),
        ...(verificationData.cvaOrganization === 'gold-standard' && { registryUrl: 'https://registry.goldstandard.org' }),
        ...(verificationData.cvaOrganization === 'scs-global' && { registryUrl: 'https://www.scsglobalservices.com' }),
        ...(verificationData.cvaOrganization === 'erm-cvs' && { registryUrl: 'https://www.vcsprojectdatabase.org' })
      }
    };
    
    updateCredit(creditId, updates);
    toast.success('Đã phê duyệt tín chỉ carbon thành công!');
    
    // Reset form
    setSelectedCredit(null);
    setReviewNotes('');
    setShowVerificationForm(false);
    setVerificationData({
      cvaOrganization: '',
      standard: '',
      methodology: '',
      certifications: '',
      accreditation: '',
      projectTitle: '',
      evCount: '',
      communityDescription: '',
      technicalReview: '',
      additionalNotes: ''
    });
  };

  const handleReject = (creditId) => {
    if (!reviewNotes) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    const updates = {
      status: 'rejected',
      reviewedAt: new Date().toISOString().split('T')[0],
      reviewedBy: 'CVA Reviewer',
      rejectionReason: reviewNotes
    };
    
    updateCredit(creditId, updates);
    toast.success('Đã từ chối hồ sơ. Email thông báo sẽ được gửi cho chủ xe.');
    setSelectedCredit(null);
    setReviewNotes('');
    setShowVerificationForm(false);
  };

  const calculateCO2Savings = (distance, electricityUsed) => {
    const dist = parseFloat(distance) || 2100;
    const elec = parseFloat(electricityUsed) || 315;
    const gasolineEmission = (dist / 100) * 8 * 2.3; // kg CO2
    const electricEmission = elec * 0.5; // kg CO2
    const savings = (gasolineEmission - electricEmission) / 1000; // tCO2
    return savings.toFixed(2);
  };

  const handlePublishCredit = (creditId) => {
    publishCredit(creditId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-primary to-accent text-white shadow-lg border-b-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 mr-4 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Quay lại</span>
              </Button>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6" />
                <h1 className="text-xl font-bold">CVA Dashboard</h1>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>Carbon Verification Authority</span>
              </div>
              <div className="text-blue-200">Cơ quan xác minh carbon</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chờ xác minh</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingCredits.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã xác minh</p>
                  <p className="text-2xl font-bold text-green-600">{verifiedCredits.length}</p>
                </div>
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng CO₂ xác minh</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(verifiedCredits.reduce((sum, c) => sum + c.amount, 0) + 
                      pendingCredits.reduce((sum, c) => sum + parseFloat(calculateCO2Savings(2500, 375)), 0)).toFixed(1)} tCO₂
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hiệu suất xác minh</p>
                  <p className="text-2xl font-bold text-purple-600">95%</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Chờ xác minh ({pendingCredits.length})</TabsTrigger>
            <TabsTrigger value="verified">Đã xác minh ({verifiedCredits.length})</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          </TabsList>

          {/* Pending Reviews */}
          <TabsContent value="pending" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* List of Pending Credits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hồ sơ chờ xác minh</h3>
                {pendingCredits.map((credit) => (
                  <Card 
                    key={credit.id} 
                    className={`cursor-pointer transition-all ${
                      selectedCredit?.id === credit.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      setSelectedCredit(credit);
                      setShowVerificationForm(false);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">{credit.ownerName}</div>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Chờ xác minh
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>📧 {credit.ownerEmail || 'Chưa có email'}</div>
                        <div>Xe: {credit.vehicle}</div>
                        <div>Quãng đường: {credit.distance}</div>
                        <div>Khu vực: {credit.region}</div>
                        <div>Quý {credit.quarter}/{credit.year}</div>
                        <div>Ngày gửi: {credit.submittedAt}</div>
                        <div>CO₂ ước tính: {calculateCO2Savings(credit.distance, credit.electricityUsed)} tCO₂</div>
                      </div>
                      <div className="mt-3 flex items-center space-x-2 text-sm">
                        <Image className="h-4 w-4 text-gray-400" />
                        <Video className="h-4 w-4 text-gray-400" />
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-500">{credit.evidence.length} tài liệu</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {pendingCredits.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      Không có hồ sơ nào chờ xác minh
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Detail Review Panel */}
              <div className="space-y-4">
                {selectedCredit ? (
                  <>
                    {/* Basic Info Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Chi tiết hồ sơ - {selectedCredit.ownerName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Chủ xe:</div>
                            <div className="font-medium">{selectedCredit.ownerName}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Email liên hệ:</div>
                            <div className="font-medium text-blue-600">{selectedCredit.ownerEmail || 'Chưa cung cấp'}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Loại xe:</div>
                            <div className="font-medium">{selectedCredit.vehicle}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Quãng đường:</div>
                            <div className="font-medium">{selectedCredit.distance}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Khu vực:</div>
                            <div className="font-medium">{selectedCredit.region}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Thời gian:</div>
                            <div className="font-medium">Q{selectedCredit.quarter}/{selectedCredit.year}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-gray-600">CO₂ giảm phát thải:</div>
                            <div className="font-medium text-green-600">
                              {calculateCO2Savings(selectedCredit.distance, selectedCredit.electricityUsed)} tCO₂
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <div className="text-sm text-gray-600 mb-2 font-medium">📎 Minh chứng đã tải lên:</div>
                          <div className="space-y-2">
                            {selectedCredit.evidence.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-3 flex-1">
                                  {file.includes('jpg') || file.includes('png') ? (
                                    <Image className="h-5 w-5 text-blue-600" />
                                  ) : file.includes('mp4') ? (
                                    <Video className="h-5 w-5 text-purple-600" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-gray-600" />
                                  )}
                                  <div className="flex-1">
                                    <div className="text-sm font-medium">{file}</div>
                                    <div className="text-xs text-gray-500">
                                      {file.includes('jpg') || file.includes('png') ? 'Hình ảnh' : 
                                       file.includes('mp4') ? 'Video' : 
                                       file.includes('pdf') ? 'Tài liệu PDF' : 'File'}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => toast.info(`Đang mở file: ${file}`)}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    Xem
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => toast.success(`Đã tải xuống: ${file}`)}
                                  >
                                    📥 Tải
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Pricing & Sale Method Info */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-200">
                          <div className="text-sm font-medium text-gray-700 mb-3">💰 Thông tin định giá từ người bán:</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-gray-600">Phương thức bán:</div>
                              <div className="font-bold text-lg">
                                {selectedCredit.type === 'direct' ? (
                                  <span className="text-green-700">💵 Bán trực tiếp</span>
                                ) : (
                                  <span className="text-orange-700">🔥 Đấu giá</span>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">
                                {selectedCredit.type === 'direct' ? 'Giá bán cố định:' : 'Giá khởi điểm:'}
                              </div>
                              <div className="font-bold text-lg text-green-700">
                                {(selectedCredit.price || 0).toLocaleString('vi-VN')} ₫/tCO₂
                              </div>
                            </div>
                          </div>
                          {selectedCredit.type === 'direct' && selectedCredit.amount && (
                            <div className="mt-3 pt-3 border-t border-green-300">
                              <div className="text-xs text-gray-600">Tổng giá trị ước tính:</div>
                              <div className="text-xl font-bold text-green-800">
                                {((selectedCredit.price || 0) * (selectedCredit.amount || 0)).toLocaleString('vi-VN')} ₫
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                ({selectedCredit.amount} tCO₂ × {(selectedCredit.price || 0).toLocaleString('vi-VN')} ₫)
                              </div>
                            </div>
                          )}
                        </div>

                        {!showVerificationForm && (
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => setShowVerificationForm(true)}
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Bắt đầu xác minh
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    {/* Verification Form */}
                    {showVerificationForm && (
                      <Card className="border-2 border-blue-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-blue-600">
                            <ShieldCheck className="h-5 w-5" />
                            Form Xác Minh Tín Chỉ
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* CVA Organization Selection */}
                          <div>
                            <Label htmlFor="cvaOrg">Tổ chức CVA xác minh *</Label>
                            <Select value={verificationData.cvaOrganization} onValueChange={handleOrgChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn tổ chức CVA" />
                              </SelectTrigger>
                              <SelectContent>
                                {cvaOrganizations.map(org => (
                                  <SelectItem key={org.value} value={org.value}>
                                    {org.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {verificationData.cvaOrganization && (
                            <>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm space-y-1">
                                <div><strong>Standard:</strong> {verificationData.standard}</div>
                                <div><strong>Certifications:</strong> {verificationData.certifications}</div>
                                <div><strong>Accreditation:</strong> {verificationData.accreditation}</div>
                              </div>

                              <Separator />

                              <div>
                                <Label htmlFor="projectTitle">Tên dự án *</Label>
                                <Input
                                  id="projectTitle"
                                  value={verificationData.projectTitle}
                                  onChange={(e) => handleVerificationInputChange('projectTitle', e.target.value)}
                                  placeholder="VD: Dự án xe điện cộng đồng Hà Nội"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="evCount">Số xe điện trong dự án *</Label>
                                  <Input
                                    id="evCount"
                                    type="number"
                                    value={verificationData.evCount}
                                    onChange={(e) => handleVerificationInputChange('evCount', e.target.value)}
                                    placeholder="125"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="methodology">Phương pháp luận *</Label>
                                <Textarea
                                  id="methodology"
                                  value={verificationData.methodology}
                                  onChange={(e) => handleVerificationInputChange('methodology', e.target.value)}
                                  placeholder="Mô tả phương pháp tính toán và xác minh..."
                                  rows={3}
                                />
                              </div>

                              <div>
                                <Label htmlFor="communityDescription">Mô tả cộng đồng</Label>
                                <Textarea
                                  id="communityDescription"
                                  value={verificationData.communityDescription}
                                  onChange={(e) => handleVerificationInputChange('communityDescription', e.target.value)}
                                  placeholder="Mô tả về cộng đồng chủ xe điện..."
                                  rows={2}
                                />
                              </div>

                              <div>
                                <Label htmlFor="technicalReview">Technical Review (tùy chọn)</Label>
                                <Input
                                  id="technicalReview"
                                  value={verificationData.technicalReview}
                                  onChange={(e) => handleVerificationInputChange('technicalReview', e.target.value)}
                                  placeholder="VD: Đã qua technical review bởi..."
                                />
                              </div>

                              <div>
                                <Label htmlFor="additionalNotes">Ghi chú bổ sung</Label>
                                <Textarea
                                  id="additionalNotes"
                                  value={verificationData.additionalNotes}
                                  onChange={(e) => handleVerificationInputChange('additionalNotes', e.target.value)}
                                  placeholder="Ghi chú thêm về dự án..."
                                  rows={2}
                                />
                              </div>

                              <Separator />

                              <div>
                                <Label htmlFor="reviewNotes">Ghi chú xác minh</Label>
                                <Textarea
                                  id="reviewNotes"
                                  placeholder="Nhập ghi chú về quá trình xác minh..."
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  rows={2}
                                />
                              </div>

                              <div className="flex space-x-3 pt-4">
                                <Button 
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                  onClick={handleApprove}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Phê duyệt & Cấp tín chỉ
                                </Button>
                                <Button 
                                  variant="destructive"
                                  className="flex-1"
                                  onClick={() => handleReject(selectedCredit.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Từ chối
                                </Button>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      Chọn một hồ sơ để xem chi tiết
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Verified Credits - Chờ phát hành */}
          <TabsContent value="verified" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    Tín chỉ đã xác minh - Chờ phát hành lên Marketplace
                  </CardTitle>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {verifiedCredits.length} tín chỉ
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verifiedCredits.map((credit) => (
                    <div key={credit.id} className="flex items-start justify-between p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-lg">{credit.ownerName}</div>
                          <Badge className="bg-green-600">✓ Đã xác minh</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          <div>📧 {credit.ownerEmail || 'Chưa có email'}</div>
                          <div>🚗 {credit.vehicle}</div>
                          <div>📊 CO₂: <span className="font-medium text-green-700">{credit.amount || calculateCO2Savings(credit.distance, credit.electricityUsed)} tCO₂</span></div>
                          <div>📍 {credit.region}</div>
                          <div>📅 Quý {credit.quarter}/{credit.year}</div>
                          <div>✅ Xác minh: {credit.reviewedAt}</div>
                        </div>

                        {credit.projectInfo && (
                          <div className="text-sm bg-white p-2 rounded border border-green-200">
                            <div className="font-medium text-green-700">📦 {credit.projectInfo.title}</div>
                            <div className="text-gray-600">Tín chỉ khả dụng: {credit.projectInfo.availableCredits} credits</div>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 bg-white p-2 rounded border">
                          🔖 <span className="font-mono">{credit.certificateId}</span>
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <Button 
                          onClick={() => handlePublishCredit(credit.id)}
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                        >
                          🚀 Xuất phát hành lên Marketplace
                        </Button>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                          Sau khi phát hành, tín chỉ sẽ<br/>xuất hiện trên chợ marketplace
                        </div>
                      </div>
                    </div>
                  ))}

                  {verifiedCredits.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <ShieldCheck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <div className="font-medium">Chưa có tín chỉ nào đã xác minh</div>
                      <div className="text-sm">Tín chỉ sau khi được xác minh sẽ xuất hiện ở đây</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Báo cáo phát hành tín chỉ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Tổng tín chỉ đã cấp:</span>
                      <span className="font-medium">{verifiedCredits.reduce((sum, c) => sum + c.amount, 0).toFixed(1)} tCO₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số chứng nhận:</span>
                      <span className="font-medium">{verifiedCredits.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tỷ lệ phê duyệt:</span>
                      <span className="font-medium text-green-600">95%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống kê theo thời gian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Hôm nay:</span>
                      <span className="font-medium">0 tín chỉ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tuần này:</span>
                      <span className="font-medium">3.8 tCO₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tháng này:</span>
                      <span className="font-medium">9.0 tCO₂</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}