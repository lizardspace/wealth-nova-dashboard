
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold text-eparnova-blue">404</div>
        <h1 className="text-2xl font-medium text-gray-800">Page non trouvée</h1>
        <p className="text-gray-600 max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-4 py-2 bg-eparnova-blue text-white rounded-md hover:bg-eparnova-blue-light transition-colors"
          >
            Retourner à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
