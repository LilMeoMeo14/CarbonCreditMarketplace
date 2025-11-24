// src/services/authService.ts

const API_URL = 'http://localhost:8080/auth';

// Interface cho kết quả trả về từ Backend (AuthenticationResponse)
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

// Interface cho dữ liệu từ Form Đăng ký của Frontend gửi vào
export interface RegisterFormData {
    email: string;
    password: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role: 'EV_OWNER' | 'BUYER' | 'CVA' | 'ADMIN';
    address?: string;
}

export const authService = {
    // --- LOGIN ---
    login: async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok || data.code !== 1000) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            return data.result;
        } catch (error: any) {
            throw new Error(error.message || 'Lỗi kết nối server');
        }
    },
    // --- REGISTER ---
    register: async (userData: RegisterFormData): Promise<LoginResponse> => {
        try {
            // 1. Tách tên (First/Last)
            let finalFirstName = userData.firstName || '';
            let finalLastName = userData.lastName || '';

            if (!finalFirstName && !finalLastName && userData.name) {
                const nameParts = userData.name.trim().split(' ');
                if (nameParts.length === 1) {
                    finalFirstName = nameParts[0];
                    finalLastName = nameParts[0]; // Fallback nếu chỉ có 1 tên
                } else {
                    finalLastName = nameParts.pop() || '';
                    finalFirstName = nameParts.join(' ');
                }
            }

            // 2. Chuẩn bị Body JSON chuẩn theo DTO `CreateUserRequest`
            const requestBody = {
                email: userData.email,
                password: userData.password,
                reTypePassword: userData.password, // Quan trọng: Backend cần trường này
                firstName: finalFirstName,
                lastName: finalLastName,
                phoneNumber: userData.phone,       // Quan trọng: Backend cần @Size(10)
                role: userData.role,
                status: "ACTIVE"
            };

            console.log("Sending Register Request:", requestBody); // Debug log

            // 3. Gọi API
            const response = await fetch(`${API_URL}/register`, { // Kiểm tra lại endpoint là /register hay /users/register tùy controller
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok || data.code !== 1000) {
                // Xử lý lỗi từ backend trả về (ví dụ: PASSWORD_INVALID, USER_EXISTED)
                throw new Error(data.message || 'Đăng ký thất bại');
            }

            // Trả về kết quả (thường chứa token để auto-login)
            return data.result;

        } catch (error: any) {
            console.error("Auth Service Error:", error);
            throw new Error(error.message || 'Lỗi kết nối server');
        }
    }
};