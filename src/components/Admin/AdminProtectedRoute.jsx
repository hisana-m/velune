
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminProtectedRoute({ children }) {
  const { user, isLoggedIn } = useSelector(
    (state) => state.auth
  );

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
