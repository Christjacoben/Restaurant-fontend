import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminReservations.css";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("reservations")) || [];
    setReservations(saved);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = reservations.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    setReservations(updated);
    localStorage.setItem("reservations", JSON.stringify(updated));
  };

  const deleteReservation = (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      const updated = reservations.filter((r) => r.id !== id);
      setReservations(updated);
      localStorage.setItem("reservations", JSON.stringify(updated));
    }
  };


  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      (r.user?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.itemName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.date || "").includes(search);
    const matchesFilter = filter === "all" || r.status === filter;
    return matchesSearch && matchesFilter;
  });


  const total = reservations.length;
  const pending = reservations.filter((r) => r.status === "pending").length;
  const accepted = reservations.filter((r) => r.status === "accepted").length;
  const declined = reservations.filter((r) => r.status === "declined").length;

  return (
    <div className="admin-container">

      <button className="btn back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <h2>📋 Manage Reservations</h2>


      <div className="stats-container">
        <div className="stat-card">Total: {total}</div>
        <div className="stat-card pending">Pending: {pending}</div>
        <div className="stat-card accepted">Accepted: {accepted}</div>
        <div className="stat-card declined">Declined: {declined}</div>
      </div>


      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search by user, item, or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {filteredReservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Item</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((r, index) => (
              <tr key={r.id || index}>
                <td>{r.user || "Unknown"}</td>
                <td>{r.type || "-"}</td>
                <td>{r.itemName || "-"}</td>
                <td>{r.date || "-"}</td>
                <td>{r.time || "-"}</td>
                <td>
                  <span className={`status ${r.status}`}>{r.status}</span>
                </td>
                <td>
                  {r.status === "pending" && (
                    <>
                      <button
                        className="btn accept"
                        disabled={r.status !== "pending"}
                        onClick={() => updateStatus(r.id, "accepted")}
                      >
                        ✅ Accept
                      </button>
                      <button
                        className="btn decline"
                        disabled={r.status !== "pending"}
                        onClick={() => updateStatus(r.id, "declined")}
                      >
                        ❌ Decline
                      </button>
                    </>
                  )}
                  <button
                    className="btn delete"
                    onClick={() => deleteReservation(r.id)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
