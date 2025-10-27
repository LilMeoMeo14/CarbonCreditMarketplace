/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_SECRET_KEY: string;
  // thêm các biến khác nếu cần
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
