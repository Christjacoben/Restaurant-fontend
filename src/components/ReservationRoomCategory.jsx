import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ReservationRoomCategory.css";

const API_URL = import.meta.env.VITE_API_URL;

function ReservationRoomCategory() {
  const [roomReservations, setRoomReservations] = useState([]);
  const [tableReservations, setTableReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rescheduleModal, setRescheduleModal] = useState({
    open: false,
    type: null,
    reservation: null,
    newDate: "",
    newTime: "",
  });

  useEffect(() => {
    const fetchReservations = async () => {
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

        setRoomReservations(roomRes.data?.reservations || []);
        setTableReservations(tableRes.data?.reservations || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Failed to load reservations. Make sure you are logged in.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
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
    try {
      const d = new Date(`1970-01-01T${value}`);
      if (Number.isNaN(d.getTime())) return value.toString().slice(0, 5);
      return d.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return value.toString().slice(0, 5);
    }
  };

  const getStatusLabel = (paymentStatus) => {
    if (paymentStatus === "paid") return "Confirmed";
    return "Pending";
  };

  const getStatusClass = (paymentStatus) => {
    if (paymentStatus === "paid") return "status-badge status-confirmed";
    return "status-badge status-pending";
  };

  const openReschedule = (type, reservation) => {
    setRescheduleModal({
      open: true,
      type,
      reservation,
      newDate: reservation.reservation_date || "",
      newTime: reservation.reservation_time || "",
    });
  };

  const closeReschedule = () => {
    setRescheduleModal({
      open: false,
      type: null,
      reservation: null,
      newDate: "",
      newTime: "",
    });
  };

  const handleRescheduleSave = async () => {
    const { type, reservation, newDate, newTime } = rescheduleModal;
    if (!type || !reservation) return;

    if (!newDate || !newTime) {
      alert("Please select new date and time.");
      return;
    }

    try {
      const url =
        type === "room"
          ? `${API_URL}/api/admin/room-reservations/${reservation.id}`
          : `${API_URL}/api/admin/table-reservations/${reservation.id}`;

      await axios.put(
        url,
        {
          reservation_date: newDate,
          reservation_time: newTime,
        },
        { withCredentials: true },
      );

      if (type === "room") {
        setRoomReservations((prev) =>
          prev.map((r) =>
            r.id === reservation.id
              ? { ...r, reservation_date: newDate, reservation_time: newTime }
              : r,
          ),
        );
      } else {
        setTableReservations((prev) =>
          prev.map((t) =>
            t.id === reservation.id
              ? { ...t, reservation_date: newDate, reservation_time: newTime }
              : t,
          ),
        );
      }

      closeReschedule();
      alert("Reservation rescheduled successfully (assuming backend is set).");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to reschedule. Make sure the backend PUT route exists.",
      );
    }
  };

 // Handle confirm payment - updates payment_status to 'paid' for a specific reservation
  const handleConfirmPayment = async (reservationId) => {
    // Confirm action with admin before proceeding
    if (
      !window.confirm(
        "Are you sure you want to confirm this reservation payment?",
      )
    ) {
      return;
    }

    try {
      // Call backend API endpoint to update payment_status to 'paid'
      await axios.put(
        `${API_URL}/api/admin/table-reservations/${reservationId}/confirm`,
        {},
        { withCredentials: true },
      );

      // Update the local state to reflect the payment status change immediately
      setTableReservations((prev) =>
        prev.map((t) =>
          t.id === reservationId ? { ...t, payment_status: "paid" } : t,
        ),
      );

      alert("Payment confirmed successfully!");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to confirm payment. Please try again.",
      );
    }
  };

  
  if (loading) {
    return (
      <div className="reservation-category">
        <p>Loading reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservation-category">
        <p className="reservation-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="reservation-category">
      {/* ROOM TABLE */}
      <div className="reservation-card-card">
        <h2 className="reservation-card-title">Room Reservations</h2>
        <div className="reservation-table-wrapper">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {roomReservations.length === 0 && (
                <tr>
                  <td colSpan="8" className="reservation-empty">
                    No room reservations yet.
                  </td>
                </tr>
              )}
              {roomReservations.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>{r.full_name}</td>
                  <td>{r.room_type}</td>
                  <td>{r.guests}</td>
                  <td>{formatDate(r.reservation_date)}</td>
                  <td>{formatTime(r.reservation_time)}</td>
                  <td>
                    <span className={getStatusClass(r.payment_status)}>
                      {getStatusLabel(r.payment_status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="reservation-btn-reschedule"
                      onClick={() => openReschedule("room", r)}
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE RESERVATIONS TABLE */}
       <div className="reservation-card-card">
        <h2 className="reservation-card-title">Table Reservations</h2>
        <div className="reservation-table-wrapper">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tableReservations.length === 0 && (
                <tr>
                  <td colSpan="8" className="reservation-empty">
                    No table reservations yet.
                  </td>
                </tr>
              )}
              {tableReservations.map((t, index) => (
                <tr key={t.id}>
                  <td>{index + 1}</td>
                  <td>{t.full_name}</td>
                  <td>{t.restaurant_name}</td>
                  <td>{t.guests}</td>
                  <td>{formatDate(t.reservation_date)}</td>
                  <td>{formatTime(t.reservation_time)}</td>
                  <td>
                    <span className={getStatusClass(t.payment_status)}>
                      {getStatusLabel(t.payment_status)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="reservation-btn-reschedule"
                      onClick={() => openReschedule("table", t)}
                    >
                      Reschedule
                    </button>
                    {/* Confirm button - only show if payment status is not already paid */}
                    {t.payment_status !== "paid" && (
                      <button
                        className="reservation-btn-confirm"
                        onClick={() => handleConfirmPayment(t.id)}
                        style={{ marginLeft: "8px" }}
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESCHEDULE MODAL */}
      {rescheduleModal.open && (
        <div className="reschedule-backdrop" onClick={closeReschedule}>
          <div
            className="reschedule-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="reschedule-header">
              <h3>
                Reschedule {rescheduleModal.type === "room" ? "Room" : "Table"}{" "}
                Reservation
              </h3>
              <button className="reschedule-close" onClick={closeReschedule}>
                ×
              </button>
            </div>

            <div className="reschedule-body">
              <label>
                New Date
                <input
                  type="date"
                  value={rescheduleModal.newDate}
                  onChange={(e) =>
                    setRescheduleModal((prev) => ({
                      ...prev,
                      newDate: e.target.value,
                    }))
                  }
                />
              </label>
              <label>
                New Time
                <input
                  type="time"
                  value={rescheduleModal.newTime}
                  onChange={(e) =>
                    setRescheduleModal((prev) => ({
                      ...prev,
                      newTime: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="reschedule-footer">
              <button
                className="reschedule-btn cancel"
                onClick={closeReschedule}
              >
                Cancel
              </button>
              <button
                className="reschedule-btn save"
                onClick={handleRescheduleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservationRoomCategory;
