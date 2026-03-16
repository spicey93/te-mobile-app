import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUserFromSession(session)
    );

    return () => subscription.unsubscribe();
  }, []);

  function setUserFromSession(session: Session | null) {
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email ?? '',
      });
    } else {
      setUser(null);
    }
  }

  async function loadSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUserFromSession(session);
    } catch (e) {
      console.warn('Failed to load session:', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    if (!email.trim()) throw new Error('Email is required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;
  }

  async function signUp(email: string, password: string) {
    if (!email.trim()) throw new Error('Email is required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) throw error;
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
