import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import {
  login as loginService,
  signUp as signUpService,
  sendVerificationCode as sendVerificationCodeService,
  verifyVerificationCode as verifyVerificationCodeService,
  sendForgotPasswordCode as sendForgotPasswordCodeService,
  verifyForgotPasswordCode as verifyForgotPasswordCodeService,
  changePassword as changePasswordService,
  logout as logoutService,
} from '@/services/authService';

interface CustomJwtPayload extends JwtPayload {
    role: string;
    active: boolean;
    email: string;
    id: string; 
}
export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await loginService(email, password);
      if (response.success == false) {
        setError(response.message);
        return;
      }
      const token = jwtDecode(response.data) as CustomJwtPayload;
      const role = token.role.toLowerCase();
      localStorage.setItem('token', response.data);
      navigate(`/${role}-dashboard`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const response = await signUpService(email, password, role);
      navigate('/verify-email', { state: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async (email: string) => {
    setLoading(true);
    try {
      await sendVerificationCodeService(email);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to send verification code'
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyVerificationCode = async (email: string, code: string) => {
    setLoading(true);
    try {
      await verifyVerificationCodeService(email, code);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const sendForgotPasswordCode = async (email: string) => {
    setLoading(true);
    try {
      await sendForgotPasswordCodeService(email);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const verifyForgotPasswordCode = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    setLoading(true);
    try {
      await verifyForgotPasswordCodeService(email, code, newPassword);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (
    email: string,
    currentPassword: string,
    newPassword: string
  ) => {
    setLoading(true);
    try {
      await changePasswordService(email, currentPassword, newPassword);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    signUp,
    sendVerificationCode,
    verifyVerificationCode,
    sendForgotPasswordCode,
    verifyForgotPasswordCode,
    changePassword,
    logout,
    error,
    loading,
  };
};
