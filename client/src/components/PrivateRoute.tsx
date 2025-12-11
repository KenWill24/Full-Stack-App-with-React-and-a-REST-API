import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  // If user is logged in → allow access
  if (user) {
    return <Outlet />;
  }

  // If user NOT logged in → redirect to Sign In
  return <Navigate to="/signin" replace />;
};

export default PrivateRoute;