import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function useRequireAuth(requiredRole?: 'attendee' | 'organizer') {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }

      if (requiredRole && userProfile?.role !== requiredRole) {
        navigate('/');
        return;
      }
    }
  }, [user, userProfile, loading, requiredRole, navigate]);

  return { user, userProfile, loading };
}
