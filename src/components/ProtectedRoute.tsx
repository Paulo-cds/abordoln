// src/components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Importe Navigate e Outlet
import { useUserData } from './ContextData'; // Seu store Zustand
import LoadingDefault from './LoadingDefault';
// import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Array de roles permitidos para acessar esta rota (opcional)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  // Acesse o estado de usuário e login do seu store Zustand
  const { dataUser, userLoged, checkLogin, isLoadingData } = useUserData();
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      await checkLogin(); 
    //   setIsLoading(false); 
    };

    
    if (userLoged === null) {
      checkAuthStatus();
    } else {
    //   setIsLoading(false); 
    }
  }, [userLoged]); 

  // Se a rota exige roles específicos e o usuário não tem um role permitido
  if (allowedRoles && dataUser && !allowedRoles.includes(dataUser.role)) {
    // Redireciona para uma página de "acesso negado" ou para a home
    return <Navigate to="/unauthorized" replace />; // Exemplo: crie uma página /unauthorized
  }

  if(isLoadingData){
    return <LoadingDefault />
  }

  if(!userLoged && !isLoadingData ){
    return <Navigate to="/" replace />;
  }

  // Se tudo estiver ok, renderiza o conteúdo da rota filha
  if(!isLoadingData){
    return <Outlet />;
  }
};

export default ProtectedRoute;