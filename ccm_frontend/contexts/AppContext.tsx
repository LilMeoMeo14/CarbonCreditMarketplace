import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

interface AppContextType {
  credits: any[];
  pendingCredits: any[];
  verifiedCredits: any[];
  users: any[];
  transactions: any[];
  cart: any[];
  currentUser: any;
  user: any; // Alias for currentUser
  addCredit: (credit: any) => void;
  updateCredit: (id: string, updates: any) => void;
  publishCredit: (id: string) => void;
  addTransaction: (transaction: any) => void;
  setCurrentUser: (user: any) => void;
  login: (email: string, password: string) => { success: boolean; user?: any; message?: string };
  logout: () => void;
  register: (userData: any) => { success: boolean; message?: string };
  addToCart: (creditId: string, quantity: number) => any;
  removeFromCart: (creditId: string) => void;
  updateCartQuantity: (creditId: string, quantity: number) => any;
  clearCart: () => void;
  purchaseCredits: (items: any[]) => any;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

// Mock initial data - 3 credits: 2 direct sale, 1 auction
const initialCredits = [
  {
    id: '1',
    ownerId: 'seller1',
    ownerName: 'Nguyễn Văn A',
    ownerEmail: 'seller1@email.com',
    amount: 187.5,
    price: 85000,
    type: 'direct',
    status: 'published',
    vehicle: 'VinFast VF8',
    distance: '3,125 km',
    region: 'Hà Nội',
    quarter: '3',
    year: '2025',
    createdAt: '2025-09-15',
    postedAt: '2025-09-15T08:30:00Z',
    evidence: ['car_meter.jpg', 'electricity_bill.pdf'],
    projectInfo: {
      title: 'Dự án Carbon Xe Điện Hà Nội Q3/2025',
      quarter: '3',
      vintage: '2025',
      evCount: 125,
      totalDistance: '3,125 km',
      description: 'Tín chỉ carbon được tạo ra từ việc sử dụng xe điện thay thế xe xăng, giúp giảm phát thải CO₂.',
      communityDescription: 'Cộng đồng 125 chủ xe điện tại Hà Nội cam kết bảo vệ môi trường.',
      availableCredits: 150.5
    },
    verificationInfo: {
      standard: 'VCS v4.5',
      organization: 'Carbon Verify Asia (CVA)',
      certifications: ['ISO 14065', 'VCS Approved'],
      date: '15/09/2025',
      methodology: 'Transportation Baseline and Credit Method'
    },
    ledgerInfo: {
      vintage: '2025',
      serialNumbers: 'VN-VCS-2025-EV-000001 to VN-VCS-2025-EV-000188',
      projectId: 'EV-HN-2025-Q3-001',
      status: 'Đang giao dịch'
    }
  },
  {
    id: '2',
    ownerId: 'seller2',
    ownerName: 'Trần Thị B',
    ownerEmail: 'seller2@email.com',
    amount: 98.4,
    price: 92000,
    type: 'direct',
    status: 'published',
    vehicle: 'Tesla Model 3',
    distance: '1,640 km',
    region: 'TP.HCM',
    quarter: '2',
    year: '2025',
    createdAt: '2025-07-20',
    postedAt: '2025-07-20T14:15:00Z',
    evidence: ['odometer.jpg', 'charging_records.pdf'],
    projectInfo: {
      title: 'Carbon Credits TP.HCM - Tesla Model 3',
      quarter: '2',
      vintage: '2025',
      evCount: 1,
      totalDistance: '1,640 km',
      description: 'Tín chỉ từ Tesla Model 3 di chuyển hoàn toàn bằng điện tái tạo.',
      communityDescription: 'Xe Tesla Model 3 được sạc bằng điện mặt trời tại gia đình.',
      availableCredits: 98.4
    },
    verificationInfo: {
      standard: 'Gold Standard',
      organization: 'Carbon Verify Asia (CVA)',
      certifications: ['Gold Standard Certified', 'ISO 14064'],
      date: '20/07/2025',
      methodology: 'GHG Protocol for Transportation'
    },
    ledgerInfo: {
      vintage: '2025',
      serialNumbers: 'VN-GS-2025-EV-000189 to VN-GS-2025-EV-000287',
      projectId: 'EV-HCM-2025-Q2-002',
      status: 'Đang giao dịch'
    }
  },
  {
    id: '3',
    ownerId: 'seller3',
    ownerName: 'Lê Minh C',
    ownerEmail: 'seller3@email.com',
    amount: 25.0,
    price: 78000,
    currentBid: 82000,
    type: 'auction',
    status: 'published',
    vehicle: 'VinFast VFe34',
    distance: '417 km',
    region: 'Đà Nẵng',
    quarter: '4',
    year: '2024',
    createdAt: '2024-12-10',
    postedAt: '2024-12-10T09:00:00Z',
    auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now - URGENT!
    bidCount: 18,
    evidence: ['trip_log.pdf', 'vehicle_registration.jpg'],
    projectInfo: {
      title: '🔥 ĐẤU GIÁ: Tín Chỉ Carbon Hiếm - Đà Nẵng Q4/2024',
      quarter: '4',
      vintage: '2024',
      evCount: 1,
      totalDistance: '417 km',
      description: 'Số lượng giới hạn chỉ 25 tCO₂! Tín chỉ carbon chất lượng cao từ VinFast VFe34, đấu giá để có giá tốt nhất.',
      communityDescription: 'Xe VinFast VFe34 được sử dụng cho dịch vụ taxi điện tại Đà Nẵng. SỐ LƯỢNG CỰC KỲ GIỚI HẠN!',
      availableCredits: 25.0
    },
    verificationInfo: {
      standard: 'VCS v4.5',
      organization: 'Carbon Verify Asia (CVA)',
      certifications: ['ISO 14065'],
      date: '10/12/2024',
      methodology: 'CDM AMS-III.C Small-scale'
    },
    ledgerInfo: {
      vintage: '2024',
      serialNumbers: 'VN-VCS-2024-EV-000288 to VN-VCS-2024-EV-000313',
      projectId: 'EV-DN-2024-Q4-003',
      status: 'Đấu giá - Sắp kết thúc!'
    }
  }
];

const initialPendingCredits = [
  {
    id: 'pending1',
    ownerId: 'user3',
    ownerName: 'Lê Văn C',
    ownerEmail: 'levanc@email.com',
    amount: 4.1,
    vehicle: 'Hyundai Kona Electric',
    distance: '2,100 km',
    electricityUsed: '315',
    region: 'Cần Thơ',
    quarter: '1',
    year: '2024',
    submittedAt: '2024-01-25',
    evidence: ['meter_photo.jpg', 'route_video.mp4', 'bill.pdf'],
    status: 'pending'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(initialCredits);
  const [pendingCredits, setPendingCredits] = useState(initialPendingCredits);
  const [verifiedCredits, setVerifiedCredits] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const addCredit = (credit: any) => {
    setPendingCredits(prev => [...prev, { ...credit, id: Date.now().toString(), status: 'pending' }]);
  };

  const updateCredit = (id: string, updates: any) => {
    if (updates.status === 'verified') {
      const credit = pendingCredits.find(c => c.id === id);
      if (credit) {
        setVerifiedCredits(prev => [...prev, { ...credit, ...updates, status: 'verified' }]);
        setPendingCredits(prev => prev.filter(c => c.id !== id));
        toast.success('Tín chỉ đã được xác minh! Vui lòng xuất phát hành để đưa lên marketplace.');
      }
    } else if (updates.status === 'rejected') {
      setPendingCredits(prev => prev.filter(c => c.id !== id));
    }
  };

  const publishCredit = (id: string) => {
    const credit = verifiedCredits.find(c => c.id === id);
    if (credit) {
      setCredits(prev => [...prev, { ...credit, status: 'published' }]);
      setVerifiedCredits(prev => prev.filter(c => c.id !== id));
      toast.success('Tín chỉ đã được phát hành lên marketplace thành công! 🎉');
    }
  };

  const addTransaction = (transaction: any) => {
    setTransactions(prev => [...prev, { ...transaction, id: Date.now().toString(), timestamp: Date.now() }]);
  };

  const addToCart = (creditId: string, quantity: number = 1) => {
    const credit = credits.find(c => c.id === creditId);
    if (!credit) return { success: false, message: 'Không tìm thấy tín chỉ' };

    const availableCredits = credit.projectInfo?.availableCredits || 0;
    const existingItem = cart.find(item => item.creditId === creditId);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

    if (currentQuantityInCart + quantity > availableCredits) {
      return { success: false, message: 'Số lượng vượt quá tín chỉ có sẵn' };
    }

    if (existingItem) {
      setCart(prev => prev.map(item => 
        item.creditId === creditId 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart(prev => [...prev, { creditId, quantity, credit }]);
    }

    return { success: true };
  };

  const removeFromCart = (creditId: string) => {
    setCart(prev => prev.filter(item => item.creditId !== creditId));
  };

  const updateCartQuantity = (creditId: string, quantity: number) => {
    const credit = credits.find(c => c.id === creditId);
    if (!credit) return { success: false };

    const availableCredits = credit.projectInfo?.availableCredits || 0;
    if (quantity > availableCredits) {
      return { success: false, message: 'Số lượng vượt quá tín chỉ có sẵn' };
    }

    if (quantity <= 0) {
      removeFromCart(creditId);
    } else {
      setCart(prev => prev.map(item =>
        item.creditId === creditId ? { ...item, quantity } : item
      ));
    }

    return { success: true };
  };

  const clearCart = () => {
    setCart([]);
  };

  const purchaseCredits = (items: any[]) => {
    const newTransactions = items.map(item => {
      const credit = credits.find(c => c.id === item.creditId);
      if (!credit) return null;

      return {
        id: `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        creditId: item.creditId,
        creditTitle: credit.projectInfo?.title || 'Tín chỉ carbon',
        quantity: item.quantity,
        amount: credit.amount,
        pricePerCredit: credit.price,
        totalPrice: credit.price * item.quantity,
        platformFee: credit.price * item.quantity * 0.05,
        finalPrice: (credit.price * item.quantity) * 1.05,
        seller: credit.ownerName,
        sellerEmail: credit.ownerEmail,
        buyer: currentUser?.name || 'Khách hàng',
        buyerEmail: currentUser?.email || 'guest@email.com',
        purchaseDate: new Date().toISOString(),
        certificateId: `CERT-${Date.now()}-${item.creditId}`,
        serialNumber: credit.ledgerInfo?.serialNumbers || 'N/A',
        vintage: credit.projectInfo?.vintage || credit.year,
        region: credit.region,
        vehicle: credit.vehicle,
        standard: credit.verificationInfo?.standard || 'N/A',
        organization: credit.verificationInfo?.organization || 'CVA',
        status: 'completed',
        type: credit.type,
        paymentMethod: 'VNPay' // Default payment method
      };
    }).filter(t => t !== null);

    // Add all transactions
    setTransactions(prev => [...prev, ...newTransactions]);

    // Update credit availability
    items.forEach(item => {
      setCredits(prev => prev.map(c => {
        if (c.id === item.creditId) {
          const newAvailable = (c.projectInfo?.availableCredits || 0) - item.quantity;
          return {
            ...c,
            projectInfo: {
              ...c.projectInfo,
              availableCredits: Math.max(0, newAvailable)
            }
          };
        }
        return c;
      }));
    });

    // Remove credits with 0 availability
    setTimeout(() => {
      setCredits(prev => prev.filter(c => 
        (c.projectInfo?.availableCredits || 0) > 0
      ));
    }, 100);

    return { success: true, transactions: newTransactions };
  };

  const login = (email: string, password: string) => {
    // CVA login
    if (email === 'cvakiemduyet' && password === 'cva123') {
      const cvaUser = {
        id: 'cva-1',
        email: 'cva@carbonmarket.com',
        name: 'CVA Kiểm Duyệt',
        role: 'CVA'
      };
      setCurrentUser(cvaUser);
      toast.success('Đăng nhập CVA thành công!');
      return { success: true, user: cvaUser };
    }

    // Admin login
    if (email === 'admin' && password === 'admin123') {
      const adminUser = {
        id: 'admin-1',
        email: 'admin@carbonmarket.com',
        name: 'Administrator',
        role: 'ADMIN'
      };
      setCurrentUser(adminUser);
      toast.success('Đăng nhập Admin thành công!');
      return { success: true, user: adminUser };
    }

    // Test Buyer Account
    if (email === 'buyer@test.com' && password === 'buyer123') {
      const buyerUser = {
        id: 'buyer-test-1',
        email: 'buyer@test.com',
        name: 'Nguyễn Văn Test',
        role: 'BUYER'
      };
      setCurrentUser(buyerUser);
      toast.success('Đăng nhập người mua thành công!');
      return { success: true, user: buyerUser };
    }

    // Test Seller Account
    if (email === 'seller@test.com' && password === 'seller123') {
      const sellerUser = {
        id: 'seller-test-1',
        email: 'seller@test.com',
        name: 'Trần Thị Seller',
        role: 'EV_OWNER'
      };
      setCurrentUser(sellerUser);
      toast.success('Đăng nhập người bán thành công!');
      return { success: true, user: sellerUser };
    }

    // Check registered users
    const registeredUser = users.find(u => u.email === email && u.password === password);
    if (registeredUser) {
      const user = {
        id: registeredUser.id,
        email: registeredUser.email,
        name: registeredUser.name,
        role: registeredUser.role
      };
      setCurrentUser(user);
      
      const roleNames = {
        'BUYER': 'người mua',
        'EV_OWNER': 'người bán'
      };
      toast.success(`Đăng nhập ${roleNames[user.role as keyof typeof roleNames] || ''} thành công!`);
      return { success: true, user };
    }

    // If no match found
    return { success: false, message: 'Email hoặc mật khẩu không đúng' };
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    toast.info('Đã đăng xuất');
  };

  const register = (userData: any) => {
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      toast.error('Email đã được sử dụng!');
      return { success: false, message: 'Email đã tồn tại' };
    }

    // Mock registration - in production would call API
    const newUser = {
      id: `user-${Date.now()}`,
      email: userData.email,
      password: userData.password, // In production, this would be hashed
      name: userData.name || userData.email.split('@')[0],
      role: userData.role, // BUYER or EV_OWNER
      phone: userData.phone || '',
      address: userData.address || '',
      createdAt: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
    return { success: true };
  };

  const value = {
    credits,
    pendingCredits,
    verifiedCredits,
    users,
    transactions,
    cart,
    currentUser,
    user: currentUser, // Alias
    addCredit,
    updateCredit,
    publishCredit,
    addTransaction,
    setCurrentUser,
    login,
    logout,
    register,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    purchaseCredits
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
