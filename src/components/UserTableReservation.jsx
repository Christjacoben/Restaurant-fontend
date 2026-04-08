import React, { useEffect, useState } from "react";
import "../styles/UserTableReservation.css";
import Table from "../assets/tableImage.svg";
import axios from "axios";

const MENU_SECTIONS = [
  {
    id: "rice-meal",
    label: "Rice Meals",
    items: [
      {
        name: "Wine Spare Ribs",
        description: "Served with garlic rice and egg.",
        price: "180",
      },
      {
        name: "Hungarian Sausage",
        description: "Served with garlic rice and egg.",
        price: "160",
      },
      {
        name: "Sisig Solo",
        description: "Served with garlic rice and egg.",
        price: "130",
      },
      {
        name: "Chicken Solo",
        description: "Served with garlic rice and egg.",
        price: "130",
      },
      {
        name: "Tapsilog",
        description: "Served with garlic rice and egg.",
        price: "130",
      },
      {
        name: "Spamsilog",
        description: "Served with garlic rice and egg.",
        price: "130",
      },
      {
        name: "Porksilog",
        description: "Served with garlic rice and egg.",
        price: "130",
      },
      {
        name: "Bangsilog",
        description: "Served with garlic rice and egg.",
        price: "130",
      },
      {
        name: "Fried Rice",
        description: "Ala carte rice upgrade.",
        price: "30",
      },
      {
        name: "Extra Rice",
        description: "Plain steamed rice.",
        price: "30",
      },
    ],
  },
  {
    id: "appetizers",
    label: "Appetizers / Pulutan",
    items: [
      {
        name: "Tempura",
        description: "Perfect for sharing or pulutan.",
        price: "360",
      },
      {
        name: "Pork Sisig",
        description: "Perfect for sharing or pulutan.",
        price: "300",
      },
      {
        name: "Chicken Sisig",
        description: "Perfect for sharing or pulutan.",
        price: "300",
      },
      {
        name: "Squid Sisig",
        description: "Perfect for sharing or pulutan.",
        price: "300",
      },
      {
        name: "Crispy Squid",
        description: "Perfect for sharing or pulutan.",
        price: "300",
      },
      {
        name: "Grilled Squid",
        description: "Perfect for sharing or pulutan.",
        price: "300",
      },
      {
        name: "Chicken Popcorn",
        description: "Perfect for sharing or pulutan.",
        price: "290",
      },
      {
        name: "Tokwat Baboy",
        description: "Perfect for sharing or pulutan.",
        price: "290",
      },
      {
        name: "Butterfly Squid",
        description: "Perfect for sharing or pulutan.",
        price: "290",
      },
      {
        name: "Sizzling Hungarian",
        description: "Perfect for sharing or pulutan.",
        price: "250",
      },
      {
        name: "Sizzling Hotdog",
        description: "Perfect for sharing or pulutan.",
        price: "190",
      },
    ],
  },
  {
    id: "classics",
    label: "Classics",
    items: [
      {
        name: "Crispy Pata (Large)",
        description: "House special crispy pork knuckle.",
        price: "850",
      },
      {
        name: "Chinese Style Whole Chicken",
        description: "Signature roasted whole chicken.",
        price: "500",
      },
      {
        name: "Chicharon Bulaklak",
        description: "Crispy pork chitterlings.",
        price: "350",
      },
      {
        name: "Beef Tapa",
        description: "Marinated beef strips.",
        price: "350",
      },
      {
        name: "Crispy Pork Dinakdakan",
        description: "Ilocano-style sizzling pork salad.",
        price: "320",
      },
      {
        name: "Lechon Kawali",
        description: "Crispy pork belly slab.",
        price: "300",
      },
    ],
  },
  {
    id: "flavored-chicken",
    label: "Flavored Chicken",
    items: [
      {
        name: "Buttered",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
      },
      {
        name: "Teriyaki",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
      },
      {
        name: "Salted Egg",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
      },
      {
        name: "Barbecue",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
      },
      {
        name: "Garlic",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
      },
      {
        name: "Lemon Glazed",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
      },
      {
        name: "Mango Habanero",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
      },
      {
        name: "Orange Zest",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
      },
    ],
  },
  {
    id: "soup",
    label: "Soup",
    items: [
      {
        name: "Cream of Mushroom",
        description: "Comforting house soup.",
        price: "250",
      },
      {
        name: "Crab and Corn",
        description: "Comforting house soup.",
        price: "250",
      },
    ],
  },
  {
    id: "fries",
    label: "Fries",
    items: [
      {
        name: "Cheese",
        description: "Crispy fries to snack on.",
        price: "150",
      },
      {
        name: "Plain",
        description: "Crispy fries to snack on.",
        price: "130",
      },
    ],
  },
  {
    id: "mojos",
    label: "Mojos",
    items: [
      {
        name: "Cheese",
        description: "Crispy seasoned potato rounds.",
        price: "200",
      },
      {
        name: "Plain",
        description: "Crispy seasoned potato rounds.",
        price: "180",
      },
    ],
  },
  {
    id: "sides",
    label: "Sides",
    items: [
      {
        name: "Meaty Nachos",
        description: "Great for sharing.",
        price: "250",
      },
      {
        name: "Club House",
        description: "Great for sharing.",
        price: "200",
      },
      {
        name: "Tofu",
        description: "Great for sharing.",
        price: "190",
      },
      {
        name: "Crispy Kropek",
        description: "Great for sharing.",
        price: "150",
      },
      {
        name: "Pipino",
        description: "Great for sharing.",
        price: "100",
      },
    ],
  },
  {
    id: "pasta",
    label: "Pasta",
    items: [
      {
        name: "Tuna Pesto",
        description: "Hearty pasta serving.",
        price: "280",
      },
      {
        name: "Creamy Carbonara",
        description: "Hearty pasta serving.",
        price: "280",
      },
      {
        name: "Canton Bihon",
        description: "Hearty pasta serving.",
        price: "280",
      },
      {
        name: "Canton",
        description: "Hearty pasta serving.",
        price: "280",
      },
      {
        name: "Lomi Overload",
        description: "Hearty pasta serving.",
        price: "280",
      },
    ],
  },
];
const RESTAURANT_NAME = "Bochzhog";

function UserTableReservation() {
  const [tableForm, setTableForm] = React.useState({
    partySize: "2",
    customPartySize: "",
    date: "",
    time: "20:00",
  });
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [activeMenuTab, setActiveMenuTab] = React.useState(MENU_SECTIONS[0].id);
  const [menuSelections, setMenuSelections] = React.useState({});
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null);
  const tableTypesRef = React.useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const [contactForm, setContactForm] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    requests: "",
    agreePolicy: false,
  });

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

  const handleScrollToTableTypes = () => {
    tableTypesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTableChange = (event) => {
    const { name, value } = event.target;
    setTableForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTableSubmit = (event) => {
    event.preventDefault();
    setShowConfirm(true);
  };

  const handleContactChange = (event) => {
    const { name, value, type, checked } = event.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleQuantityChange = (itemName, delta) => {
    setMenuSelections((prev) => {
      const currentValue = prev[itemName] || 0;
      const nextValue = Math.max(0, currentValue + delta);
      return { ...prev, [itemName]: nextValue };
    });
  };

  const formattedGuests =
    tableForm.partySize === "others"
      ? `${tableForm.customPartySize} Guests`
      : tableForm.partySize === "1"
        ? "1 Guest"
        : `${tableForm.partySize} Guests`;
  const activeMenu =
    MENU_SECTIONS.find((section) => section.id === activeMenuTab) ||
    MENU_SECTIONS[0];
  const menuItemLookup = React.useMemo(() => {
    const lookup = {};
    MENU_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        lookup[item.name] = item;
      });
    });
    return lookup;
  }, []);
  const selectedMenuItems = React.useMemo(() => {
    return Object.entries(menuSelections)
      .filter(([, quantity]) => quantity > 0)
      .map(([name, quantity]) => {
        const priceValue = Number(menuItemLookup[name]?.price || 0);
        return {
          name,
          quantity,
          price: priceValue,
          total: priceValue * quantity,
        };
      });
  }, [menuSelections, menuItemLookup]);
  const selectedMenuTotal = React.useMemo(
    () =>
      selectedMenuItems.reduce((sum, item) => {
        return sum + item.total;
      }, 0),
    [selectedMenuItems],
  );
  const formatAmount = (value) =>
    Number(value).toLocaleString(undefined, { minimumFractionDigits: 0 });

  const handleReservationComplete = async () => {
    if (loadingUser) return;
    if (!user) {
      setSubmitStatus({
        type: "error",
        message: "Please log in to complete your reservation.",
      });
      return;
    }
    if (!tableForm.date || !tableForm.time) {
      setSubmitStatus({
        type: "error",
        message: "Please select a reservation date and time.",
      });
      return;
    }
    if (!contactForm.fullName) {
      setSubmitStatus({
        type: "error",
        message: "Please provide the contact full name.",
      });
      return;
    }

    if (tableForm.partySize === "others" && !tableForm.customPartySize) {
      setSubmitStatus({
        type: "error",
        message: "Please enter the number of guests.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const guests =
        tableForm.partySize === "others"
          ? Number(tableForm.customPartySize)
          : Number(tableForm.partySize);
      const payload = {
        restaurantName: RESTAURANT_NAME,
        guests: guests,
        date: tableForm.date,
        time: tableForm.time,
        fullName: contactForm.fullName,
        email: contactForm.email,
        phoneNumber: contactForm.phone,
        specialRequests: contactForm.requests,
        agreePolicy: contactForm.agreePolicy,
        selectedMenu: selectedMenuItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
        })),
        menuTotal: selectedMenuTotal,
        userId: user?.id,
        userName: user?.name,
      };

      await axios.post(`${API_URL}/api/table-reservations`, payload, {
        withCredentials: true,
      });
      setSubmitStatus({
        type: "success",
        message: "Reservation saved successfully!",
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to save reservation.";
      setSubmitStatus({
        type: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="table-section">
      <section className="table-hero">
        <div className="table-hero-overlay" />
        <img src={Table} alt="table" className="table-hero-bg" />
        <div className="room-hero-content">
          <h1>Reserve Your Perfect Table</h1>
          <p>
            Enjoy a seamless dining experience with cozy ambiance, great food,
            and a space prepared just for you.
          </p>

          <button className="btn-reserve" onClick={handleScrollToTableTypes}>
            Make a Reservation
          </button>
        </div>
      </section>
      <div className="room-info">
        <h2>Our Tables</h2>
        <p>
          Explore our well-designed dining areas crafted for comfort and
          convenience. Whether you're dining with friends, family, or
          colleagues, each table provides the ideal setting for a delightful and
          memorable meal.
        </p>
      </div>
      <div className="table-reservation-wrapper" ref={tableTypesRef}>
        <div className="table-reservation-card">
          <div className="table-reservation-header">
            <h2>
              <span>Find a Table</span>
            </h2>
          </div>

          <form className="table-reservation-form" onSubmit={handleTableSubmit}>
            <div className="table-reservation-row">
              <label htmlFor="partySize">Party Size</label>
              <select
                id="partySize"
                name="partySize"
                value={tableForm.partySize}
                onChange={handleTableChange}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5">5 Guests</option>
                <option value="6">6 Guests</option>
                <option value="others">Others</option>
              </select>
              {tableForm.partySize === "others" && (
                <input
                  type="number"
                  name="customPartySize"
                  placeholder="Enter number of guests"
                  value={tableForm.customPartySize}
                  onChange={handleTableChange}
                  min="7"
                  className="custom-party-size-input"
                />
              )}
            </div>

            <div className="table-reservation-row">
              <label htmlFor="reservationDate">Date</label>
              <input
                type="date"
                id="reservationDate"
                name="date"
                value={tableForm.date}
                onChange={handleTableChange}
              />
            </div>

            <div className="table-reservation-row">
              <label htmlFor="reservationTime">Time</label>
              <select
                id="reservationTime"
                name="time"
                value={tableForm.time}
                onChange={handleTableChange}
              >
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

            <div className="table-reservation-actions">
              <button type="submit" className="primary-btn">
                Find a Table
              </button>
            </div>
          </form>
        </div>
        {showConfirm && (
          <div className="table-confirm-wrapper">
            <div className="table-confirm-card">
              <div className="table-confirm-header">
                <h2>
                  <span>Confirm Details</span>
                </h2>
              </div>

              <div className="table-confirm-body">
                <form className="table-contact-form">
                  <div className="table-contact-section">
                    <h3>Contact Information</h3>

                    <div className="contact-grid">
                      <label className="full-width">
                        Full Name
                        <input
                          type="text"
                          name="fullName"
                          value={contactForm.fullName}
                          onChange={handleContactChange}
                        />
                      </label>
                      <label>
                        Email Address
                        <input
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                        />
                      </label>
                      <label>
                        Phone Number
                        <input
                          type="tel"
                          name="phone"
                          value={contactForm.phone}
                          onChange={handleContactChange}
                        />
                      </label>
                      <label className="full-width">
                        Special Requests (Optional)
                        <textarea
                          name="requests"
                          rows="3"
                          placeholder="e.g., anniversary celebration, high chair needed, wheelchair access."
                          value={contactForm.requests}
                          onChange={handleContactChange}
                        />
                      </label>
                    </div>

                    <label className="policy-checkbox">
                      <input
                        type="checkbox"
                        name="agreePolicy"
                        checked={contactForm.agreePolicy}
                        onChange={handleContactChange}
                      />
                      <span>
                        I agree to the restaurant&apos;s{" "}
                        <button type="button">Cancellation Policy.</button>
                      </span>
                      <span>
                        <button type="button" onClick={() => setShowMenu(true)}>
                          Add Menu
                        </button>
                      </span>
                    </label>

                    <button
                      type="button"
                      className="complete-btn"
                      onClick={handleReservationComplete}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Complete Reservation"}
                    </button>
                    {submitStatus && (
                      <p className={`reservation-status ${submitStatus.type}`}>
                        {submitStatus.message}
                      </p>
                    )}
                  </div>
                </form>

                <aside className="table-booking-summary">
                  <h3>Your Booking Summary</h3>
                  <dl>
                    <div>
                      <dt>Restaurant:</dt>
                      <dd>{RESTAURANT_NAME}</dd>
                    </div>
                    <div>
                      <dt>Date:</dt>
                      <dd>{tableForm.date || "Select a date"}</dd>
                    </div>
                    <div>
                      <dt>Time:</dt>
                      <dd>{tableForm.time || "Select a time"}</dd>
                    </div>
                    <div>
                      <dt>Guests:</dt>
                      <dd>{formattedGuests}</dd>
                    </div>
                  </dl>
                  {selectedMenuItems.length > 0 && (
                    <div className="menu-selection-summary">
                      <h4>Selected Menu</h4>
                      <ul>
                        {selectedMenuItems.map((item) => (
                          <li key={item.name}>
                            <span>
                              {item.quantity} x {item.name}
                            </span>
                            <span>₱{formatAmount(item.total)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="menu-selection-total">
                        <span>Total</span>
                        <span>₱{formatAmount(selectedMenuTotal)}</span>
                      </div>
                    </div>
                  )}

                  <div className="cancellation-policy">
                    <h4>Cancellation Policy:</h4>
                    <p>
                      Cancellations must be made at least 24 hours in advance.
                      Failure to cancel will result in a no-show fee of ₱500 per
                      person.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="change-link"
                    onClick={() => setShowConfirm(false)}
                  >
                    Change Date/Time
                  </button>
                </aside>
              </div>
            </div>
          </div>
        )}

        {showMenu && (
          <div className="table-menu-wrapper">
            <div className="table-menu-card">
              <div className="table-menu-header">
                <div>
                  <h2>Bochzhog Menu</h2>
                </div>
                <button
                  type="button"
                  className="menu-back-link"
                  onClick={() => setShowMenu(false)}
                >
                  ← Back to Booking
                </button>
              </div>
              <div className="menu-tabs">
                {MENU_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    className={
                      section.id === activeMenuTab
                        ? "tab-btn active"
                        : "tab-btn"
                    }
                    onClick={() => setActiveMenuTab(section.id)}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              <div className="menu-items">
                {activeMenu.items.map((item) => (
                  <div key={item.name} className="menu-item">
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.description}</p>
                    </div>
                    <span>{item.price}</span>
                    <div className="menu-item-quantity">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.name, 1)}
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                      <span>{menuSelections[item.name] || 0}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.name, -1)}
                        aria-label={`Decrease ${item.name}`}
                        disabled={(menuSelections[item.name] || 0) === 0}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserTableReservation;
