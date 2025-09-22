import React from "react";
import AuthLayout from "../../components/Auth/AuthLayout";
import LoginForm from "../../components/Auth/LoginForm";
import Banner from "../../components/Auth/Banner";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async ({ email }) => {
    console.log("signin:", email);
    navigate("/");
  };

  const handleForgot = () => {
    navigate("/forgot-password");
  };

  return (
    <AuthLayout
      left={<LoginForm onSubmit={handleSubmit} onForgot={handleForgot} />}
      right={<Banner />}
    />
  );  
}
