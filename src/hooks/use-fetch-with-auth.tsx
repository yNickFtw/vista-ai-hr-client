import { api } from '@/api'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { useNavigate } from '@tanstack/react-router';

export const useFetchWithAuth = () => {
    const { isAuth, logout } = useAuthStore();
  
    const navigate = useNavigate();

    useEffect(() => {
        api.interceptors.request.use((config) => {
            if (isAuth) {
                config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
            }
            return config;
        });

        api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && error.config.retry !== false) {
                    logout();
                    navigate({ to: '/auth/login' });
                    return Promise.reject(error);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.clear();
            api.interceptors.response.clear();
        }
    }, [isAuth, logout])
  
    return api;
}
