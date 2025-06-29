import { Navigate } from "react-router-dom";
import { isTokenExpired } from "./Auth";

function PrivateRoute({ children }) {
  return !isTokenExpired() ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
