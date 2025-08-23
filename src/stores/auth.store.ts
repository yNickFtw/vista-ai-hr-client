import { create } from 'zustand'

interface AuthState {
  isAuth: boolean
  setIsAuth: (isAuth: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: !!localStorage.getItem('accessToken'),
  setIsAuth: (isAuth: boolean) => set({ isAuth }),
  logout: () => {
    set({ isAuth: false });
    localStorage.removeItem('accessToken');
  },
}))
