import axiosClient from "./axios-client"

export const filesApi = {
  upload: async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await axiosClient.post<{ code: number; message: string; result: string }>(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )
    return response.data.result
  },
}
