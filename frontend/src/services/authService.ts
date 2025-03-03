import axios from '@/lib/axiosInterceptor';


export const login = async (email: string, password: string) => {
  const response = await axios.post(`/auth/login`, { email, password });
  return response.data;
};

export const signUp = async (email: string, password: string, role: string) => {
  const response = await axios.post(`/auth/signup`, { email, password, role });
  return response.data;
};

export const sendVerificationCode = async (email: string) => {
  const response = await axios.post(`/auth/send-verification-code`, { email });
  return response.data;
};

export const verifyVerificationCode = async (email: string, code: string) => {
  const response = await axios.post(`/auth/verify-verification-code`, { email, code });
  return response.data;
};

export const sendForgotPasswordCode = async (email: string) => {
  const response = await axios.post(`/auth/send-forgot-password-code`, { email });
  return response.data;
};

export const verifyForgotPasswordCode = async (email: string, code: string, newPassword: string) => {
  const response = await axios.post(`/auth/verify-forgot-password-code`, { email, code, newPassword });
  return response.data;
};

export const changePassword = async (email: string, currentPassword: string, newPassword: string) => {
  const response = await axios.post(`/auth/change-password`, { email, currentPassword, newPassword });
  return response.data;
};

export const logout = async () => {
  const response = await axios.post(`/auth/logout`);
  return response.data;
};