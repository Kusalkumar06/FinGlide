import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

export function ProtectedRoute({ children }) {
  const isUserLoggedIn = useSelector((state) => state.core.isUserLoggedIn);
  const isAuthInitialized = useSelector((state) => state.core.isAuthInitialized);

  if (!isAuthInitialized) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return isUserLoggedIn ? children : <Navigate to="/login" replace />;
}

export function PublicRoute({ children }) {
  const isUserLoggedIn = useSelector((state) => state.core.isUserLoggedIn);
  const isAuthInitialized = useSelector((state) => state.core.isAuthInitialized);

  if (!isAuthInitialized) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return isUserLoggedIn ? <Navigate to="/" replace /> : children;
}
