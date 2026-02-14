declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGODB_URI?: string;
    JWT_SECRET: string;          // <-- required, not optional
    JWT_EXPIRES_IN: string;
    JWT_VERIFY_SECRET: string;
    JWT_VERIFY_EXPIRES_IN: string;
    JWT_RESET_SECRET: string;
    JWT_RESET_EXPIRES_IN: string;
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_SECURE: string;
    EMAIL_USER: string;
    EMAIL_PASS: string;
    EMAIL_FROM: string;
    FRONTEND_URL: string;
  }
}