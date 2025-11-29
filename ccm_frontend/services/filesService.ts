import axiosClient from '@/lib/api/axios-client'

export const filesService = {
    /**
     * Upload file lên server
     * @param file File object lấy từ input[type="file"]
     * @returns Tên file đã lưu trên server (string UUID)
     */
    upload: async (file: File): Promise<string> => {
        // 1. Tạo FormData (Bắt buộc khi gửi file)
        const formData = new FormData();

        // Key 'file' này PHẢI KHỚP với @RequestParam("file") bên Backend Controller
        formData.append('file', file);

        try {
            const response: any = await axiosClient.post('/files/upload', formData, {
                headers: {
                    // 2. QUAN TRỌNG: Ghi đè header để báo đây là upload file
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Backend trả về: { code: 1000, result: "uuid.jpg" }
            // Nếu axiosClient đã intercept data -> response chính là object đó
            // Nếu chưa -> response.data
            const data = response.data || response;

            if (data.code !== 1000) {
                throw new Error(data.message || 'Upload thất bại');
            }

            return data.result; // Trả về tên file (VD: "550e8400...jpg")

        } catch (error: any) {
            console.error("Upload error:", error);
            throw new Error(error.response?.data?.message || "Lỗi khi upload ảnh");
        }
    },

    /**
     * Helper lấy full URL để hiển thị ảnh
     */
    getImageUrl: (filename: string) => {
        if (!filename) return '';
        if (filename.startsWith('http')) return filename; // Nếu là link ngoài
        return `http://localhost:8080/files/${filename}`;
    }
};