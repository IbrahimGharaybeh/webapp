import { createAuthClient } from 'better-auth/client';

const baseURL =
  import.meta.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

export const authClient = createAuthClient({
  baseURL
});

export const AUTH_BASE_URL = baseURL;
