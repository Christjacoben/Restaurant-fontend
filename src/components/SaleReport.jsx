import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SalesReport.css";

function SaleReport() {
  const [reservationType, setReservationType] = useState("room");
  const [timeRange, setTimeRange] = useState("days");
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const reservationTypes = ["room", "restaurant", "menu"];
  const timeRanges = ["days", "weekly", "monthly", "years"];

  const fetchSalesData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/api/admin/sales-report`, {
        params: {
          type: reservationType,
          timeRange: timeRange,
        },
        withCredentials: true,
      });

      setData(response.data.data || []);
      setSummary(response.data.summary);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to fetch sales report.";
      setError(message);
      setData([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [reservationType, timeRange]);

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
    });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-PH");
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    return timeStr.slice(0, 5);
  };

  const renderTable = () => {
    if (!data.length) {
      return <p className="no-data">No data available for this period.</p>;
    }

    if (reservationType === "room") {
      return (
        <table className="report-table">
          <thead>
            <tr>
              <th>Room Type</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.room_type || "N/A"}</td>
                <td>{row.guests || 0}</td>
                <td>{formatDate(row.reservation_date)}</td>
                <td>{formatTime(row.reservation_time)}</td>
                <td className="amount">{formatCurrency(row.amount)}</td>
                <td>
                  <span className={`status ${row.payment_status || "pending"}`}>
                    {row.payment_status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (reservationType === "restaurant") {
      return (
        <table className="report-table">
          <thead>
            <tr>
              <th>Guests</th>
              <th>Date</th>
              <th>Time</th>
              <th>Menu Items</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const menuItems = Array.isArray(row.selected_menu)
                ? row.selected_menu
                : [];
              return (
                <tr key={idx}>
                  <td>{row.guests || 0}</td>
                  <td>{formatDate(row.reservation_date)}</td>
                  <td>{formatTime(row.reservation_time)}</td>
                  <td>
                    {menuItems.length > 0 ? (
                      <ul className="menu-list">
                        {menuItems.map((item, i) => (
                          <li key={i}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No menu"
                    )}
                  </td>
                  <td className="amount">{formatCurrency(row.amount)}</td>
                  <td>
                    <span
                      className={`status ${row.payment_status || "pending"}`}
                    >
                      {row.payment_status || "Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    if (reservationType === "menu") {
      return (
        <table className="report-table">
          <thead>
            <tr>
              <th>Menu Items</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              const menuItems = Array.isArray(row.selected_menu)
                ? row.selected_menu
                : [];
              return (
                <tr key={idx}>
                  <td>
                    {menuItems.length > 0 ? (
                      <ul className="menu-list">
                        {menuItems.map((item, i) => (
                          <li key={i}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No items"
                    )}
                  </td>
                  <td className="amount">{formatCurrency(row.amount)}</td>
                  <td>
                    <span
                      className={`status ${row.payment_status || "pending"}`}
                    >
                      {row.payment_status || "Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "height=600,width=900");
    const currentDate = new Date().toLocaleString("en-PH", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const timeRangeText =
      timeRange.charAt(0).toUpperCase() + timeRange.slice(1);
    const typeText =
      reservationType === "restaurant"
        ? "Table"
        : reservationType.charAt(0).toUpperCase() + reservationType.slice(1);

    const summaryHTML = summary
      ? `
      <div style="display: flex; gap: 20px; margin-bottom: 20px;">
        <div style="flex: 1; text-align: center; padding: 10px; background: #f0f0f0; border-radius: 5px;">
          <strong>Total Transactions</strong><br>${summary.totalCount}
        </div>
        <div style="flex: 1; text-align: center; padding: 10px; background: #f0f0f0; border-radius: 5px;">
          <strong>Paid</strong><br>${summary.paidCount}
        </div>
        <div style="flex: 1; text-align: center; padding: 10px; background: #f0f0f0; border-radius: 5px;">
          <strong>Total Amount</strong><br>${formatCurrency(summary.totalAmount)}
        </div>
      </div>
    `
      : "";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${typeText} Sales Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .header {
              margin-bottom: 30px;
              border-bottom: 3px solid #b68900;
              padding-bottom: 15px;
            }
            .header h1 {
              margin: 0;
              color: #b68900;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              font-size: 12px;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table th {
              background-color: #475569;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              border: 1px solid #999;
            }
            table td {
              padding: 10px 12px;
              border: 1px solid #ddd;
              font-size: 13px;
            }
            table tbody tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .footer {
              margin-top: 30px;
              font-size: 11px;
              color: #999;
            }
            @media print {
              body { padding: 10px; }
              .header { margin-bottom: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${typeText} Sales Report</h1>
            <p><strong>Time Range:</strong> ${timeRangeText}</p>
            <p><strong>Generated:</strong> ${currentDate}</p>
          </div>
          
          ${summaryHTML}
          
          <table>
            <thead>
              <tr>
                ${
                  reservationType === "room"
                    ? `
                  <th>Room Type</th>
                  <th>Guests</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                `
                    : reservationType === "restaurant"
                      ? `
                  <th>Guests</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Menu Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                `
                      : `
                  <th>Menu Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                `
                }
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${
                    reservationType === "room"
                      ? `
                    <td>${row.room_type || "N/A"}</td>
                    <td>${row.guests || 0}</td>
                    <td>${formatDate(row.reservation_date)}</td>
                    <td>${formatTime(row.reservation_time)}</td>
                    <td>${formatCurrency(row.amount)}</td>
                    <td>${row.payment_status || "Pending"}</td>
                  `
                      : reservationType === "restaurant"
                        ? `
                    <td>${row.guests || 0}</td>
                    <td>${formatDate(row.reservation_date)}</td>
                    <td>${formatTime(row.reservation_time)}</td>
                    <td>${Array.isArray(row.selected_menu) ? row.selected_menu.map((item) => `${item.quantity}x ${item.name}`).join(", ") : "No menu"}</td>
                    <td>${formatCurrency(row.amount)}</td>
                    <td>${row.payment_status || "Pending"}</td>
                  `
                        : `
                    <td>${Array.isArray(row.selected_menu) ? row.selected_menu.map((item) => `${item.quantity}x ${item.name}`).join(", ") : "No items"}</td>
                    <td>${formatCurrency(row.amount)}</td>
                    <td>${row.payment_status || "Pending"}</td>
                  `
                  }
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is an official document generated by Hotel Restaurant Reservation System</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div
      className="sale-report"
      style={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
    >
      {/* Summary Cards */}
      {summary && !loading && (
        <div className="summary-cards">
          <div className="card">
            <h4>Total Transactions</h4>
            <p className="value">{summary.totalCount}</p>
          </div>
          <div className="card">
            <h4>Paid</h4>
            <p className="value">{summary.paidCount}</p>
          </div>
          <div className="card">
            <h4>Total Amount</h4>
            <p className="value">{formatCurrency(summary.totalAmount)}</p>
          </div>
        </div>
      )}

      <div className="report-filters">
        {/* Reservation Type Filter */}
        <div className="filter-group">
          <div className="filter-buttons">
            {reservationTypes.map((type) => (
              <button
                key={type}
                className={`filter-btn ${reservationType === type ? "active" : ""}`}
                onClick={() => setReservationType(type)}
              >
                {type === "restaurant" ? "TABLE" : type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="filter-group">
          <div className="filter-buttons">
            {timeRanges.map((range) => (
              <button
                key={range}
                className={`filter-btn ${timeRange === range ? "active" : ""}`}
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Print Button */}
        {data.length > 0 && (
          <div className="filter-group">
            <button
              className="print-btn"
              onClick={handlePrint}
              title="Print Sales Report"
            >
              Print
            </button>
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading && <p className="loading-message">Loading data...</p>}

      {!loading && <div className="report-content">{renderTable()}</div>}
    </div>
  );
}

export default SaleReport;
