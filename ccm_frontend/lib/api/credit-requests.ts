import axiosClient from "./axios-client"

export interface CreditRequest {
  requestId: number
  evProfileId: number
  licensePlate: string
  co2AmountKg: number
  creditAmount: number
  requestDate: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  verificationNote: string
  createdAt: string
}

export const creditRequestsApi = {
  getMyRequests: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: CreditRequest[] }>(
      "/credit-requests/my-requests",
    )
    return response.data
  },

  createRequest: async (evProfileId: number) => {
    const response = await axiosClient.post<{ code: number; message: string; result: CreditRequest }>(
      "/credit-requests",
      { evProfileId },
    )
    return response.data
  },
}
