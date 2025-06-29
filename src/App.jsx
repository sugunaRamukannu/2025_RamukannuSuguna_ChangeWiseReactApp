import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoinDenominator from "./Components/CoinDenominator";
import Login from "./Components/Login";
import History from "./Components/History";
import PrivateRoute from "./Components/PrivateRoute";
import Navbar from "./Components/NavBar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path="/coins"
          element={
            <PrivateRoute>
              <CoinDenominator />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
