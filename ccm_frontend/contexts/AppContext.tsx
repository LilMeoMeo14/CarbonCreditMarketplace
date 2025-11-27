import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authService, RegisterFormData } from '../services/authService'; // Import interface
import { jwtDecode } from "jwt-decode";

interface AppContextType {
  currentUser: any;
  // Cập nhật kiểu dữ liệu cho hàm register để khớp với authService
  register: (userData: RegisterFormData) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: any; message?: string }>;
  logout: () => void;

  // ... (Các hàm mock khác giữ nguyên)
  credits: any[];
  pendingCredits: any[];
  verifiedCredits: any[];
  users: any[];
  transactions: any[];
  cart: any[];
  user: any;
  addCredit: (credit: any) => void;
  updateCredit: (id: string, updates: any) => void;
  publishCredit: (id: string) => void;
  addTransaction: (transaction: any) => void;
  setCurrentUser: (user: any) => void;
  addToCart: (creditId: string, quantity: number) => any;
  removeFromCart: (creditId: string) => void;
  updateCartQuantity: (creditId: string, quantity: number) => any;
  clearCart: () => void;
  purchaseCredits: (items: any[]) => any;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => useContext(AppContext);

const initialCredits: any[] = []; // Placeholder
const initialPendingCredits: any[] = []; // Placeholder

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState(initialCredits);
  const [pendingCredits, setPendingCredits] = useState(initialPendingCredits);
  const [verifiedCredits, setVerifiedCredits] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // --- LOGIC XỬ LÝ TOKEN ---
  const handleTokenProcessing = (token: string) => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error("Token không hợp lệ");
      }

      localStorage.setItem('accessToken', token); // Thống nhất dùng key 'accessToken'

      // Giải mã token để lấy thông tin user
      const decoded: any = jwtDecode(token);

      // Backend trả về scope: "ROLE_EV_OWNER" -> Cắt bỏ "ROLE_"
      const rawRole = decoded.scope || '';
      const userRole = rawRole.replace('ROLE_', '');

      // Email là subject (sub) trong token
      const userEmail = decoded.sub;

      const user = {
        id: userEmail, // Tạm dùng email làm ID
        email: userEmail,
        name: userEmail.split('@')[0], // Tạm hiển thị tên từ email
        role: userRole
      };

      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error("Lỗi xử lý token:", error);
      return null;
    }
  };

  // Tự động login khi F5
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      handleTokenProcessing(token);
    }
  }, []);

  // --- LOGIN ---
  const login = async (email: string, password: string) => {
    try {
      const result = await authService.login(email, password);

      // SỬA LỖI Ở ĐÂY: Lấy đúng trường token từ response
      // Backend có thể trả về 'token' hoặc 'accessToken' tùy phiên bản DTO
      const tokenString = result.accessToken || (result as any).token;

      if (!tokenString) {
        throw new Error("Không tìm thấy token trong phản hồi từ server");
      }

      const user = handleTokenProcessing(tokenString);

      if (result.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }

      toast.success(`Chào mừng trở lại, ${user?.name}`);
      return { success: true, user };

    } catch (error: any) {
      console.error("Login Error:", error);
      return { success: false, message: error.message };
    }
  };


  // --- REGISTER ---
  const register = async (userData: RegisterFormData) => {
    try {
      const result = await authService.register(userData);

      // Backend trả về token ngay sau khi đăng ký -> Auto login
      if (result && result.accessToken) {
        handleTokenProcessing(result.accessToken);
        if (result.refreshToken) localStorage.setItem('refreshToken', result.refreshToken);
      }

      toast.success('Đăng ký thành công!');
      return { success: true };
    } catch (error: any) {
      console.error("Register Error:", error);
      toast.error(error.message);
      return { success: false, message: error.message };
    }
  };
  // --- LOGOUT ---
  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    toast.info('Đã đăng xuất');
  };

  const addCredit = (credit: any) => setPendingCredits(prev => [...prev, { ...credit, id: Date.now().toString(), status: 'pending' }]);
  const updateCredit = (id: string, updates: any) => { /* Logic cũ của bạn */ };
  const publishCredit = (id: string) => { /* Logic cũ của bạn */ };
  const addTransaction = (transaction: any) => { /* Logic cũ của bạn */ };
  const addToCart = (creditId: string, quantity: number) => { /* Logic cũ của bạn */ return { success: true } };
  const removeFromCart = (creditId: string) => { /* Logic cũ của bạn */ };
  const updateCartQuantity = (creditId: string, quantity: number) => { /* Logic cũ của bạn */ return { success: true } };
  const clearCart = () => setCart([]);
  const purchaseCredits = (items: any[]) => { /* Logic cũ của bạn */ return { success: true } };

  const value = {
    credits, pendingCredits, verifiedCredits, users, transactions, cart, currentUser, user: currentUser,
    addCredit, updateCredit, publishCredit, addTransaction, setCurrentUser,
    login, logout, register,
    addToCart, removeFromCart, updateCartQuantity, clearCart, purchaseCredits
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}