import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserChanges.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function UserChanges() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      contact: user.contact || "",
      password: "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", email: "", contact: "", password: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveUser = async () => {
    if (!editingId) return;

    try {
      const payload = {
        name: form.name,
        email: form.email,
        contact: form.contact,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const res = await axios.put(
        `${API_BASE_URL}/api/admin/users/${editingId}`,
        payload,
        { withCredentials: true },
      );

      const updatedUser = res.data.user;
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      );
      cancelEdit();
    } catch (err) {
      console.error("Save user error:", err);
      alert(err.response?.data?.message || "Unable to save user changes.");
    }
  };

  const deleteUser = async (id) => {
    const yes = window.confirm("Are you sure you want to delete this user?");
    if (!yes) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete user error:", err);
      alert(err.response?.data?.message || "Unable to delete user.");
    }
  };

  if (loading) {
    return (
      <div className="user-changes-container">
        <h2>User Management</h2>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-changes-container">
        <h2>User Management</h2>
        <p className="uc-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="user-changes-container">
      <h2>User Management</h2>
      <p className="uc-subtitle">
        Change user name, email, contact, reset password, or delete account.
        Deleted users can be restored in the Backup and Restore section.
      </p>

      <div className="uc-table-wrapper">
        <table className="uc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const isEditing = editingId === user.id;

              return (
                <tr key={user.id}>
                  <td>
                    {isEditing ? (
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="uc-input"
                      />
                    ) : (
                      user.name
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="uc-input"
                      />
                    ) : (
                      user.email
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        className="uc-input"
                      />
                    ) : (
                      user.contact || "-"
                    )}
                  </td>

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
                    {isEditing ? (
                      <div className="uc-actions">
                        <input
                          type="password"
                          name="password"
                          placeholder="New password (optional)"
                          value={form.password}
                          onChange={handleChange}
                          className="uc-input uc-input-password"
                        />
                        <button
                          className="uc-btn uc-btn-save"
                          onClick={saveUser}
                        >
                          Save
                        </button>
                        <button
                          className="uc-btn uc-btn-cancel"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="uc-actions">
                        <button
                          className="uc-btn uc-btn-edit"
                          onClick={() => startEdit(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="uc-btn uc-btn-delete"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserChanges;
