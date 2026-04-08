import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserReservations.css";

const formatDateDisplay = (value) => {
  if (!value) return "No date selected yet";
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTimeDisplay = (value) => {
  if (!value) return "No time selected";
  return value.slice(0, 5);
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "PHP",
  });

const ROOM_PRICES = {
  "Single Bed": 500,
  "Double Bed": 2000,
  "Family Size Bed": 4000,
};

const normalizeMenu = (menu) => {
  if (Array.isArray(menu)) return menu;
  if (!menu) return [];
  try {
    return JSON.parse(menu);
  } catch {
    return [];
  }
};

const getRoomPrice = (roomType) =>
  ROOM_PRICES[roomType] !== undefined ? ROOM_PRICES[roomType] : null;

const isReservationPaid = (reservation) =>
  reservation?.payment_status === "paid" ||
  (reservation?.payment?.status || "").toLowerCase() === "paid";

const renderFeedbackStars = (rating) => {
  if (!rating) return null;
  return (
    <div className="feedback-stars-display">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`feedback-star-display ${star <= rating ? "rated" : ""}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

function UserReservations() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [roomReservations, setRoomReservations] = useState([]);
  const [tableReservations, setTableReservations] = useState([]);
  const [menuSelections, setMenuSelections] = useState([]);
  const [menuPayments, setMenuPayments] = useState({});
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState({});

  const loadReservations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [roomRes, tableRes, menuRes, paymentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/room-reservations`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}/api/table-reservations`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}/api/menu-selections`, {
          withCredentials: true,
        }),
        axios
          .get(`${API_URL}/api/payments/menu`, {
            withCredentials: true,
          })
          .catch(() => ({ data: [] })),
      ]);

      setRoomReservations(roomRes.data?.reservations || []);
      setTableReservations(tableRes.data?.reservations || []);
      setMenuSelections(menuRes.data || []);

      const paymentsMap = {};
      (paymentsRes.data || []).forEach((payment) => {
        paymentsMap[payment.menu_selection_id] = payment;
      });
      setMenuPayments(paymentsMap);
    } catch (err) {
      const status = err.response?.status;
      const fallback =
        status === 401
          ? "Please login to see your reservations."
          : err.response?.data?.message || "Unable to load reservations.";
      setError(fallback);
      setRoomReservations([]);
      setTableReservations([]);
      setMenuSelections([]);
      setMenuPayments({});
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const openDetails = (type, reservation) => {
    setModalData({ type, reservation });
  };

  const closeDetails = () => {
    setModalData(null);
  };

  const toggleFeedback = (cardKey) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const handlePayment = async (type, reservationId) => {
    setPaymentError("");
    setPaymentSuccess("");
    const actionId = `${type}-${reservationId}`;
    setPayingId(actionId);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/payments/paymongo`,
        {
          reservationId,
          reservationType: type,
        },
        { withCredentials: true },
      );

      if (data?.checkoutUrl && data?.checkoutId) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Missing checkout link from server.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to start payment.";
      setPaymentError(message);
      setPayingId(null);
    }
  };

  const handlePaymentMenu = async (menuSelectionId) => {
    setPaymentError("");
    setPaymentSuccess("");
    const actionId = `menu-${menuSelectionId}`;
    setPayingId(actionId);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/payments/menu`,
        {
          menuSelectionId,
        },
        { withCredentials: true },
      );

      if (data?.checkoutUrl && data?.checkoutId) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Missing checkout link from server.");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to start payment.";
      setPaymentError(message);
      setPayingId(null);
    }
  };

  const handleConfirmPayment = async (type, reservation) => {
    setPaymentError("");
    setPaymentSuccess("");

    const key = `${type}-${reservation.id}`;
    const checkoutSessionId = reservation.payment?.checkout_id;

    if (!checkoutSessionId) {
      setPaymentError(
        "No payment session found for this reservation. Please try paying again.",
      );
      return;
    }

    setConfirmingId(key);
    try {
      await axios.post(
        `${API_URL}/api/payments/paymongo/confirm`,
        { checkoutSessionId },
        { withCredentials: true },
      );
      setPaymentSuccess("Payment confirmed successfully.");
      await loadReservations();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to confirm payment.";
      setPaymentError(message);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleConfirmMenuPayment = async (menuSelectionId) => {
    setPaymentError("");
    setPaymentSuccess("");

    const key = `menu-${menuSelectionId}`;

    setConfirmingId(key);
    try {
      const paymentsRes = await axios.get(`${API_URL}/api/payments/menu`, {
        withCredentials: true,
      });

      const menuPayment = paymentsRes.data.find(
        (p) => p.menu_selection_id === menuSelectionId,
      );

      if (!menuPayment || !menuPayment.checkout_id) {
        console.error("Payment not found or missing checkout_id:", menuPayment);
        setPaymentError("Payment session not found. Please try paying again.");
        setConfirmingId(null);
        return;
      }

      console.log(
        "Confirming with checkoutSessionId:",
        menuPayment.checkout_id,
      );
      await axios.post(
        `${API_URL}/api/payments/menu/confirm`,
        { checkoutSessionId: menuPayment.checkout_id },
        { withCredentials: true },
      );
      setPaymentSuccess("Payment confirmed successfully.");
      await loadReservations();
    } catch (err) {
      console.error(
        "Confirm payment error:",
        err.response?.data || err.message,
      );
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to confirm payment.";
      setPaymentError(message);
    } finally {
      setConfirmingId(null);
    }
  };

  const openFeedbackModal = (type, reservation) => {
    setFeedbackModal({ type, reservation });
    setFeedbackRating(reservation.feedback_rating || 0);
    setFeedbackComment(reservation.feedback_comment || "");
  };

  const closeFeedbackModal = () => {
    setFeedbackModal(null);
    setFeedbackRating(0);
    setFeedbackComment("");
  };

  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0) {
      setPaymentError("Please select a rating");
      return;
    }

    setSubmittingFeedback(true);
    try {
      const endpoint =
        feedbackModal.type === "room"
          ? "room"
          : feedbackModal.type === "table"
            ? "table"
            : "menu";

      const data = {
        rating: feedbackRating,
        comment: feedbackComment,
      };

      if (feedbackModal.type === "menu") {
        data.menuSelectionId = feedbackModal.reservation.id;
      } else {
        data.reservationId = feedbackModal.reservation.id;
      }

      await axios.post(`${API_URL}/api/feedback/${endpoint}`, data, {
        withCredentials: true,
      });

      setPaymentSuccess("Thank you for your feedback!");
      setPaymentError("");
      closeFeedbackModal();
      await loadReservations();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to submit feedback";
      setPaymentError(message);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handlePrintReceipt = (type, reservation) => {
    if (type === "menu") {
      const payment = menuPayments[reservation.id];
      if (
        !reservation ||
        !payment ||
        payment.status?.toLowerCase() !== "paid"
      ) {
        setPaymentError(
          "Receipt is available only after payment is confirmed.",
        );
        return;
      }

      const amountValue =
        payment.amount || Number(reservation.total_amount || 0);
      const printableAmount = formatCurrency(amountValue || 0);
      const paymentDate = payment.created_at
        ? new Date(payment.created_at).toLocaleString()
        : new Date().toLocaleString();
      const reference = payment.checkout_id || `MENU-${reservation.id}`;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Menu Order Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
              h1 { text-align: center; margin-bottom: 1rem; }
              h2 { margin-top: 2rem; margin-bottom: 0.75rem; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
              td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; }
              td.label { font-weight: 600; width: 35%; }
              .amount { font-size: 1.25rem; font-weight: 700; text-align: right; }
              .footer { text-align: center; font-size: 0.9rem; margin-top: 2rem; color: #475569; }
            </style>
          </head>
          <body>
            <h1>Payment Receipt</h1>
            <div class="amount">${printableAmount}</div>
            <h2>Order Details</h2>
            <table>
              <tr><td class="label">Order Type</td><td>Menu Order</td></tr>
              <tr><td class="label">Order Date</td><td>${formatDateDisplay(
                reservation.created_at.split("T")[0],
              )}</td></tr>
              <tr><td class="label">Items</td><td>${
                reservation.selected_menu?.length || 0
              }</td></tr>
            </table>

            <h2>Payment Details</h2>
            <table>
              <tr><td class="label">Status</td><td>Paid</td></tr>
              <tr><td class="label">Reference</td><td>${reference}</td></tr>
              <tr><td class="label">Payment Date</td><td>${paymentDate}</td></tr>
              <tr><td class="label">Provider</td><td>${
                payment.provider || "PayMongo"
              }</td></tr>
            </table>
            <div class="footer">Thank you for your order!</div>
          </body>
        </html>
      `;

      const invoiceWindow = window.open("", "_blank", "width=720,height=900");
      if (!invoiceWindow) {
        setPaymentError("Please enable pop-ups to print the receipt.");
        return;
      }
      invoiceWindow.document.write(html);
      invoiceWindow.document.close();
      invoiceWindow.focus();
      setTimeout(() => {
        invoiceWindow.print();
      }, 300);
      return;
    }

    if (!reservation || !isReservationPaid(reservation)) {
      setPaymentError("Receipt is available only after payment is confirmed.");
      return;
    }

    const payment = reservation.payment || {};
    const amountValue =
      payment.amount ||
      (type === "room"
        ? getRoomPrice(reservation.room_type)
        : Number(reservation.menu_total || 0));
    const printableAmount = formatCurrency(amountValue || 0);
    const paymentDate = payment.created_at
      ? new Date(payment.created_at).toLocaleString()
      : new Date().toLocaleString();
    const reference = payment.checkout_id || `RES-${type}-${reservation.id}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Reservation Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
            h1 { text-align: center; margin-bottom: 1rem; }
            h2 { margin-top: 2rem; margin-bottom: 0.75rem; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
            td { padding: 8px 6px; border-bottom: 1px solid #e2e8f0; }
            td.label { font-weight: 600; width: 35%; }
            .amount { font-size: 1.25rem; font-weight: 700; text-align: right; }
            .footer { text-align: center; font-size: 0.9rem; margin-top: 2rem; color: #475569; }
          </style>
        </head>
        <body>
          <h1>Payment Receipt</h1>
          <div class="amount">${printableAmount}</div>
          <h2>Reservation Details</h2>
          <table>
            <tr><td class="label">Reservation Type</td><td>${
              type === "room" ? "Room" : "Table"
            }</td></tr>
            <tr><td class="label">${
              type === "room" ? "Room Type" : "Restaurant"
            }</td><td>${
              type === "room"
                ? reservation.room_type
                : reservation.restaurant_name
            }</td></tr>
            <tr><td class="label">Date</td><td>${formatDateDisplay(
              reservation.reservation_date ||
                reservation.check_in ||
                reservation.created_at,
            )}</td></tr>
            <tr><td class="label">Time</td><td>${formatTimeDisplay(
              reservation.reservation_time,
            )}</td></tr>
            <tr><td class="label">Guests</td><td>${
              reservation.guests || 0
            }</td></tr>
            <tr><td class="label">Reserved For</td><td>${
              reservation.full_name || reservation.user_name || "N/A"
            }</td></tr>
          </table>

          <h2>Payment Details</h2>
          <table>
            <tr><td class="label">Status</td><td>Paid</td></tr>
            <tr><td class="label">Reference</td><td>${reference}</td></tr>
            <tr><td class="label">Payment Date</td><td>${paymentDate}</td></tr>
            <tr><td class="label">Provider</td><td>${
              payment.provider || "PayMongo"
            }</td></tr>
          </table>
          <div class="footer">Thank you for your reservation!</div>
        </body>
      </html>
    `;

    const invoiceWindow = window.open("", "_blank", "width=720,height=900");
    if (!invoiceWindow) {
      setPaymentError("Please enable pop-ups to print the receipt.");
      return;
    }
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
    invoiceWindow.focus();
    setTimeout(() => {
      invoiceWindow.print();
    }, 300);
  };

  const renderRoomDetails = (reservation) => {
    const price = getRoomPrice(reservation.room_type);

    return (
      <div className="reservation-details">
        <dl>
          <div>
            <dt>Room Type</dt>
            <dd>{reservation.room_type}</dd>
          </div>
          <div>
            <dt>Guests</dt>
            <dd>{reservation.guests || 0}</dd>
          </div>
          {price !== null && (
            <div>
              <dt>Price</dt>
              <dd>{formatCurrency(price)}</dd>
            </div>
          )}
          {(reservation.check_in || reservation.reservation_date) && (
            <div>
              <dt>Reservation Date</dt>
              <dd>
                {formatDateDisplay(
                  reservation.check_in || reservation.reservation_date,
                )}
              </dd>
            </div>
          )}
          {(reservation.check_out || reservation.reservation_time) && (
            <div>
              <dt>
                {reservation.check_out ? "Check Out" : "Reservation Time"}
              </dt>
              <dd>
                {reservation.check_out
                  ? formatDateDisplay(reservation.check_out)
                  : formatTimeDisplay(reservation.reservation_time)}
              </dd>
            </div>
          )}
          <div>
            <dt>Reserved By</dt>
            <dd>{reservation.full_name || "Not provided"}</dd>
          </div>
          {reservation.email && (
            <div>
              <dt>Email</dt>
              <dd>{reservation.email}</dd>
            </div>
          )}
          {reservation.phone_number && (
            <div>
              <dt>Phone</dt>
              <dd>{reservation.phone_number}</dd>
            </div>
          )}
          <div>
            <dt>Status</dt>
            <dd>{reservation.payment_status || "Pending"}</dd>
          </div>
          {reservation.special_requests && (
            <div className="reservation-note">
              <dt>Special Requests</dt>
              <dd>{reservation.special_requests}</dd>
            </div>
          )}
        </dl>
      </div>
    );
  };

  const renderTableDetails = (reservation) => {
    const selectedMenu = normalizeMenu(reservation.selected_menu);

    return (
      <div className="reservation-details">
        <dl>
          <div>
            <dt>Guests</dt>
            <dd>{reservation.guests || 0}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{formatTimeDisplay(reservation.reservation_time)}</dd>
          </div>
          <div>
            <dt>Reserved By</dt>
            <dd>{reservation.full_name}</dd>
          </div>
          {reservation.email && (
            <div>
              <dt>Email</dt>
              <dd>{reservation.email}</dd>
            </div>
          )}
          {reservation.phone_number && (
            <div>
              <dt>Phone</dt>
              <dd>{reservation.phone_number}</dd>
            </div>
          )}
          {reservation.special_requests && (
            <div className="reservation-note">
              <dt>Special Requests</dt>
              <dd>{reservation.special_requests}</dd>
            </div>
          )}
          <div>
            <dt>Agree to Policy</dt>
            <dd>{reservation.agree_policy ? "Yes" : "No"}</dd>
          </div>
          {selectedMenu.length > 0 && (
            <div className="reservation-menu">
              <dt>Selected Menu</dt>
              <dd>
                <ul>
                  {selectedMenu.map((item) => (
                    <li key={`${item.name}-${item.quantity}`}>
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span>{formatCurrency(item.total || 0)}</span>
                    </li>
                  ))}
                </ul>
                <p className="reservation-menu-total">
                  Total: {formatCurrency(reservation.menu_total || 0)}
                </p>
              </dd>
            </div>
          )}
        </dl>
      </div>
    );
  };

  const renderMenuDetails = (selection) => {
    const selectedMenu = Array.isArray(selection.selected_menu)
      ? selection.selected_menu
      : [];

    return (
      <div className="reservation-details">
        <dl>
          <div>
            <dt>Order Date</dt>
            <dd>
              {selection.created_at
                ? formatDateDisplay(selection.created_at.split("T")[0])
                : "N/A"}
            </dd>
          </div>
          {selectedMenu.length > 0 && (
            <div className="reservation-menu">
              <dt>Items Ordered</dt>
              <dd>
                <ul>
                  {selectedMenu.map((item) => (
                    <li key={`${item.name}-${item.quantity}`}>
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span>{formatCurrency(item.total || 0)}</span>
                    </li>
                  ))}
                </ul>
                <p className="reservation-menu-total">
                  Total: {formatCurrency(selection.total_amount || 0)}
                </p>
              </dd>
            </div>
          )}
        </dl>
      </div>
    );
  };

  const renderMenuSelections = () => {
    if (!menuSelections.length) {
      return (
        <p className="reservation-empty">
          You have not added any menu items yet.
        </p>
      );
    }

    return (
      <div className="reservation-grid">
        {menuSelections.map((selection) => {
          const cardKey = `menu-${selection.id}`;
          const totalAmount = Number(selection.total_amount || 0);
          const isPaying = payingId === cardKey;
          const isConfirming = confirmingId === cardKey;

          const payment = menuPayments[selection.id];
          const selectionStatus = (selection.status || "").toLowerCase();
          const isPaid =
            selectionStatus === "paid" ||
            payment?.status?.toLowerCase() === "paid";
          const isConfirmed = selectionStatus === "confirm";
          const hasPendingPayment =
            payment?.status?.toLowerCase() === "pending";

          return (
            <div className="reservation-card" key={cardKey}>
              <div className="reservation-card-body">
                <p className="reservation-date">
                  {selection.created_at
                    ? formatDateDisplay(selection.created_at.split("T")[0])
                    : "Recent Order"}
                </p>
                <p className="reservation-subtitle">Menu Order</p>
                <p className="reservation-meta">
                  Items: {selection.selected_menu?.length || 0}
                </p>
                <p className="reservation-meta">
                  Total: {formatCurrency(totalAmount)}
                </p>
                <p
                  className={
                    isPaid
                      ? "reservation-meta reservation-status-paid"
                      : "reservation-meta"
                  }
                >
                  Status:{" "}
                  {isPaid
                    ? "Paid"
                    : isConfirmed
                      ? "Confirmed"
                      : hasPendingPayment
                        ? "Awaiting Confirmation"
                        : "Unpaid"}
                </p>
              </div>
              <div className="reservation-card-actions">
                <button
                  type="button"
                  className="reservation-details-btn"
                  onClick={() => openDetails("menu", selection)}
                >
                  Details
                </button>
                {isPaid ? (
                  <div className="reservation-card-actions-pair">
                    <button
                      type="button"
                      className="reservation-print-btn"
                      onClick={() => handlePrintReceipt("menu", selection)}
                    >
                      Receipt
                    </button>
                    <button
                      type="button"
                      className="reservation-feedback-btn"
                      onClick={() => openFeedbackModal("menu", selection)}
                    >
                      {selection.feedback_rating ? "Edit Feedback" : "Feedback"}
                    </button>
                  </div>
                ) : isConfirmed ? (
                  <button
                    type="button"
                    className="reservation-print-btn"
                    onClick={() => handlePrintReceipt("menu", selection)}
                  >
                    Receipt
                  </button>
                ) : hasPendingPayment ? (
                  <button
                    type="button"
                    className="reservation-pay-btn"
                    onClick={() => handleConfirmMenuPayment(selection.id)}
                    disabled={isConfirming}
                  >
                    {isConfirming ? "Confirming..." : "Confirm Payment"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="reservation-pay-btn"
                    onClick={() => handlePaymentMenu(selection.id)}
                    disabled={isPaying}
                  >
                    {isPaying ? "Redirecting..." : "Pay Now"}
                  </button>
                )}
              </div>
              {isPaid && selection.feedback_rating && (
                <div className="reservation-card-feedback">
                  {renderFeedbackStars(selection.feedback_rating)}
                </div>
              )}
              {isPaid && selection.feedback_comment && (
                <div className="reservation-card-comment-section">
                  <button
                    type="button"
                    className="feedback-toggle-btn"
                    onClick={() => toggleFeedback(cardKey)}
                  >
                    {expandedFeedback[cardKey]
                      ? "Hide Comment"
                      : "Show Comment"}
                  </button>
                  {expandedFeedback[cardKey] && (
                    <p className="feedback-comment-display">
                      {selection.feedback_comment}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderRoomReservations = () => {
    if (!roomReservations.length) {
      return (
        <p className="reservation-empty">
          You have not made any room reservations yet.
        </p>
      );
    }

    return (
      <div className="reservation-grid">
        {roomReservations.map((reservation) => {
          const price = getRoomPrice(reservation.room_type);
          const cardKey = `room-${reservation.id}`;
          const isPaid = isReservationPaid(reservation);
          const isPaying = payingId === cardKey;

          const paymentStatusRaw = reservation.payment?.status || "";
          const hasPendingPayment =
            paymentStatusRaw.toLowerCase() === "pending";

          const canPay = price !== null && !isPaid && !hasPendingPayment;

          return (
            <div className="reservation-card" key={cardKey}>
              <div className="reservation-card-body">
                <p className="reservation-date">
                  {formatDateDisplay(reservation.reservation_date)}
                </p>
                <p className="reservation-subtitle">{reservation.room_type}</p>
                <p className="reservation-meta">
                  Guests: {reservation.guests || 0}
                </p>
                {price !== null && (
                  <p className="reservation-meta">
                    Price: {formatCurrency(price)}
                  </p>
                )}
                <p
                  className={
                    isPaid
                      ? "reservation-meta reservation-status-paid"
                      : "reservation-meta"
                  }
                >
                  Status:{" "}
                  {isPaid
                    ? "Paid"
                    : hasPendingPayment
                      ? "Awaiting Confirmation"
                      : "Pending"}
                </p>
              </div>
              <div className="reservation-card-actions">
                <button
                  type="button"
                  className="reservation-details-btn"
                  onClick={() => openDetails("room", reservation)}
                >
                  Details
                </button>

                {isPaid ? (
                  <div className="reservation-card-actions-pair">
                    <button
                      type="button"
                      className="reservation-print-btn"
                      onClick={() => handlePrintReceipt("room", reservation)}
                    >
                      Receipt
                    </button>
                    <button
                      type="button"
                      className="reservation-feedback-btn"
                      onClick={() => openFeedbackModal("room", reservation)}
                    >
                      {reservation.feedback_rating
                        ? "Edit Feedback"
                        : "Feedback"}
                    </button>
                  </div>
                ) : hasPendingPayment ? (
                  <button
                    type="button"
                    className="reservation-pay-btn"
                    onClick={() => handleConfirmPayment("room", reservation)}
                    disabled={confirmingId === cardKey}
                  >
                    {confirmingId === cardKey
                      ? "Confirming..."
                      : "Confirm Payment"}
                  </button>
                ) : (
                  canPay && (
                    <button
                      type="button"
                      className="reservation-pay-btn"
                      onClick={() => handlePayment("room", reservation.id)}
                      disabled={isPaying}
                    >
                      {isPaying ? "Redirecting..." : "Pay Now"}
                    </button>
                  )
                )}
              </div>
              {isPaid && reservation.feedback_rating && (
                <div className="reservation-card-feedback">
                  {renderFeedbackStars(reservation.feedback_rating)}
                </div>
              )}
              {isPaid && reservation.feedback_comment && (
                <div className="reservation-card-comment-section">
                  <button
                    type="button"
                    className="feedback-toggle-btn"
                    onClick={() => toggleFeedback(cardKey)}
                  >
                    {expandedFeedback[cardKey]
                      ? "Hide Comment"
                      : "Show Comment"}
                  </button>
                  {expandedFeedback[cardKey] && (
                    <p className="feedback-comment-display">
                      {reservation.feedback_comment}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderTableReservations = () => {
    if (!tableReservations.length) {
      return (
        <p className="reservation-empty">
          You have not made any table reservations yet.
        </p>
      );
    }

    return (
      <div className="reservation-grid">
        {tableReservations.map((reservation) => {
          const cardKey = `table-${reservation.id}`;
          const totalDue = Number(reservation.menu_total || 0);
          const isPaid = isReservationPaid(reservation);
          const isPaying = payingId === cardKey;

          const paymentStatusRaw = reservation.payment?.status || "";
          const hasPendingPayment =
            paymentStatusRaw.toLowerCase() === "pending";

          const canPay = totalDue > 0 && !isPaid && !hasPendingPayment;
          const amountDisplay = reservation.payment?.amount || totalDue || 0;

          return (
            <div className="reservation-card" key={cardKey}>
              <div className="reservation-card-body">
                <p className="reservation-date">
                  {formatDateDisplay(reservation.reservation_date)}
                </p>
                <p className="reservation-subtitle">
                  {reservation.restaurant_name}
                </p>
                <p className="reservation-meta">
                  Time: {formatTimeDisplay(reservation.reservation_time)}
                </p>
                {(canPay || isPaid || hasPendingPayment) && (
                  <p className="reservation-meta">
                    Amount Due: {formatCurrency(amountDisplay)}
                  </p>
                )}
                <p
                  className={
                    isPaid
                      ? "reservation-meta reservation-status-paid"
                      : "reservation-meta"
                  }
                >
                  Status:{" "}
                  {isPaid
                    ? "Paid"
                    : hasPendingPayment
                      ? "Awaiting Confirmation"
                      : "Pending"}
                </p>
              </div>
              <div className="reservation-card-actions">
                <button
                  type="button"
                  className="reservation-details-btn"
                  onClick={() => openDetails("table", reservation)}
                >
                  Details
                </button>

                {isPaid ? (
                  <div className="reservation-card-actions-pair">
                    <button
                      type="button"
                      className="reservation-print-btn"
                      onClick={() => handlePrintReceipt("table", reservation)}
                    >
                      Receipt
                    </button>
                    <button
                      type="button"
                      className="reservation-feedback-btn"
                      onClick={() => openFeedbackModal("table", reservation)}
                    >
                      {reservation.feedback_rating
                        ? "Edit Feedback"
                        : "Feedback"}
                    </button>
                  </div>
                ) : hasPendingPayment ? (
                  <button
                    type="button"
                    className="reservation-pay-btn"
                    onClick={() => handleConfirmPayment("table", reservation)}
                    disabled={confirmingId === cardKey}
                  >
                    {confirmingId === cardKey
                      ? "Confirming..."
                      : "Confirm Payment"}
                  </button>
                ) : (
                  canPay && (
                    <button
                      type="button"
                      className="reservation-pay-btn"
                      onClick={() => handlePayment("table", reservation.id)}
                      disabled={isPaying}
                    >
                      {isPaying ? "Redirecting..." : "Pay Now"}
                    </button>
                  )
                )}
              </div>
              {isPaid && reservation.feedback_rating && (
                <div className="reservation-card-feedback">
                  {renderFeedbackStars(reservation.feedback_rating)}
                </div>
              )}
              {isPaid && reservation.feedback_comment && (
                <div className="reservation-card-comment-section">
                  <button
                    type="button"
                    className="feedback-toggle-btn"
                    onClick={() => toggleFeedback(cardKey)}
                  >
                    {expandedFeedback[cardKey]
                      ? "Hide Comment"
                      : "Show Comment"}
                  </button>
                  {expandedFeedback[cardKey] && (
                    <p className="feedback-comment-display">
                      {reservation.feedback_comment}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ---------- Render ----------
  return (
    <div className="user-reservations">
      {loading && <p className="reservation-status">Loading reservations...</p>}

      {!loading && error && (
        <p className="reservation-error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && paymentError && (
        <p className="reservation-error" role="alert">
          {paymentError}
        </p>
      )}

      {!loading && !error && paymentSuccess && (
        <p className="reservation-status" role="status">
          {paymentSuccess}
        </p>
      )}

      {!loading && !error && (
        <>
          <section className="reservation-section">
            <h3>Room Reservations</h3>
            {renderRoomReservations()}
          </section>

          <section className="reservation-section">
            <h3>Table Reservations</h3>
            {renderTableReservations()}
          </section>

          <section className="reservation-section">
            <h3>Menu Orders</h3>
            {renderMenuSelections()}
          </section>
        </>
      )}

      {modalData && (
        <div className="reservation-modal" role="dialog" aria-modal="true">
          <div className="reservation-modal-overlay" onClick={closeDetails} />
          <div className="reservation-modal-content">
            <div className="reservation-modal-header">
              <h3>
                {modalData.type === "room"
                  ? "Room Reservation Details"
                  : modalData.type === "table"
                    ? "Table Reservation Details"
                    : "Menu Order Details"}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close details dialog"
                onClick={closeDetails}
              >
                &times;
              </button>
            </div>
            {modalData.type === "room"
              ? renderRoomDetails(modalData.reservation)
              : modalData.type === "table"
                ? renderTableDetails(modalData.reservation)
                : renderMenuDetails(modalData.reservation)}
          </div>
        </div>
      )}

      {feedbackModal && (
        <div className="reservation-modal" role="dialog" aria-modal="true">
          <div
            className="reservation-modal-overlay"
            onClick={closeFeedbackModal}
          />
          <div className="reservation-modal-content feedback-modal">
            <div className="reservation-modal-header">
              <h3>Share Your Feedback</h3>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Close feedback dialog"
                onClick={closeFeedbackModal}
              >
                &times;
              </button>
            </div>
            <div className="feedback-form">
              <div className="feedback-section">
                <label className="feedback-label">How satisfied are you?</label>
                <div className="feedback-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`feedback-star ${
                        star <= feedbackRating ? "active" : ""
                      }`}
                      onClick={() => setFeedbackRating(star)}
                      aria-label={`Rate ${star} stars`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="feedback-section">
                <label className="feedback-label" htmlFor="feedback-comment">
                  Your Comments (Optional)
                </label>
                <textarea
                  id="feedback-comment"
                  className="feedback-textarea"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows="4"
                />
              </div>

              <div className="feedback-actions">
                <button
                  type="button"
                  className="feedback-cancel-btn"
                  onClick={closeFeedbackModal}
                  disabled={submittingFeedback}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="feedback-submit-btn"
                  onClick={handleSubmitFeedback}
                  disabled={submittingFeedback || feedbackRating === 0}
                >
                  {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserReservations;
