
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../styles/Reservation.css";

export default function Reservation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    type: "room",
    tableName: "",
    date: "",
    guests: 1,
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const prefill = JSON.parse(localStorage.getItem("reservationPrefill"));

    setForm((prev) => ({
      ...prev,
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      contact: currentUser?.contact || "",
      type: prefill?.type || "room",
      tableName: prefill?.tableName || "",
      guests: prefill?.guests || 1,
    }));

    localStorage.removeItem("reservationPrefill");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);

    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];
    reservations.push(form);
    localStorage.setItem("reservations", JSON.stringify(reservations));

    alert("Reservation submitted!\n" + JSON.stringify(form, null, 2));
  };

  return (
    <div className="reservation-container">
      <div className="reservation-overlay"></div>
      <div className="reservation-card">
        <h2 className="reservation-title">Luxury Reservation</h2>
        <p className="reservation-subtitle">
          Book your <span>room</span> or <span>table</span> with us
        </p>


        <button
          className="btn-back"
          onClick={() => navigate(-1)} 
        >
          ← Back
        </button>

        <form className="reservation-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
          <input type="tel" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} required />

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="room">Room Reservation</option>
            <option value="table">Table Reservation</option>
          </select>

          {form.type === "table" && form.tableName && (
            <input
              type="text"
              name="tableName"
              placeholder="Selected Table"
              value={form.tableName}
              readOnly
            />
          )}

          <input type="date" name="date" value={form.date} onChange={handleChange} required />
          <input type="number" name="guests" min="1" max="10" value={form.guests} onChange={handleChange} required />

          <button type="submit" className="btn-reserve">Reserve Now</button>
        </form>

        {submitted && (
          <p className="success-message">
            ✅ Thank you! Your reservation has been submitted successfully.
          </p>
        )}
      </div>
      <div className="select-rooms">
        <p>rooms</p>
      </div>
    </div>
  );
}
