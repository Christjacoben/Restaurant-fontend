import React, { useRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import RoomImg from "../assets/roomIMG.svg";
import singleRoom from "../assets/center-single-bed.svg";
import doubleRoom from "../assets/center-double-bed.svg";
import familySize from "../assets/center-family-size.svg";
import "../styles/UserRoomReservation.css";

const EMPTY_FORM = {
  guests: "",
  date: "",
  time: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  specialRequests: "",
};

function UserRoomReservation() {
  const [makeReservation, setMakeReservation] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reservedDates, setReservedDates] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const roomTypesRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const formatDate = (value) =>
    value ? new Date(value).toISOString().split("T")[0] : "";

  useEffect(() => {
    let ignore = false;
    axios
      .get(`${API_URL}/api/room-reservations/dates`)
      .then(({ data }) => {
        if (!ignore && Array.isArray(data?.dates)) {
          setReservedDates(data.dates);
        }
      })
      .catch((err) => console.error("Unable to load reserved dates", err));
    return () => {
      ignore = true;
    };
  }, [API_URL]);

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API_URL}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        console.log("User data:", res.data);
        if (mounted) {
          setUser(res.data.user);
        }
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoadingUser(false);
      });
    return () => {
      mounted = false;
    };
  }, [API_URL]);

  const handleScrollToRoomTypes = () => {
    roomTypesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMakeReservationClick = (roomLabel) => {
    setSelectedRoom(roomLabel);
    setMakeReservation(true);
    setStatusMessage("");
  };

  const handleCloseReservation = () => {
    setMakeReservation(false);
    setSelectedRoom(null);
    setFormData(EMPTY_FORM);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setStatusMessage("Please login to make a reservation.");
      return;
    }
    if (!selectedRoom) {
      setStatusMessage("Select a room type before submitting.");
      return;
    }
    try {
      setSubmitting(true);
      setStatusMessage("");
      await axios.post(
        `${API_URL}/api/room-reservations`,
        {
          roomType: selectedRoom,
          guests: Number(formData.guests),
          date: formData.date,
          time: formData.time,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          specialRequests: formData.specialRequests,
        },
        { withCredentials: true },
      );
      setStatusMessage("Reservation submitted! We'll get back to you soon.");
      handleCloseReservation();
    } catch (error) {
      setStatusMessage(
        error.response?.data?.message ||
          "There was a problem saving your reservation.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="room-section">
      <section className="room-hero">
        <div className="room-hero-overlay" />
        <img src={RoomImg} alt="room" className="room-hero-bg" />
        <div className="room-hero-content">
          <h1>Stay in Comfort and Style</h1>
          <p>
            Relax in our beautifully designed rooms that combine luxury, warmth,
            and modern elegance for your perfect getaway.
          </p>

          <button className="btn-reserve" onClick={handleScrollToRoomTypes}>
            Make a Reservation
          </button>
        </div>
      </section>

      <div className="room-info">
        <h2>Our Rooms</h2>
        <p>
          Discover the comfort and elegance of our beautifully designed rooms.
          Each one offers modern amenities, serene ambiance, and unmatched
          hospitality — perfect for relaxation or business stays.
        </p>
      </div>

      <div className="room-types" ref={roomTypesRef}>
        {!loadingUser && !user && (
          <p className="reservation-login-hint">
            You need to login to complete a reservation.
          </p>
        )}
        <div
          className="room-type-card"
          onClick={() => handleMakeReservationClick("Single Bed")}
        >
          <div className="room-image-card">
            <img src={singleRoom} alt="singeRoom" />
          </div>
          <h3>Single Bed</h3>
          <p>Perfect for solo travelers seeking comfort and privacy.</p>
        </div>
        <div
          className="room-type-card"
          onClick={() => handleMakeReservationClick("Double Bed")}
        >
          <div className="room-image-card">
            <img src={doubleRoom} alt="doubleRoom" />
          </div>
          <h3>Double Bed</h3>
          <p>
            Ideal for couples or friends enjoying a luxurious stay together.
          </p>
        </div>
        <div
          className="room-type-card"
          onClick={() => handleMakeReservationClick("Family Size Bed")}
        >
          <div className="room-image-card">
            <img src={familySize} alt="familySize" />
          </div>
          <h3>Family Size Bed</h3>
          <p>Spacious and cozy, crafted for families who value togetherness.</p>
        </div>
        {selectedRoom && makeReservation && (
          <div className="make-reservation">
            <div className="reservation-card">
              <button
                className="reservation-close"
                type="button"
                onClick={handleCloseReservation}
              >
                x
              </button>

              <h2 className="reservation-title">BOOK YOUR ROOM</h2>
              <p className="reservation-selected">{selectedRoom}</p>
              {statusMessage && (
                <p className="reservation-status">{statusMessage}</p>
              )}
              <form
                className="reservation-form"
                onSubmit={handleReservationSubmit}
              >
                {/* Row: Guests + Date */}
                <div className="reservation-row">
                  <div className="reservation-field">
                    <label>Number of Guests *</label>
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      value={formData.guests}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="reservation-field">
                    <label>Date *</label>
                    <DatePicker
                      selected={formData.date ? new Date(formData.date) : null}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: formatDate(value),
                        }))
                      }
                      minDate={new Date()}
                      filterDate={(date) =>
                        !reservedDates.includes(formatDate(date))
                      }
                      dayClassName={(date) =>
                        reservedDates.includes(formatDate(date))
                          ? "reserved-day"
                          : undefined
                      }
                      required
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="reservation-field">
                  <label>Time *</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled hidden>
                      Select Time
                    </option>
                    <option value="20:00">8:00 PM</option>
                    <option value="21:00">9:00 PM</option>
                    <option value="22:00">10:00 PM</option>
                    <option value="23:00">11:00 PM</option>
                    <option value="00:00">12:00 AM</option>
                    <option value="01:00">1:00 AM</option>
                    <option value="02:00">2:00 AM</option>
                    <option value="03:00">3:00 AM</option>
                    <option value="04:00">4:00 AM</option>
                    <option value="05:00">5:00 AM</option>
                    <option value="06:00">6:00 AM</option>
                    <option value="07:00">7:00 AM</option>
                    <option value="08:00">8:00 AM</option>
                  </select>
                </div>

                {/* Full name */}
                <div className="reservation-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Row: Email + Phone */}
                <div className="reservation-row">
                  <div className="reservation-field">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="reservation-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Special requests */}
                <div className="reservation-field">
                  <label>Special Requests (Allergies, Seating, etc.)</label>
                  <textarea
                    name="specialRequests"
                    rows={3}
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="reservation-submit"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "CONFIRM RESERVATION"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserRoomReservation;
