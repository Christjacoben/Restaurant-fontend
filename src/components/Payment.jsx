import { useState } from "react";
import QRCode from "qrcode.react";

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [qrValue, setQrValue] = useState("");

  const isValidPhone = (phone) => /^\d{10,11}$/.test(phone);

  const generateQr = () => {
    if (!amount || !phone) {
      alert("Please enter amount and phone number!");
      return;
    }
    if (!isValidPhone(phone)) {
      alert("Please enter a valid phone number!");
      return;
    }

    const paymentUrl = `https://gcash.com/pay?phone=${phone}&amount=${amount}`;
    setQrValue(paymentUrl);
  };

  const payViaApp = () => {
    if (!amount || !phone) {
      alert("Please enter amount and phone number!");
      return;
    }
    if (!isValidPhone(phone)) {
      alert("Please enter a valid phone number!");
      return;
    }

    const gcashLink = `gcash://pay?phone=${phone}&amount=${amount}`;
    window.location.href = gcashLink;
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#00a4d0" }}>Pay with GCash</h2>

      <input
        type="number"
        placeholder="Amount (₱)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      <input
        type="text"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      <button
        onClick={generateQr}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#00a4d0",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Generate QR Code
      </button>

      <button
        onClick={payViaApp}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#0077a3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Pay via GCash App
      </button>

      {qrValue && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ marginBottom: "10px" }}>Scan this QR code with GCash:</p>
          <QRCode value={qrValue} size={220} />
        </div>
      )}
    </div>
  );
}
