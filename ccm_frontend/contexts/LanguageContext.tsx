import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const useLanguage = () => useContext(LanguageContext);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Common
    'common.home': 'Home',
    'common.logout': 'Đăng xuất',
    'common.login': 'Đăng nhập',
    'common.register': 'Đăng ký',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.delete': 'Xóa',
    'common.edit': 'Sửa',
    'common.view': 'Xem',
    'common.download': 'Tải xuống',
    'common.upload': 'Tải lên',
    'common.submit': 'Gửi',
    'common.search': 'Tìm kiếm',
    'common.filter': 'Lọc',
    'common.loading': 'Đang tải...',
    'common.error': 'Lỗi',
    'common.success': 'Thành công',

    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Tổng quan',
    'nav.marketplace': 'Thị trường',
    'nav.howItWorks': 'Cách hoạt động',
    'nav.pricing': 'Giá cả',
    'nav.blog': 'Blog',
    'nav.faq': 'Câu hỏi thường gặp',
    'nav.contact': 'Liên hệ',
    'nav.about': 'Về chúng tôi',

    // Footer
    'footer.tagline': 'Kết nối chủ xe điện với người mua tín chỉ carbon',
    'footer.platform': 'Nền tảng',
    'footer.resources': 'Tài nguyên',
    'footer.legal': 'Pháp lý',
    'footer.terms': 'Điều khoản dịch vụ',
    'footer.privacy': 'Chính sách bảo mật',
    'footer.copyright': '© 2025 EV Carbon Market. Bảo lưu mọi quyền.',

    // EV Owner
    'evOwner.dashboard': 'Tổng quan',
    'evOwner.profile': 'Hồ sơ xe & Quản lý',
    'evOwner.tracking': 'Theo dõi Carbon',
    'evOwner.devices': 'Kết nối thiết bị',
    'evOwner.submitEmission': 'Gửi hồ sơ phát thải',
    'evOwner.myRequests': 'Hồ sơ của tôi',
    'evOwner.wallet': 'Ví tín chỉ',
    'evOwner.issuanceHistory': 'Lịch sử phát hành',
    'evOwner.listings': 'Quản lý niêm yết',

    // Buyer
    'buyer.dashboard': 'Tổng quan',
    'buyer.marketplace': 'Thị trường',
    'buyer.cart': 'Giỏ hàng',
    'buyer.auctions': 'Đấu giá',
    'buyer.history': 'Lịch sử mua',

    // CVA
    'cva.dashboard': 'Tổng quan',
    'cva.queue': 'Hồ sơ chờ duyệt',
    'cva.verified': 'Đã xác minh',

    // Admin
    'admin.dashboard': 'Tổng quan',
    'admin.users': 'Quản lý người dùng',
    'admin.credits': 'Quản lý tín chỉ',
    'admin.transactions': 'Giao dịch',
    'admin.reports': 'Báo cáo & Thống kê',
    'admin.settings': 'Cài đặt hệ thống',

    // Roles
    'role.buyer': 'Người Mua',
    'role.evOwner': 'Người Bán',
    'role.cva': 'CVA Kiểm Duyệt',
    'role.admin': 'Quản trị viên',

    // Submit Emission
    'submit.title': 'Gửi hồ sơ phát thải',
    'submit.vehicleInfo': 'Thông Tin Xe Điện',
    'submit.ownerName': 'Tên chủ xe',
    'submit.vehicleBrand': 'Hãng xe',
    'submit.vehicleModel': 'Dòng xe',
    'submit.distance': 'Quãng đường (km)',
    'submit.electricity': 'Điện tiêu thụ (kWh)',
    'submit.carbonSaved': 'CO₂ tiết kiệm được (tCO₂)',
    'submit.saleMethod': 'Phương thức bán',
    'submit.directSale': 'Bán trực tiếp (Giá cố định)',
    'submit.auction': 'Đấu giá',
    'submit.price': 'Giá bán cố định (VNĐ/tCO₂)',
    'submit.auctionPrice': 'Giá khởi điểm đấu giá (VNĐ/tCO₂)',
    'submit.evidence': 'File minh chứng',
    'submit.submitButton': 'Gửi Hồ Sơ',
  },
  en: {
    // Common
    'common.home': 'Home',
    'common.logout': 'Logout',
    'common.login': 'Login',
    'common.register': 'Register',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.download': 'Download',
    'common.upload': 'Upload',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.marketplace': 'Marketplace',
    'nav.howItWorks': 'How It Works',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Blog',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'nav.about': 'About Us',

    // EV Owner
    'evOwner.dashboard': 'Dashboard',
    'evOwner.profile': 'EV Profile & Management',
    'evOwner.tracking': 'Carbon Tracking',
    'evOwner.devices': 'Device Integration',
    'evOwner.submitEmission': 'Submit Emission',
    'evOwner.myRequests': 'My Requests',
    'evOwner.wallet': 'Credit Wallet',
    'evOwner.issuanceHistory': 'Issuance History',
    'evOwner.listings': 'Listings Management',

    // Buyer
    'buyer.dashboard': 'Dashboard',
    'buyer.marketplace': 'Marketplace',
    'buyer.cart': 'Shopping Cart',
    'buyer.auctions': 'Auctions',
    'buyer.history': 'Purchase History',

    // CVA
    'cva.dashboard': 'Dashboard',
    'cva.queue': 'Verification Queue',
    'cva.verified': 'Verified Credits',

    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.users': 'User Management',
    'admin.credits': 'Credit Management',
    'admin.transactions': 'Transactions',
    'admin.reports': 'Reports & Analytics',
    'admin.settings': 'System Settings',

    // Roles
    'role.buyer': 'Buyer',
    'role.evOwner': 'EV Owner',
    'role.cva': 'CVA Verifier',
    'role.admin': 'Administrator',

    // Submit Emission
    'submit.title': 'Submit Emission Data',
    'submit.vehicleInfo': 'Electric Vehicle Information',
    'submit.ownerName': 'Owner Name',
    'submit.vehicleBrand': 'Vehicle Brand',
    'submit.vehicleModel': 'Vehicle Model',
    'submit.distance': 'Distance (km)',
    'submit.electricity': 'Electricity Used (kWh)',
    'submit.carbonSaved': 'CO₂ Saved (tCO₂)',
    'submit.saleMethod': 'Sale Method',
    'submit.directSale': 'Direct Sale (Fixed Price)',
    'submit.auction': 'Auction',
    'submit.price': 'Fixed Price (VND/tCO₂)',
    'submit.auctionPrice': 'Starting Bid (VND/tCO₂)',
    'submit.evidence': 'Evidence Files',
    'submit.submitButton': 'Submit',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get from localStorage or default to 'vi'
    const saved = localStorage.getItem('language');
    return (saved === 'vi' || saved === 'en') ? saved : 'vi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}


