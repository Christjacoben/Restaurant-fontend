import React from "react";
import Payment from "./Payment";

export default function CheckoutPage() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#eef2f5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>Checkout</h1>
      <Payment />
    </div>
  );
}
