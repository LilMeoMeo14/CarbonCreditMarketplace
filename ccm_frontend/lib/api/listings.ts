import axiosClient from "./axios-client"

export interface Listing {
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

export interface CreateListingRequest {
  amount: number
  price: number
  listingType: "DIRECT_SALE" | "AUCTION"
  expiresAt: string
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

export const listingsApi = {
  getMyListings: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: Listing[] }>(
      "/listings/my-listings",
    )
    return response.data
  },

  createListing: async (data: CreateListingRequest) => {
    const response = await axiosClient.post<{ code: number; message: string; result: Listing }>("/listings", data)
    return response.data
  },

  cancelListing: async (id: number) => {
    const response = await axiosClient.post(`/listings/${id}/cancel`)
    return response.data
  },

  getSalesHistory: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: Transaction[] }>(
      "/transactions/history/sales",
    )
    return response.data
  },
}
