
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-eparnova-blue to-eparnova-blue-light p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <Link to="/" className="text-3xl font-bold text-white inline-flex items-center">
          <span className="text-eparnova-gold">EPAR</span>NOVA
        </Link>
        <p className="text-white/80 mt-2">Votre solution complète de gestion patrimoniale</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-white/70 text-sm text-center">
        <p>© 2025 EPARNOVA. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default Login;
