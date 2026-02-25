import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { Toaster } from '../components/ui/sonner';

export default function Root() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Outlet />
        <Toaster />
      </div>
    </AuthProvider>
  );
}
