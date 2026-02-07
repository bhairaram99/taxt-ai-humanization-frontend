import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  userType: 'Free' | 'Paid';
  planName: string | null;
  tokensUsed: number;
  tokensRemaining: number;
  blocked: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Get auth token from localStorage
  const getToken = () => localStorage.getItem('authToken');
  
  // Save auth token to localStorage
  const saveToken = (token: string) => localStorage.setItem('authToken', token);
  
  // Remove auth token from localStorage
  const clearToken = () => localStorage.removeItem('authToken');

  // Fetch user profile from backend
  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setProfile(userData);
        return userData;
      } else {
        // Token invalid or expired
        clearToken();
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      clearToken();
      setUser(null);
      setProfile(null);
    }
  }, []);

  // Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUserProfile(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Refresh profile from backend
  const refreshProfile = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  // Signup function
  const signup = async (email: string, password: string, username?: string) => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to create account');
    }

    // Save token and set user
    saveToken(data.token);
    setUser(data.user);
    setProfile(data.user);
  };

  // Login function
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to login');
    }

    // Save token and set user
    saveToken(data.token);
    setUser(data.user);
    setProfile(data.user);
  };

  // Logout function
  const logout = () => {
    clearToken();
    setUser(null);
    setProfile(null);
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to process password reset');
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }

    // Auto-login after password reset
    if (data.token) {
      saveToken(data.token);
      await fetchUserProfile(data.token);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signup,
    login,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
