import { useEffect } from 'react';
import { supabase } from './supabase';

export function AuthListener() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const meta = session.user.user_metadata;

          await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: session.user.id,
              email: session.user.email,
              username: meta?.username || '',
              name: meta?.name || '',
              is_company: meta?.is_company || false
            })
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return null;
}