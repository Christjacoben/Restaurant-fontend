import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../styles/Report.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Report() {
  const [roomPaid, setRoomPaid] = useState([]);
  const [tablePaid, setTablePaid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeType, setActiveType] = useState(null);
  const [selectedUserGroup, setSelectedUserGroup] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [roomRes, tableRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/room-reservations`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/api/admin/table-reservations`, {
            withCredentials: true,
          }),
        ]);

        const rooms = (roomRes.data?.reservations || []).filter(
          (r) => r.payment_status === "paid",
        );
        const tables = (tableRes.data?.reservations || []).filter(
          (t) => t.payment_status === "paid",
        );

        setRoomPaid(rooms);
        setTablePaid(tables);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load reservations. Make sure you are logged in as admin.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (value) => {
    if (!value) return "";
    try {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return value;
    }
  };

  const formatTime = (value) => {
    if (!value) return "";
    return value.toString().slice(0, 5);
  };

  const userGroups = useMemo(() => {
    const list =
      activeType === "room"
        ? roomPaid
        : activeType === "table"
          ? tablePaid
          : [];
    const map = new Map();
    list.forEach((item) => {
      const key = item.user_name || "Unknown User";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });

    return Array.from(map.entries()).map(([userName, items]) => ({
      userName,
      items,
    }));
  }, [activeType, roomPaid, tablePaid]);

  const closeUserModal = () => setSelectedUserGroup(null);

  const goBackToTypes = () => {
    setActiveType(null);
    setSelectedUserGroup(null);
  };

  const goToType = (type) => {
    setActiveType(type);
    setSelectedUserGroup(null);
  };

  const handlePrintUser = () => {
    if (!selectedUserGroup || !activeType) return;

    const { userName, items } = selectedUserGroup;
    const title =
      activeType === "room"
        ? `Paid Room Reservations for ${userName}`
        : `Paid Table Reservations for ${userName}`;

    const rowsHtml =
      activeType === "room"
        ? items
            .map(
              (r, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${r.room_type || ""}</td>
          <td>${formatDate(r.reservation_date)}</td>
          <td>${formatTime(r.reservation_time)}</td>
          <td>${r.guests ?? ""}</td>
          <td>${r.full_name ?? ""}</td>
          <td>${r.phone_number ?? ""}</td>
          <td>${r.email ?? ""}</td>
        </tr>
      `,
            )
            .join("")
        : items
            .map(
              (t, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${t.restaurant_name || ""}</td>
          <td>${formatDate(t.reservation_date)}</td>
          <td>${formatTime(t.reservation_time)}</td>
          <td>${t.guests ?? ""}</td>
          <td>${t.full_name ?? ""}</td>
          <td>${t.phone_number ?? ""}</td>
          <td>${t.email ?? ""}</td>
          <td>${
            t.menu_total != null ? "₱" + Number(t.menu_total).toFixed(2) : ""
          }</td>
        </tr>
      `,
            )
            .join("");

    const headerHtml =
      activeType === "room"
        ? `
          <tr>
            <th>#</th>
            <th>Room Type</th>
            <th>Date</th>
            <th>Time</th>
            <th>Guests</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        `
        : `
          <tr>
            <th>#</th>
            <th>Restaurant</th>
            <th>Date</th>
            <th>Time</th>
            <th>Guests</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Menu Total</th>
          </tr>
        `;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 8px; font-size: 12px; }
          th { background: #f0f0f0; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <table>
          <thead>
            ${headerHtml}
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="report-page">
        <p>Loading report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-page">
        <p className="report-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="report-page">
      <h1 className="report-title">Paid Reservations</h1>
      <p className="report-subtitle">
        {activeType
          ? "Select a user to view their paid reservations."
          : "Select a category to view and print."}
      </p>

      {/* STEP 1: choose type */}
      {!activeType && (
        <div className="report-card-grid">
          <div className="report-card" onClick={() => goToType("room")}>
            <h2>Room Reservations</h2>
            <p className="report-count">{roomPaid.length} paid record(s)</p>
            <p className="report-card-desc">
              View all paid reservations for rooms.
            </p>
          </div>

          <div className="report-card" onClick={() => goToType("table")}>
            <h2>Table Reservations</h2>
            <p className="report-count">{tablePaid.length} paid record(s)</p>
            <p className="report-card-desc">
              View all paid reservations for tables.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: user list for chosen type */}
      {activeType && (
        <div className="report-user-section">
          <button className="report-back-btn" onClick={goBackToTypes}>
            ← Back to categories
          </button>

          <h2 className="report-user-title">
            {activeType === "room"
              ? "Room Reservations (Paid) – by User"
              : "Table Reservations (Paid) – by User"}
          </h2>

          {userGroups.length === 0 ? (
            <p>No paid reservations for this category.</p>
          ) : (
            <div className="report-user-grid">
              {userGroups.map((group) => (
                <div
                  key={group.userName}
                  className="report-user-card"
                  onClick={() => setSelectedUserGroup(group)}
                >
                  <h3>{group.userName}</h3>
                  <p>{group.items.length} paid reservation(s)</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: modal per user */}
      {activeType && selectedUserGroup && (
        <div className="report-modal-backdrop" onClick={closeUserModal}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header">
              <h2>
                {activeType === "room"
                  ? "Paid Room Reservations for "
                  : "Paid Table Reservations for "}
                {selectedUserGroup.userName}
              </h2>
              <button className="report-modal-close" onClick={closeUserModal}>
                ×
              </button>
            </div>

            <div className="report-modal-actions">
              <button className="report-print-btn" onClick={handlePrintUser}>
                Print
              </button>
            </div>

            <div className="report-table-wrapper">
              {activeType === "room" ? (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Room Type</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Guests</th>
                      <th>Full Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserGroup.items.map((r, index) => (
                      <tr key={r.id}>
                        <td>{index + 1}</td>
                        <td>{r.room_type}</td>
                        <td>{formatDate(r.reservation_date)}</td>
                        <td>{formatTime(r.reservation_time)}</td>
                        <td>{r.guests}</td>
                        <td>{r.full_name}</td>
                        <td>{r.phone_number}</td>
                        <td>{r.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Restaurant</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Guests</th>
                      <th>Full Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Menu Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserGroup.items.map((t, index) => (
                      <tr key={t.id}>
                        <td>{index + 1}</td>
                        <td>{t.restaurant_name}</td>
                        <td>{formatDate(t.reservation_date)}</td>
                        <td>{formatTime(t.reservation_time)}</td>
                        <td>{t.guests}</td>
                        <td>{t.full_name}</td>
                        <td>{t.phone_number}</td>
                        <td>{t.email}</td>
                        <td>
                          {t.menu_total != null
                            ? `₱${Number(t.menu_total).toFixed(2)}`
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
