import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import authService from '../services/authService';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleShowRegister = () => setActiveTab('register');
  const handleShowForgot = () => setActiveTab('forgot');
  const handleShowLogin = () => setActiveTab('login');

  const handleLogin = async ({ email, password }) => {
    setError('');
    try {
      await authService.login({ email, password });
      // Optionally fetch profile: await authService.getMe();
      navigate('/');
    } catch (e) {
      const data = e?.response?.data;
      const msg = data?.detail || data?.error || data?.message || data?.non_field_errors?.[0] || data?.email?.[0] || data?.password?.[0] || 'Đăng nhập thất bại';
      setError(String(msg));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm md:grid-cols-2">
        <div className="p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            {error && (
              <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {activeTab === 'login' && (
              <LoginForm onSubmit={handleLogin} onForgot={handleShowForgot} onSignUp={handleShowRegister} />
            )}
            {activeTab === 'register' && (
              <RegisterForm onBack={handleShowLogin} />
            )}
            {activeTab === 'forgot' && (
              <ForgotPasswordForm onBack={handleShowLogin} />
            )}
          </div>
        </div>
        <div className="hidden md:block bg-primary-main/80">
          <div className="h-full w-full">
            <div className="flex h-full w-full items-center justify-center bg-primary-main text-white">
              <div className="text-center">
                {/* <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <span className="text-2xl font-bold">⚡</span>
                </div> */}
                <div className="text-4xl font-semibold tracking-wide">English Center ERP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
