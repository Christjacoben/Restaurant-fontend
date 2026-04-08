import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/BackupAndRestore.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function BackupAndRestore() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [loadingArchived, setLoadingArchived] = useState(false);

  useEffect(() => {
    fetchArchivedUsers();
  }, []);

  const fetchArchivedUsers = async () => {
    try {
      setLoadingArchived(true);
      const res = await axios.get(`${API_BASE_URL}/api/admin/archived-users`, {
        withCredentials: true,
      });
      setArchivedUsers(res.data.users || []);
    } catch (err) {
      console.error("Fetch archived users error:", err);
      setError(err.response?.data?.message || "Unable to load archived users.");
    } finally {
      setLoadingArchived(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/admin/export-backup`,
        {
          withCredentials: true,
          responseType: "blob",
        },
      );

      // Create a blob and download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `backup-${new Date().toISOString().split("T")[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage("Backup exported successfully!");
    } catch (err) {
      console.error("Export backup error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to export backup. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const restoreUser = async (id) => {
    const yes = window.confirm("Are you sure you want to restore this user?");
    if (!yes) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/admin/restore-user/${id}`,
        {},
        { withCredentials: true },
      );
      setMessage("User restored successfully!");
      fetchArchivedUsers(); // Refresh archived users list
    } catch (err) {
      console.error("Restore user error:", err);
      setError(err.response?.data?.message || "Unable to restore user.");
    }
  };

  return (
    <div className="bar-container">
      <div className="bar-card">
        <h2>Backup and Restore</h2>

        <h3>Restore Deleted Users</h3>
        <p className="bar-subtitle">
          View and restore users that have been deleted from the system.
        </p>

        <div className="bar-table-wrapper">
          {loadingArchived ? (
            <p>Loading archived users...</p>
          ) : archivedUsers.length === 0 ? (
            <p>No archived users found.</p>
          ) : (
            <table className="bar-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {archivedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.contact || "-"}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString("en-PH", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </td>
                    <td>
                      <button
                        className="bar-btn-restore"
                        onClick={() => restoreUser(user.id)}
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bar-info-box">
          <h3>What's Included in the Backup:</h3>
          <ul>
            <li>
              <strong>Menu Selections:</strong> All user menu selections with
              status and feedback
            </li>
            <li>
              <strong>Room Reservations:</strong> All hotel room reservations
              with payment status
            </li>
            <li>
              <strong>Table Reservations:</strong> All restaurant table
              reservations with payment status
            </li>
          </ul>
        </div>

        <div className="bar-actions">
          <button
            className="bar-btn bar-btn-export"
            onClick={handleExportBackup}
            disabled={loading}
          >
            {loading ? "Exporting..." : "Backup Data"}
          </button>
        </div>

        {message && <p className="bar-success">{message}</p>}
        {error && <p className="bar-error">{error}</p>}

        <div className="bar-divider"></div>
      </div>
    </div>
  );
}

export default BackupAndRestore;
