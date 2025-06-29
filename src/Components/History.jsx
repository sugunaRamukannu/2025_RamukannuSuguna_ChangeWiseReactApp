import React, { useEffect, useState } from "react";

function History() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  let headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetch(`${apiUrl}/history`, {
      headers: headers,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })

      .then((data) => {
        console.log(data);
        setData(data || []);
      })
      .catch((err) => setError(" Failed to load history"));
  }, []);

  return (
    <div className="container mt-4">
      <h3>🔎 Your History</h3>
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group">
        {data.map((entry, i) => (
          <li key={i} className="list-group-item">
            Target: {entry.targetAmount}
            <br /> Denominations: {entry.denominations} <br /> Result:{" "}
            {entry.result}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default History;
