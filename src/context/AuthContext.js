import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../config/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Check if token is expired
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          // Store the complete user object
          setUser({
            _id: decodedToken.userId,
            name: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role
          });
          setIsAuthenticated(true);
        } else {
          // Token is expired
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await apiClient.get('/users/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      Cookies.remove('token');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await apiClient.post('/login', { email, password });
      const { token, user } = data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Store complete user object
      setUser({
        _id: user.id, // Make sure this matches with what backend sends
        name: user.name,
        email: user.email,
        role: user.role,
        loginDates: user.loginDates
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await apiClient.post('/auth/reset-password', { email });
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Password reset failed';
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (token, newPassword) => {
    try {
      setLoading(true);
      await apiClient.post('/auth/update-password', { token, newPassword });
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Password update failed';
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      resetPassword,
      updatePassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 