import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Rooms.css";

export default function Rooms() {
  const navigate = useNavigate();

  
  const handleBack = () => {
    navigate(-1);
  };


  const [rooms, setRooms] = useState(() => {
    const stored = localStorage.getItem("rooms");
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            number: "101",
            name: "Deluxe Suite",
            description:
              "Spacious suite with king-size bed, balcony, and city view.",
            price: "₱8,500 / night",
            image:
              "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101f",
          },
          {
            id: 2,
            number: "102",
            name: "Presidential Suite",
            description:
              "Luxury suite with private pool, living room, and ocean view.",
            price: "₱15,000 / night",
            image:
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          },
        ];
  });


  const [newRoom, setNewRoom] = useState({
    number: "",
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isAdmin = currentUser?.role === "admin";


  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewRoom({ ...newRoom, image: reader.result });
    reader.readAsDataURL(file);
  };


  const addRoom = () => {
    if (!newRoom.number || !newRoom.name || !newRoom.price) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }
    setRooms([...rooms, { ...newRoom, id: Date.now() }]);
    setNewRoom({ number: "", name: "", description: "", price: "", image: "" });
    alert("✅ Room added successfully!");
  };


  const deleteRoom = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      setRooms(rooms.filter((room) => room.id !== id));
    }
  };


  const startEdit = (room) => {
    setEditId(room.id);
    setNewRoom(room);
  };

  const updateRoom = () => {
    if (!newRoom.number || !newRoom.name || !newRoom.price) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }
    setRooms(
      rooms.map((room) =>
        room.id === editId ? { ...newRoom, id: editId } : room
      )
    );
    setEditId(null);
    setNewRoom({ number: "", name: "", description: "", price: "", image: "" });
    alert("✅ Room updated successfully!");
  };


  const filteredRooms = rooms
    .filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );


  const handleCardClick = (room) => {
    localStorage.setItem(
      "reservationPrefill",
      JSON.stringify({
        type: "room",
        roomName: room.name,
        guests: 1,
      })
    );
    navigate("/reservation");
  };

  return (
    <div className="rooms-main-container">
    
        <div className="cards"> 

      <button className="btn-back" onClick={handleBack}>
        ← Back
      </button>

      <h2 className="rooms-title">🏨 Hotel Rooms</h2>

  
      <div className="controls" style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Sort: A → Z</option>
          <option value="desc">Sort: Z → A</option>
        </select>
       



      </div>
      </div>


      {isAdmin && (
        <div className="room-form">
          <h3>{editId ? "✏️ Edit Room" : "➕ Add New Room"}</h3>
          <input
            type="text"
            placeholder="Room Number"
            value={newRoom.number}
            onChange={(e) =>
              setNewRoom({ ...newRoom, number: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Room Name"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newRoom.description}
            onChange={(e) =>
              setNewRoom({ ...newRoom, description: e.target.value })
            }
          ></textarea>
          <input
            type="text"
            placeholder="Price (₱)"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {newRoom.image && (
            <img src={newRoom.image} alt="Preview" className="preview-image" />
          )}
          {editId ? (
            <button onClick={updateRoom} className="luxury-btn small">
              💾 Save Changes
            </button>
          ) : (
            <button onClick={addRoom} className="luxury-btn">
              ➕ Add Room
            </button>
          )}
        </div>
      )}


      <div className="rooms-grid">
        {filteredRooms.length === 0 ? (
          <p className="no-rooms">No rooms found.</p>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              className="room-card"
              onClick={() => handleCardClick(room)}
            >
              <img
                src={room.image}
                alt={room.name}
                className="room-image"
              />
              <div className="room-info">
                <h3>
                  {room.name} <span>({room.number})</span>
                </h3>
                <p>{room.description}</p>
                <span className="room-price">{room.price}</span>

                {isAdmin && (
                  <div className="crud-btns">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(room);
                      }}
                      className="luxury-btn small"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRoom(room.id);
                      }}
                      className="luxury-btn danger small"
                    >
                      🗑 Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
