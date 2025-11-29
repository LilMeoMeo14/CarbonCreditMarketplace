import axiosClient from "./axios-client"

export interface MarketplaceListing {
  listingId: number
  sellerId: string
  sellerName: string
  vehicleModel: string
  licensePlate: string
  amount: number
  price: number
  listingType: "DIRECT_SALE" | "AUCTION"
  status: "ACTIVE" | "SOLD" | "CANCELLED" | "EXPIRED"
  createdAt: string
  expiresAt: string
}

export interface SearchListing {
  id: number
  vehicleModel: string
  sellerName: string
  amount: number
  price: number
  type: string
  status: string
  createdAt: string
}

export interface Transaction {
  transactionId: number
  listingId: number
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  amount: number
  pricePerCredit: number
  totalMoney: number
  type: "BUY_NOW" | "AUCTION"
  createdAt: string
}

export interface BuyNowResponse {
  transactionId: number
  listingId: number
  sellerId: string
  sellerName: string
  buyerId: string
  buyerName: string
  amount: number
  pricePerCredit: number
  totalMoney: number
  type: "BUY_NOW"
  createdAt: string
}

export const marketplaceApi = {
  // Lấy tất cả listings đang active
  getActiveListings: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: MarketplaceListing[] }>(
      "/listings/active",
    )
    return response.data
  },

  // Tìm kiếm và lọc listings
  searchListings: async (params?: {
    minPrice?: number
    maxPrice?: number
    vehicleModel?: string
    minAmount?: number
  }) => {
    const response = await axiosClient.get<{ code: number; message: string; result: SearchListing[] }>(
      "/listings/search",
      { params },
    )
    return response.data
  },

  // Mua ngay
  buyNow: (listingId: number, amount: number) => {
    return axiosClient.post(`/transactions/buy-now/${listingId}`, null, {
      params: { amount },
    })
  },

  // Đấu giá
  placeBid: async (listingId: number, amount: number) => {
    const response = await axiosClient.post(`/listings/${listingId}/bid`, { amount })
    return response.data
  },

  // Lịch sử mua hàng
  getPurchaseHistory: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: Transaction[] }>(
      "/transactions/history/purchases",
    )
    return response.data
  },
}
