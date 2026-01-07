const API_URL =
  import.meta.env.NEXT_PUBLIC_API_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001';

export async function signUp(email: string, password: string, name: string = '') {
  const response = await fetch(`${API_URL}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, name })
  });
  
  // Debug: see what we actually get
  const text = await response.text();
  console.log('Response status:', response.status);
  console.log('Response body:', text);
  
  if (!text) return { data: null, error: { message: 'Empty response' } };
  
  try {
    const data = JSON.parse(text);
    if (!response.ok) return { data: null, error: data };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: { message: text } };
  }
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/sign-in/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!response.ok) return { data: null, error: data };
  return { data, error: null };
}

export async function logout() {
  const response = await fetch(`${API_URL}/api/auth/sign-out`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) {
    const error = await response.json();
    return { error };
  }
  return { error: null };
}

export async function getSession() {
  const response = await fetch(`${API_URL}/api/auth/get-session`, {
    method: 'GET',
    credentials: 'include'
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data;
}
