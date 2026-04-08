import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/HomeAdminDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function HomeAdminDashboard() {
  const [roomReservations, setRoomReservations] = useState([]);
  const [tableReservations, setTableReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const formatDatePH = (dateValue) => {
    if (!dateValue) return "";

    const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (Number.isNaN(d.getTime())) return String(dateValue);

    return d.toLocaleDateString("en-PH", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatTimePH = (timeValue) => {
    if (!timeValue) return "";

    const str = String(timeValue);

    if (/^\d{2}:\d{2}(:\d{2})?$/.test(str)) {
      const d = new Date(`1970-01-01T${str}`);
      if (Number.isNaN(d.getTime())) return str;

      return d.toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    const d = new Date(str);
    if (Number.isNaN(d.getTime())) return str;

    return d.toLocaleTimeString("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [roomsRes, tablesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/admin/room-reservations`, {
            withCredentials: true,
          }),
          axios.get(`${API_BASE_URL}/api/admin/table-reservations`, {
            withCredentials: true,
          }),
        ]);

        setRoomReservations(roomsRes.data.reservations || []);
        setTableReservations(tablesRes.data.reservations || []);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load reservations. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusLabelAndClass = (paymentStatus) => {
    if (paymentStatus === "paid") {
      return {
        label: "Confirmed",
        className: "badge badge-confirmed",
      };
    }

    return {
      label: "Pending",
      className: "badge badge-pending",
    };
  };

  const matchesFilters = (item, type) => {
    if (statusFilter !== "all") {
      const statusFromPayment =
        item.payment_status === "paid" ? "confirmed" : "pending";
      if (statusFromPayment !== statusFilter) return false;
    }

    if (typeFilter !== "all") {
      if (typeFilter === "room" && type !== "room") return false;
      if (typeFilter === "table" && type !== "table") return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const text =
        [item.full_name, item.user_name, item.room_type, item.restaurant_name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase() || "";
      if (!text.includes(term)) return false;
    }

    return true;
  };

  const totalRoomReservations = roomReservations.length;
  const totalRoomConfirmed = roomReservations.filter(
    (r) => r.payment_status === "paid",
  ).length;

  const totalTableReservations = tableReservations.length;
  const totalTableConfirmed = tableReservations.filter(
    (r) => r.payment_status === "paid",
  ).length;

  if (loading) {
    return (
      <div className="admin-main">
        <p>Loading reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-main">
        <h1>Hotel Admin Dashboard</h1>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-main">
      {/* Header */}
      <div className="admin-header">
        <h1>Hotel Admin Dashboard</h1>
        <p>Monitor all room and table reservations in one view.</p>
      </div>

      {/* Summary Cards */}
      <div className="admin-summary">
        <div className="summary-card">
          <h3>Total Room Reservations</h3>
          <p className="summary-number">{totalRoomReservations}</p>
          <span className="summary-sub">Confirmed: {totalRoomConfirmed}</span>
        </div>

        <div className="summary-card">
          <h3>Total Table Reservations</h3>
          <p className="summary-number">{totalTableReservations}</p>
          <span className="summary-sub">Confirmed: {totalTableConfirmed}</span>
        </div>

        <div className="summary-card">
          <h3>Total Table Confirmed</h3>
          <p className="summary-number">{totalTableConfirmed}</p>
          <span className="summary-sub">Paid via PayMongo</span>
        </div>

        <div className="summary-card">
          <h3>Total Room Confirmed</h3>
          <p className="summary-number">{totalRoomConfirmed}</p>
          <span className="summary-sub">Paid via PayMongo</span>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="admin-filters">
        <input
          className="filter-input"
          placeholder="Search guest / room / table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
        </select>

        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Room &amp; Table</option>
          <option value="room">Room</option>
          <option value="table">Table</option>
        </select>
      </div>

      {/* Room Reservations */}
      <div className="table-card">
        <h2 className="table-title">Room Reservations</h2>

        <div className="table-responsive">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest Name</th>
                <th>Room Type</th>
                <th>Guests</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {roomReservations
                .filter((r) => matchesFilters(r, "room"))
                .map((res, index) => {
                  const { label, className } = getStatusLabelAndClass(
                    res.payment_status,
                  );
                  return (
                    <tr key={res.id}>
                      <td>{index + 1}</td>
                      <td>{res.full_name || res.user_name}</td>
                      <td>{res.room_type}</td>
                      <td>{res.guests}</td>
                      <td>{formatDatePH(res.reservation_date)}</td>
                      <td>{formatTimePH(res.reservation_time)}</td>

                      <td>
                        <span className={className}>{label}</span>
                      </td>
                    </tr>
                  );
                })}

              {roomReservations.filter((r) => matchesFilters(r, "room"))
                .length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No room reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Reservations */}
      <div className="table-card">
        <h2 className="table-title">Table Reservations</h2>

        <div className="table-responsive">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Guest Name</th>
                <th>Restaurant</th>
                <th>People</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {tableReservations
                .filter((t) => matchesFilters(t, "table"))
                .map((res, index) => {
                  const { label, className } = getStatusLabelAndClass(
                    res.payment_status,
                  );
                  return (
                    <tr key={res.id}>
                      <td>{index + 1}</td>
                      <td>{res.full_name || res.user_name}</td>
                      <td>{res.restaurant_name}</td>
                      <td>{res.guests}</td>
                      <td>{formatDatePH(res.reservation_date)}</td>
                      <td>{formatTimePH(res.reservation_time)}</td>

                      <td>
                        <span className={className}>{label}</span>
                      </td>
                    </tr>
                  );
                })}

              {tableReservations.filter((t) => matchesFilters(t, "table"))
                .length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    No table reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HomeAdminDashboard;
