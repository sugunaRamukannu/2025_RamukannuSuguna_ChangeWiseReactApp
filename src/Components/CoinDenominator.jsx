import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CoinDenominator() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [target, setTarget] = useState("");
  const [denominations, setDenominations] = useState("");
  const [result, setResult] = useState([]);
  const [resultMsg, setResultMsg] = useState([]);
  const [error, setError] = useState(null);
  const allowed = [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50, 100, 1000];
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(target) == 0) {
      setResult([]);
      setResultMsg("No Coins Needed");
      return;
    }

    setResultMsg(null);

    let denoList = denominations.split(",").map((d) => d.trim());
    denoList = [...new Set(denoList)];
    const invalid = denoList.some((p) => !allowed.includes(parseFloat(p)));

    if (invalid) {
      setError("Invalid denominations. Use only: " + allowed.join(", "));
      return;
    }

    const query = new URLSearchParams();
    query.append("target", target);
    denoList.forEach((d) => query.append("denominations", d));

    let headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(
        `${apiUrl}/coin/denominate?${query.toString()}`,
        {
          headers: headers,
        }
      );

      console.log(response);
      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      console.log(data);
      setResult(data.coins || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch: " + err.message);
      setResult([]);
    }
  };

  const getCoinIcon = (coin) => {
    return "🪙";
  };

  const handleTargetAmountChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setTarget("");
      setError(null);
      return;
    }
    if (val.includes("-")) {
      setError("Minus sign is not allowed");
      return;
    }
    const num = Number(val);
    if (isNaN(num) || num < 0) {
      setError("Invalid number or negative value");
      return;
    }
    if (num > 10000) {
      setError("Target amount cannot be greater than 10,000");
      return;
    }
    setTarget(val);
    setError(null);
  };

  const handleDenominationsChange = (e) => {
    let val = e.target.value;
    while (val.includes(",,")) {
      val = val.split(",,").join(",");
    }

    for (let i = 0; i < val.length; i++) {
      const ch = val[i];
      if ((ch < "0" || ch > "9") && ch !== "." && ch !== ",") {
        setError("Only digits, commas, and decimal points allowed");
        return;
      }
    }

    const parts = val
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "");

    for (let part of parts) {
      if (part.split(".").length > 2) {
        setError("Invalid number format (multiple decimal points)");
        return;
      }
    }

    setDenominations(val);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <div
        className="card shadow-sm p-4"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">Cash Denominaton Calculator</h2>
          <button
            className="btn btn-outline-primary"
            onClick={() => navigate("/history")}
          >
            View History
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Target Amount:</label>
            <input
              type="text"
              className="form-control"
              value={target}
              onChange={handleTargetAmountChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              Denominations (comma-separated):
            </label>
            <input
              type="text"
              className="form-control"
              value={denominations}
              onChange={handleDenominationsChange}
              placeholder="e.g. 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 50, 100, 1000"
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid">
            <button className="btn btn-success" type="submit">
              Get Minimum Coins
            </button>
          </div>
        </form>

        {result.length > 0 && (
          <div className="mt-4">
            <h4 className="text-success"> Result:</h4>
            <ul className="list-group">
              {result.map((coin, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex align-items-center bg-white"
                >
                  <span className="me-2">{getCoinIcon(coin)}</span>
                  Coin: {coin}
                </li>
              ))}
            </ul>

            <p className="mt-2">
              <strong>Total Coins Used:</strong> {result.length}
            </p>
          </div>
        )}
        {resultMsg != null && (
          <p className="mt-2">
            <strong>{resultMsg}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default CoinDenominator;
