import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'attendee' | 'organizer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { 
      user: user?.email, 
      role: userProfile?.role,
      loading,
      requiredRole 
    });
  }, [user, userProfile, loading, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required role
  if (requiredRole && userProfile?.role !== requiredRole) {
    console.log(`ProtectedRoute - User role ${userProfile?.role} does not match required role ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  // If we have user and optional role check passes, render children
  return <>{children}</>;
}