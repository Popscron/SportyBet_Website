import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../utils/1win/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and verify it
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          // Verify token by calling the /auth/me endpoint
          const response = await api.get('/auth/me');
          if (response.data.success && response.data.data.user) {
            const userData = response.data.data.user;
            setUser({
              role: userData.role || (userData.isAdmin ? 'admin' : 'user'),
              email: userData.email,
              name: userData.name,
              id: userData.id,
              isAdmin: userData.isAdmin,
              inviteCode: userData.inviteCode || null, // Store inviteCode to distinguish main admin
            });
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('admin_token');
            setUser(null);
          }
        } catch (error) {
          // Token verification failed, remove it
          console.error('Token verification failed:', error);
          localStorage.removeItem('admin_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Call admin login API using configured axios instance
      const response = await api.post('/auth/admin/login', {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('admin_token', token);
        // Fetch full user data to get role
        try {
          const userResponse = await api.get('/auth/me');
          if (userResponse.data.success && userResponse.data.data.user) {
            const userData = userResponse.data.data.user;
            setUser({
              role: userData.role || 'admin',
              email: userData.email,
              name: userData.name,
              id: userData.id,
              isAdmin: userData.isAdmin,
              inviteCode: userData.inviteCode || null, // Store inviteCode to distinguish main admin
            });
          } else {
            setUser({ 
              role: 'admin', 
              email: user.email,
              name: user.name,
              id: user.id,
              isAdmin: true,
            });
          }
        } catch (error) {
          setUser({ 
            role: 'admin', 
            email: user.email,
            name: user.name,
            id: user.id,
            isAdmin: true,
          });
        }
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};





