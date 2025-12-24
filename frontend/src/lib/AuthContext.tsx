import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getSession } from './auth';

type User = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image: string | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refetch: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const session = await getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}