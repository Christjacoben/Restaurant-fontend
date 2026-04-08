import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TableList.css";

export default function TableList() {
  const navigate = useNavigate();

  const [tables, setTables] = useState([
    { id: "t1", name: "Window Table", capacity: "2 People", img: "" },
    { id: "t2", name: "Family Table", capacity: "6 People", img: "" },
    { id: "t3", name: "Romantic Table", capacity: "2 People", img: "" },
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [newTable, setNewTable] = useState({ name: "", capacity: "", img: "" });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && currentUser.role === "admin") setIsAdmin(true);
  }, []);


  const handleBack = () => navigate(-1);


  const handleCardClick = (table) => {
    const guests = parseInt(table.capacity) || 1;
    localStorage.setItem(
      "reservationPrefill",
      JSON.stringify({
        type: "table",
        tableName: table.name,
        guests: guests,
      })
    );
    navigate("/reservation");
  };


  const deleteTable = (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      setTables(tables.filter((t) => t.id !== id));
    }
  };

  const editTable = (table) => {
    const newName = prompt("Edit table name:", table.name);
    if (newName) {
      setTables(tables.map((t) => (t.id === table.id ? { ...t, name: newName } : t)));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewTable({ ...newTable, img: reader.result });
    };
    reader.readAsDataURL(file); 
  };

  const addTable = () => {
    if (!newTable.name || !newTable.capacity) {
      alert("⚠️ Please provide table name and capacity.");
      return;
    }
    setTables([...tables, { ...newTable, id: "t" + Date.now() }]);
    setNewTable({ name: "", capacity: "", img: "" });
  };

  return (
    <div className="luxury-container">
    
      <button className="btn-back" onClick={handleBack}>
        ← Back
      </button>

      <h2 className="luxury-title">Restaurant Tables</h2>

      {isAdmin && (
        <div className="add-table-form">
          <h3>➕ Add New Table</h3>
          <input
            type="text"
            placeholder="Table Name"
            value={newTable.name}
            onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Capacity (e.g., 2 People)"
            value={newTable.capacity}
            onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {newTable.img && (
            <img src={newTable.img} alt="Preview" className="preview-img" />
          )}
          <button onClick={addTable} className="luxury-btn">
            ➕ Add Table
          </button>
        </div>
      )}

      
      <div className="luxury-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className="luxury-card"
            onClick={() => handleCardClick(table)}
          >
            <img src={table.img || "https://via.placeholder.com/400x250?text=No+Image"} alt={table.name} />
            <h4>{table.name}</h4>
            <p>{table.capacity}</p>

            {isAdmin && (
              <div className="luxury-actions">
                <button onClick={(e) => { e.stopPropagation(); editTable(table); }} className="btn-edit">
                  ✏️ Edit
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteTable(table.id); }} className="btn-delete">
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
