import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const {
    isAuthenticated,
    loading: isLoading,
    user,
    accessToken,
    setUser,
  } = useAuthStore();
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && accessToken && !user && !profileLoading) {
      setProfileLoading(true);
      rootApiService
        .get(API_ENDPOINTS.AUTH.PROFILE, {
          Authorization: `Bearer ${accessToken}`,
        })
        .then((profile) => {
          setUser(profile);
        })
        .catch(() => {})
        .finally(() => setProfileLoading(false));
    }
  }, [isAuthenticated, accessToken, user, setUser]);

  if (isLoading || profileLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div>Đang tải...</div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
