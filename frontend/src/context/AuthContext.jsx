import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged in user profile when token changes
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = (jwtData, userData) => {
    localStorage.setItem('token', jwtData);
    setToken(jwtData);
    setUser(userData); // Set immediately for faster UI
  };

  const logout = () => {
    localStorage.removeItem('token');
    // also clean up old admin tokens if present
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';
  const isVolunteer = user?.role === 'volunteer';

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, isAdmin, isVolunteer, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
