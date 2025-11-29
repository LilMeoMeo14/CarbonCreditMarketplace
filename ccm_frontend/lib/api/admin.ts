import axiosClient from "./axios-client"

// Types for pending transactions
export interface PendingTransaction {
    transactionId: number
    walletId: number
    amount: number
    type: "DEPOSIT" | "WITHDRAW"
    status: "PENDING" | "APPROVED" | "REJECTED"
    description: string
    createdAt: string
}

// Types for users
export interface AdminUser {
    userId: string
    password: string
    email: string
    phoneNumber: string
    firstName: string
    lastName: string
    role: "EV_OWNER" | "BUYER" | "CVA" | "ADMIN"
    status: "ACTIVE" | "INACTIVE" | "BANNED"
}

// API response types
interface ApiResponse<T> {
    code: number
    message: string
    result: T
}

export const adminApi = {
    // ============ FINANCIAL APPROVAL ============

    // Get pending transactions (deposits/withdrawals)
    getPendingTransactions: async (): Promise<ApiResponse<PendingTransaction[]>> => {
        const response = await axiosClient.get<ApiResponse<PendingTransaction[]>>("/e-wallets/transactions/pending")
        return response.data
    },

    // Approve transaction
    approveTransaction: async (id: number): Promise<ApiResponse<string>> => {
        const response = await axiosClient.post<ApiResponse<string>>(`/e-wallets/transactions/${id}/approve`)
        return response.data
    },

    // Reject transaction
    rejectTransaction: async (id: number): Promise<ApiResponse<string>> => {
        const response = await axiosClient.post<ApiResponse<string>>(`/e-wallets/transactions/${id}/reject`)
        return response.data
    },

    // Approve withdrawal request
    approveWithdraw: async (id: number): Promise<ApiResponse<string>> => {
        const response = await axiosClient.post<ApiResponse<string>>(`/e-wallets/transactions/${id}/approve-withdraw`)
        return response.data
    },

    // Reject withdrawal request with reason
    rejectWithdraw: async (id: number, reason: string): Promise<ApiResponse<string>> => {
        const params = new URLSearchParams()
        params.append("reason", reason)
        const response = await axiosClient.post<ApiResponse<string>>(
            `/e-wallets/transactions/${id}/reject-withdraw?${params.toString()}`,
        )
        return response.data
    },

    // ============ USER MANAGEMENT ============

    // Get all users
    getUsers: async (): Promise<ApiResponse<AdminUser[]>> => {
        const response = await axiosClient.get<ApiResponse<AdminUser[]>>("/users")
        return response.data
    },

    // Delete user
    deleteUser: async (id: string): Promise<ApiResponse<string>> => {
        const response = await axiosClient.delete<ApiResponse<string>>(`/users/${id}`)
        return response.data
    },
}
