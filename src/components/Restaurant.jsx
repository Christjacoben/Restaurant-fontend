import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Restaurant.css";
import { FaBackspace } from "react-icons/fa";

export default function Restaurant({ isAdmin = false }) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [newDish, setNewDish] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewDish((prevDish) => ({ ...prevDish, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const addDish = () => {
    if (!newDish.name || newDish.price === "") {
      showMessage("Please provide a name and price.");
      return;
    }

    const price = Number(newDish.price);
    if (Number.isNaN(price)) {
      showMessage("Price must be a number.");
      return;
    }

    setMenu([...menu, { ...newDish, id: Date.now(), price }]);
    setNewDish({ name: "", description: "", price: "", image: "" });
    showMessage("Dish added successfully!");
  };

  const deleteDish = (id) => {
    setMenu(menu.filter((dish) => dish.id !== id));
    showMessage("Dish removed.");
  };

  const startEdit = (dish) => {
    setEditId(dish.id);
    setNewDish({
      name: dish.name,
      description: dish.description,
      price: String(dish.price),
      image: dish.image,
    });
  };

  const updateDish = () => {
    if (editId === null) {
      return;
    }

    if (!newDish.name || newDish.price === "") {
      showMessage("Please provide a name and price.");
      return;
    }

    const price = Number(newDish.price);
    if (Number.isNaN(price)) {
      showMessage("Price must be a number.");
      return;
    }

    setMenu(
      menu.map((dish) =>
        dish.id === editId ? { ...newDish, id: editId, price } : dish
      )
    );
    setEditId(null);
    setNewDish({ name: "", description: "", price: "", image: "" });
    showMessage("Dish updated successfully!");
  };

  const addToCart = (dish) => {
    setCart([...cart, dish]);
    showMessage(`Added ${dish.name} to your order!`);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, currentIndex) => currentIndex !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="restaurant-main">
      <div className="restaurant-container">
        <button className="btn-back" onClick={handleBack}>
          <FaBackspace className="back-icon" />
        </button>

        <h2 className="restaurant-title">Restaurant Menu</h2>
        {message && <div className="message">{message}</div>}

        {isAdmin && (
          <div className="dish-form">
            <h3>{editId ? "Edit Dish" : "Add Dish"}</h3>
            <input
              type="text"
              placeholder="Dish Name"
              value={newDish.name}
              onChange={(event) =>
                setNewDish({ ...newDish, name: event.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={newDish.description}
              onChange={(event) =>
                setNewDish({ ...newDish, description: event.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price (PHP)"
              value={newDish.price}
              onChange={(event) =>
                setNewDish({ ...newDish, price: event.target.value })
              }
            />

            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {newDish.image && (
              <img
                src={newDish.image}
                alt="Preview"
                className="preview-image"
                style={{
                  width: "150px",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
              />
            )}

            {editId ? (
              <button onClick={updateDish} className="save-btn">
                Save Changes
              </button>
            ) : (
              <button onClick={addDish} className="add-btn">
                Add Dish
              </button>
            )}
          </div>
        )}

        <div className="menu-grid">
          {menu.map((dish) => (
            <div key={dish.id} className="dish-card">
              {dish.image && (
                <img src={dish.image} alt={dish.name} className="dish-image" />
              )}
              <div className="dish-info">
                <h3>{dish.name}</h3>
                <p>{dish.description}</p>
                <span className="dish-price">PHP {dish.price}</span>

                <div className="crud-btns">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => startEdit(dish)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => addToCart(dish)}
                      className="order-btn"
                    >
                      Add to Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isAdmin && (
          <div className="cart-container">
            <h2>Your Order</h2>
            {cart.length === 0 ? (
              <p>No items added yet.</p>
            ) : (
              <ul>
                {cart.map((item, index) => (
                  <li key={`${item.id}-${index}`}>
                    {item.name} - PHP {item.price}{" "}
                    <button onClick={() => removeFromCart(index)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <h3>Total: PHP {total}</h3>
            {cart.length > 0 && (
              <button className="checkout-btn">Checkout</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
