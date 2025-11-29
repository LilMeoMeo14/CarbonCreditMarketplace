import axiosClient from "./axios-client"

// Types for pending EV profiles
export interface PendingEVProfile {
    evProfileId: number
    vehicleModel: string
    licensePlate: string
    batteryCapacityKwh: number
    registrationDate: string
    verificationStatus: "PENDING" | "APPROVED" | "REJECTED"
    verificationDocumentUrl: string
}

// Types for pending credit requests
export interface PendingCreditRequest {
    requestId: number
    evProfileId: number
    licensePlate: string
    co2AmountKg: number
    creditAmount: number
    requestDate: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    verificationNote: string | null
    createdAt: string
}

// Types for credit savings detail
export interface CreditSaving {
    savingId: number
    distanceKm: number
    co2SavedKg: number
    calculationMethod: string
    recordedDate: string
    createdAt: string
}

export interface PendingCarbonSaving {
    savingId: number
    evProfileId: number
    licensePlate: string
    vehicleModel: string
    distanceKm: number
    co2SavedKg: number
    calculationMethod: string
    recordedDate: string
    status: "PENDING" | "APPROVED" | "REJECTED"
    createdAt: string
}

export type SavingVerifyStatus = "PENDING" | "APPROVED" | "REJECTED"

// API response types
interface ApiResponse<T> {
    code: number
    message: string
    result: T
}

export const cvaApi = {
    // Get pending EV profiles
    getPendingProfiles: async (): Promise<ApiResponse<PendingEVProfile[]>> => {
        const response = await axiosClient.get<ApiResponse<PendingEVProfile[]>>("/cva/pending-profiles")
        return response.data
    },

    // Approve EV profile
    approveProfile: async (id: number): Promise<ApiResponse<string>> => {
        const response = await axiosClient.post<ApiResponse<string>>(`/cva/ev-profile/${id}/approve`)
        return response.data
    },

    // Reject EV profile
    rejectProfile: async (id: number): Promise<ApiResponse<string>> => {
        const response = await axiosClient.post<ApiResponse<string>>(`/cva/ev-profile/${id}/reject`)
        return response.data
    },

    // Get pending credit requests
    getPendingRequests: async (): Promise<ApiResponse<PendingCreditRequest[]>> => {
        const response = await axiosClient.get<ApiResponse<PendingCreditRequest[]>>("/cva/pending-requests")
        return response.data
    },

    // Approve credit request
    approveRequest: async (id: number): Promise<ApiResponse<string>> => {
        const response = await axiosClient.post<ApiResponse<string>>(`/cva/requests/${id}/approve`)
        return response.data
    },

    // Reject credit request
    rejectRequest: async (id: number): Promise<ApiResponse<string>> => {
        const response = await axiosClient.post<ApiResponse<string>>(`/cva/requests/${id}/reject`)
        return response.data
    },

    // Get credit request savings detail
    getRequestSavings: async (requestId: number): Promise<ApiResponse<CreditSaving[]>> => {
        const response = await axiosClient.get<ApiResponse<CreditSaving[]>>(`/cva/requests/${requestId}/savings`)
        return response.data
    },

    // Download issuance report (Excel)
    downloadIssuanceReport: async (): Promise<void> => {
        const response = await axiosClient.get("/cva/issuance/download", {
            responseType: "blob",
        })

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `carbon-issuance-report-${new Date().toISOString().split("T")[0]}.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    },

    // Get pending carbon savings
    getPendingSavings: async (): Promise<ApiResponse<PendingCarbonSaving[]>> => {
        const response = await axiosClient.get<ApiResponse<PendingCarbonSaving[]>>("/cva/pending-savings")
        return response.data
    },

    // Verify carbon saving (PENDING, APPROVED, REJECTED)
    verifySaving: async (id: number, status: SavingVerifyStatus, note?: string): Promise<ApiResponse<string>> => {
        const params = new URLSearchParams()
        params.append("status", status)
        if (note) {
            params.append("note", note)
        }
        const response = await axiosClient.put<ApiResponse<string>>(`/cva/savings/${id}/verify?${params.toString()}`)
        return response.data
    },
}
