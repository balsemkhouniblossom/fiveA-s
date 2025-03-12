import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoutes = ({ allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLogedIn") === "true"; 
      const role = localStorage.getItem("role");

      console.log("🔍 Vérification Auth : ", isLoggedIn, role); 

      setIsAuthenticated(isLoggedIn);
      setUserRole(role);
      setLoading(false);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  if (loading || isAuthenticated === null) {
    return <p>Chargement...</p>;
  }

  if (!isAuthenticated) {
    console.warn("🚫 Utilisateur non authentifié");
    return <Navigate to="/" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    console.warn("🚫 Accès refusé pour le rôle :", userRole);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
