import axiosClient from "./axios-client"

export interface EVProfile {
  evProfileId: number
  vehicleModel: string
  licensePlate: string
  batteryCapacityKwh: number
  registrationDate: string
  verificationDocumentUrl: string
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string
}

export interface CreateEVProfileRequest {
  vehicleModel: string
  licensePlate: string
  batteryCapacityKwh: number
  registrationDate: string
  verificationDocumentUrl: string
}

export interface CarbonSaving {
  savingId: number
  distanceKm: number
  co2SavedKg: number
  calculationMethod: string
  recordedDate: string
  createdAt: string
}

export interface CreateCarbonSavingRequest {
  distanceKm: number
  recordedDate: string
  evidenceImageUrl: string
}

export const evProfilesApi = {
  getMyVehicles: async () => {
    const response = await axiosClient.get<{ code: number; message: string; result: EVProfile[] }>(
      "/ev-profiles/my-vehicles",
    )
    return response.data
  },

  createProfile: async (data: CreateEVProfileRequest) => {
    const response = await axiosClient.post<{ code: number; message: string; result: EVProfile }>("/ev-profiles", data)
    return response.data
  },

  updateProfile: async (id: number, data: CreateEVProfileRequest) => {
    const response = await axiosClient.put<{ code: number; message: string; result: EVProfile }>(
      `/ev-profiles/${id}`,
      data,
    )
    return response.data
  },

  deleteProfile: async (id: number) => {
    const response = await axiosClient.delete(`/ev-profiles/${id}`)
    return response.data
  },

  getCarbonSavings: async (id: number) => {
    const response = await axiosClient.get<{ code: number; message: string; result: CarbonSaving[] }>(
      `/ev-profiles/${id}/carbon-saving`,
    )
    return response.data
  },

  createCarbonSaving: async (id: number, data: CreateCarbonSavingRequest) => {
    const response = await axiosClient.post<{ code: number; message: string; result: CarbonSaving }>(
      `/ev-profiles/${id}/carbon-saving`,
      data,
    )
    return response.data
  },
}
