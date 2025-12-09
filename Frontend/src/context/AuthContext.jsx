import React, { createContext, useEffect, useState } from 'react';
import axios, { setOnTokenRefreshed, setAccessToken } from '../api/axios';

const AuthContext = createContext({ 
    user: null, 
    loading: true, 
    login: () => {}, 
    register: () => {}, 
    logout: () => {} 
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync state when axios refreshes token automatically
    setOnTokenRefreshed((newToken, newUser) => {
        if (newUser) setUser(newUser);
    });

    // Restore session on mount
    const restoreSession = async () => {
        try {
            const res = await axios.post('/users/refresh');
            const { accessToken, user } = res.data;
            setAccessToken(accessToken);
            setUser(user);
        } catch (err) {
            // Session invalid or expired
            setAccessToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const res = await axios.post('/users/login', credentials);
    const { accessToken, user } = res.data;
    setAccessToken(accessToken);
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await axios.post('/users/register', data);
    const { accessToken, user } = res.data;
    setAccessToken(accessToken);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
        await axios.post('/users/logout');
    } catch (err) {
        console.error("Logout failed", err);
    }
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
