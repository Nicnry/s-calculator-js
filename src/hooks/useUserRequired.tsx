'use client';

import { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/db/schema';

export function useUserRequired(options: UseUserRequiredOptions = {}): UseUserRequiredResult {
  const {
    checkId = false,
    id,
    loadingComponent = <div>Chargement...</div>,
    errorComponent = <div>Erreur: Les données utilisateur ne correspondent pas à l'ID demandé</div>
  } = options;

  const { user } = useUser();
  
  if (!user) {
    return { 
      user: null, 
      component: loadingComponent,
      isReady: false
    };
  }
  
  if (checkId && id !== undefined && user.id !== id) {
    return { 
      user: null, 
      component: errorComponent,
      isReady: false
    };
  }
  
  return { 
    user, 
    component: null,
    isReady: true
  };
}

type UseUserRequiredOptions = {
  checkId?: boolean;
  id?: number;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
}

type UseUserRequiredResult = {
  user: User | null;
  component: ReactNode | null;
  isReady: boolean;
}