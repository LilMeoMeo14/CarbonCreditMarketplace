import axiosClient from "./axios-client"

export interface CarbonWallet {
  walletId: number
  balance: number
  lockedAmount: number
  updatedAt: string
}

export interface EWallet {
  walletId: number
  balance: number
  lockedAmount: number
  currency: string
  updatedAt: string
}

export interface Certificate {
  certificateId: number
  ownerName: string
  amount: number
  serialNumber: string
  reason: string
  issueDate: string
  type: "ISSUANCE" | "RETIREMENT"
}

export const walletsApi = {
  getCarbonWallet: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: CarbonWallet }>(
      "/carbon-wallets/my-wallet",
    )
    return response.data
  },

  getEWallet: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: EWallet }>("/e-wallets/my-wallet")
    return response.data
  },

  withdrawRequest: async (amount: number, bankInfo: string) => {
    const response = await axiosClient.post("/e-wallets/withdraw-request", { amount, bankInfo })
    return response.data
  },

  depositRequest: async (amount: number) => {
    const response = await axiosClient.post("/e-wallets/deposit-request", { amount })
    return response.data
  },

  getMyCertificates: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: Certificate[] }>(
      "/certificate/my-certificates",
    )
    return response.data
  },

  retireCredits: async (amount: number, reason: string) => {
    const response = await axiosClient.post("/certificate/retire", { amount, reason })
    return response.data
  },
}
