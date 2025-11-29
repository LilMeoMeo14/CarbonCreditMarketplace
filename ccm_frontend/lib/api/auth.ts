import axiosClient from "./axios-client"


export interface User {
  userId: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role: "EV_OWNER" | "BUYER" | "CVA" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  result: {
    success: boolean;
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        await axiosClient.post("/auth/logout", { accessToken: token });
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => !!localStorage.getItem("accessToken"),
};
