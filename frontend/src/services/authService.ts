import axios from '@/lib/axiosInterceptor';

const API_URL = 'https://role-based-ticketing-system.vercel.app/api/auth'; 

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const signUp = async (email: string, password: string, role: string) => {
  const response = await axios.post(`${API_URL}/signup`, { email, password, role });
  return response.data;
};

export const sendVerificationCode = async (email: string) => {
  const response = await axios.post(`${API_URL}/send-verification-code`, { email });
  return response.data;
};

export const verifyVerificationCode = async (email: string, code: string) => {
  const response = await axios.post(`${API_URL}/verify-verification-code`, { email, code });
  return response.data;
};

export const sendForgotPasswordCode = async (email: string) => {
  const response = await axios.post(`${API_URL}/send-forgot-password-code`, { email });
  return response.data;
};

export const verifyForgotPasswordCode = async (email: string, code: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/verify-forgot-password-code`, { email, code, newPassword });
  return response.data;
};

export const changePassword = async (email: string, currentPassword: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/change-password`, { email, currentPassword, newPassword });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`);
  return response.data;
};