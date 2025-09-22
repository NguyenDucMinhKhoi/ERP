import React, { useState } from 'react';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');

  const handleShowRegister = () => setActiveTab('register');
  const handleShowForgot = () => setActiveTab('forgot');
  const handleShowLogin = () => setActiveTab('login');

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-surface shadow-sm md:grid-cols-2">
        <div className="p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            {activeTab === 'login' && (
              <LoginForm onForgot={handleShowForgot} onSignUp={handleShowRegister} />
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
