import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [show, setIsShow] = useState(false);
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setIsShow(true);
  }, [user, navigate, isLoading]);
  return <>{show && children}</>;
}
