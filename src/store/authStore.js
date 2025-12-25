/**
 * Auth Store - Zustand store untuk autentikasi
 * @module store/authStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_USERS } from './mockData';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isOnboarded: false,
      registeredUsers: [...MOCK_USERS], // Copy of mock users for registration

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          // Simulasi API call delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const { registeredUsers } = get();
          
          // Check in registered users (includes mock + new registrations)
          const user = registeredUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );

          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            set({
              user: userWithoutPassword,
              token: 'mock-jwt-token-' + Date.now(),
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true, user: userWithoutPassword };
          } else {
            set({
              isLoading: false,
              error: 'Email atau password salah',
            });
            return { success: false, error: 'Email atau password salah' };
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Terjadi kesalahan saat login',
          });
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          // Simulasi API call delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const { registeredUsers } = get();

          // Check if email already exists
          const existingUser = registeredUsers.find(
            (u) => u.email.toLowerCase() === userData.email.toLowerCase()
          );

          if (existingUser) {
            set({
              isLoading: false,
              error: 'Email sudah terdaftar',
            });
            return { success: false, error: 'Email sudah terdaftar' };
          }

          // Create new user
          const newUser = {
            id: String(Date.now()),
            email: userData.email.toLowerCase(),
            password: userData.password,
            name: userData.name,
            phone: userData.phone || '',
            avatar: null,
            bio: '',
            location: 'Makassar',
            joinDate: new Date().toISOString(),
          };

          // Add to registered users
          const updatedUsers = [...registeredUsers, newUser];

          const { password: _, ...userWithoutPassword } = newUser;
          set({
            registeredUsers: updatedUsers,
            user: userWithoutPassword,
            token: 'mock-jwt-token-' + Date.now(),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user: userWithoutPassword };
        } catch (error) {
          set({
            isLoading: false,
            error: error.message || 'Terjadi kesalahan saat registrasi',
          });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setOnboarded: (value) => {
        set({ isOnboarded: value });
      },

      clearError: () => {
        set({ error: null });
      },

      // Update user profile
      updateUser: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      // Forgot password (mock)
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const { registeredUsers } = get();
          const user = registeredUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          );

          if (user) {
            set({ isLoading: false });
            return { success: true, message: 'Link reset password telah dikirim ke email Anda' };
          } else {
            set({
              isLoading: false,
              error: 'Email tidak terdaftar',
            });
            return { success: false, error: 'Email tidak terdaftar' };
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isOnboarded: state.isOnboarded,
        registeredUsers: state.registeredUsers,
      }),
    }
  )
);
