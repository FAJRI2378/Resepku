import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_LOGIN_URL } from '../config/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        console.log('Stored user info in AuthContext:', storedUserInfo);
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data);

        if (!data.user || !data.user.role) {
          Alert.alert('Error', 'Role pengguna tidak ditemukan.');
          return false;
        }

        setUserInfo(data.user);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));

        return data.user.role; // Untuk navigasi berdasarkan role
      } else {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          Alert.alert('Login Gagal', data.msg || 'Email atau password salah.');
        } catch {
          Alert.alert('Login Gagal', text);
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Gagal menghubungi server.');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
      setUserInfo(null);
      console.log('User logged out successfully.');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Gagal saat logout.');
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
