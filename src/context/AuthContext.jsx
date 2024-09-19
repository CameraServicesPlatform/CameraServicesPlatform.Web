// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // Function to handle the restoration of the login state
  const restoreLoginState = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true);
      const user = JSON.parse(storedUser).user;
      setUsername(user);
    }
  };

  useEffect(() => {     
    restoreLoginState();
  }, []);

  const login = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem('user', JSON.stringify({ user }));
    // Perform any additional login operations here
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('user');
    // Perform any logout operations here
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
