import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserMenu.css";
import wineSpareRibsImg from "../assets/menus/wine-spare-ribss.svg";
import hungarianSausageImg from "../assets/menus/hungarian-sausage.svg";
import sisigSoloImg from "../assets/menus/sisig-solo.svg";
import chickenSoloImg from "../assets/menus/chicken-solo.svg";
import tapSilogImg from "../assets/menus/tapsilog.svg";
import spamSilogImg from "../assets/menus/spamsilog.svg";
import porkSilogImg from "../assets/menus/pork-silog.svg";
import bangSilogImg from "../assets/menus/bang-silog.svg";
import friedRiceImg from "../assets/menus/fried-rice.svg";
import extraRiceImg from "../assets/menus/extra-rice.svg";
import butterFlySquidImg from "../assets/menus/butterfly-squid.svg";
import tempuraImg from "../assets/menus/tempura.svg";
import porkSisigImg from "../assets/menus/pork-sisig.svg";
import chickenSisigImg from "../assets/menus/chicken-ssisig.svg";
import squidSisigImg from "../assets/menus/squid-sisig.svg";
import crispySquidImg from "../assets/menus/crispy-squid.svg";
import grilledSquidImg from "../assets/menus/grilled-squid.svg";
import chickendPopcornImg from "../assets/menus/chicken-popcorn.svg";
import tokwatBaboyImg from "../assets/menus/tokwat-baboy.svg";
import sizzlingHungarianImg from "../assets/menus/sizzling-hungarian.svg";
import sizzlingHotdogImg from "../assets/menus/sizzling-hotdog.svg";
import crispyPataImg from "../assets/menus/crispy-pata.svg";
import chineseStyleWholeChickenImg from "../assets/menus/chinese-style-whole-chicken.svg";
import chicharonBulaklakImg from "../assets/menus/chicharon-bulaklak.svg";
import beefTapaImg from "../assets/menus/beef-tapa.svg";
import crispyPorkSisigImg from "../assets/menus/crispy-pork-sisig.svg";
import crisyKawaliImg from "../assets/menus/lechon-kawali.svg";
import garlicImg from "../assets/menus/garlic.svg";
import butteredImg from "../assets/menus/buttered.svg";
import teriyakiImg from "../assets/menus/teriyaki.svg";
import saltedEggImg from "../assets/menus/salted-egg.svg";
import barbecueImg from "../assets/menus/barbecue.svg";
import lemonGlazedImg from "../assets/menus/lemon-glazed.svg";
import mongoHabaneroImg from "../assets/menus/mango-habanero.svg";
import orangeZestImg from "../assets/menus/orange-zest.svg";
import creamOfMushroomImg from "../assets/menus/cream-of-mushroom.svg";
import crabAndCornImg from "../assets/menus/crab-corn.svg";
import friesCheeseImg from "../assets/menus/fries-cheese.svg";
import plainFriesImg from "../assets/menus/plain-fries.svg";
import mojosCheeseImg from "../assets/menus/mojos-cheese.svg";
import mojosPlainImg from "../assets/menus/mojo-plain.svg";
import meatyNachosImg from "../assets/menus/meaty-nachos.svg";
import clubHouseImg from "../assets/menus/club-house.svg";
import tofuImg from "../assets/menus/tofu.svg";
import crispyKropekImg from "../assets/menus/crispy-kropek.svg";
import pipinoImg from "../assets/menus/pipino.svg";
import tunaPestoImg from "../assets/menus/tuna-pesto.svg";
import creamyCarbonaraImg from "../assets/menus/creamy-carbonara.svg";
import cantonBihonImg from "../assets/menus/canton-bihon.svg";
import cantonImg from "../assets/menus/canton.svg";
import lomiOverloadImg from "../assets/menus/lomi-overload.svg";

const MENU_SECTIONS = [
  {
    id: "rice-meal",
    label: "Rice Meals",
    items: [
      {
        name: "Wine Spare Ribs",
        description: "Served with garlic rice and egg.",
        price: "180",
        image: wineSpareRibsImg,
      },
      {
        name: "Hungarian Sausage",
        description: "Served with garlic rice and egg.",
        price: "160",
        image: hungarianSausageImg,
      },
      {
        name: "Sisig Solo",
        description: "Served with garlic rice and egg.",
        price: "130",
        image: sisigSoloImg,
      },
      {
        name: "Chicken Solo",
        description: "Served with garlic rice and egg.",
        price: "130",
        image: chickenSoloImg,
      },
      {
        name: "Tapsilog",
        description: "Served with garlic rice and egg.",
        price: "130",
        image: tapSilogImg,
      },
      {
        name: "Spamsilog",
        description: "Served with garlic rice and egg.",
        price: "130",
        image: spamSilogImg,
      },
      {
        name: "Porksilog",
        description: "Served with garlic rice and egg.",
        price: "130",
        image: porkSilogImg,
      },
      {
        name: "Bangsilog",
        description: "Served with garlic rice and egg.",
        price: "130",
        image: bangSilogImg,
      },
      {
        name: "Fried Rice",
        description: "Ala carte rice upgrade.",
        price: "30",
        image: friedRiceImg,
      },
      {
        name: "Extra Rice",
        description: "Plain steamed rice.",
        price: "30",
        image: extraRiceImg,
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
        image: tempuraImg,
      },
      {
        name: "Pork Sisig",
        description: "Perfect for sharing or pulutan.",
        price: "300",
        image: porkSisigImg,
      },
      {
        name: "Chicken Sisig",
        description: "Perfect for sharing or pulutan.",
        price: "300",
        image: chickenSisigImg,
      },
      {
        name: "Squid Sisig",
        description: "Perfect for sharing or pulutan.",
        price: "300",
        image: squidSisigImg,
      },
      {
        name: "Crispy Squid",
        description: "Perfect for sharing or pulutan.",
        price: "300",
        image: crispySquidImg,
      },
      {
        name: "Grilled Squid",
        description: "Perfect for sharing or pulutan.",
        price: "300",
        image: grilledSquidImg,
      },
      {
        name: "Chicken Popcorn",
        description: "Perfect for sharing or pulutan.",
        price: "290",
        image: chickendPopcornImg,
      },
      {
        name: "Tokwat Baboy",
        description: "Perfect for sharing or pulutan.",
        price: "290",
        image: tokwatBaboyImg,
      },
      {
        name: "Butterfly Squid",
        description: "Perfect for sharing or pulutan.",
        price: "290",
        image: butterFlySquidImg,
      },
      {
        name: "Sizzling Hungarian",
        description: "Perfect for sharing or pulutan.",
        price: "250",
        image: sizzlingHungarianImg,
      },
      {
        name: "Sizzling Hotdog",
        description: "Perfect for sharing or pulutan.",
        price: "190",
        image: sizzlingHotdogImg,
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
        image: crispyPataImg,
      },
      {
        name: "Chinese Style Whole Chicken",
        description: "Signature roasted whole chicken.",
        price: "500",
        image: chineseStyleWholeChickenImg,
      },
      {
        name: "Chicharon Bulaklak",
        description: "Crispy pork chitterlings.",
        price: "350",
        image: chicharonBulaklakImg,
      },
      {
        name: "Beef Tapa",
        description: "Marinated beef strips.",
        price: "350",
        image: beefTapaImg,
      },
      {
        name: "Crispy Pork Dinakdakan",
        description: "Ilocano-style sizzling pork salad.",
        price: "320",
        image: crispyPorkSisigImg,
      },
      {
        name: "Lechon Kawali",
        description: "Crispy pork belly slab.",
        price: "300",
        image: crisyKawaliImg,
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
        image: butteredImg,
      },
      {
        name: "Teriyaki",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
        image: teriyakiImg,
      },
      {
        name: "Salted Egg",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
        image: saltedEggImg,
      },
      {
        name: "Barbecue",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
        image: barbecueImg,
      },
      {
        name: "Garlic",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
        image: garlicImg,
      },
      {
        name: "Lemon Glazed",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
        image: lemonGlazedImg,
      },
      {
        name: "Mango Habanero",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
        image: mongoHabaneroImg,
      },
      {
        name: "Orange Zest",
        description: "Crispy chicken coated in signature flavor.",
        price: "250",
        image: orangeZestImg,
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
        image: creamOfMushroomImg,
      },
      {
        name: "Crab and Corn",
        description: "Comforting house soup.",
        price: "250",
        image: crabAndCornImg,
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
        image: friesCheeseImg,
      },
      {
        name: "Plain",
        description: "Crispy fries to snack on.",
        price: "130",
        image: plainFriesImg,
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
        image: mojosCheeseImg,
      },
      {
        name: "Plain",
        description: "Crispy seasoned potato rounds.",
        price: "180",
        image: mojosPlainImg,
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
        image: meatyNachosImg,
      },
      {
        name: "Club House",
        description: "Great for sharing.",
        price: "200",
        image: clubHouseImg,
      },
      {
        name: "Tofu",
        description: "Great for sharing.",
        price: "190",
        image: tofuImg,
      },
      {
        name: "Crispy Kropek",
        description: "Great for sharing.",
        price: "150",
        image: crispyKropekImg,
      },
      {
        name: "Pipino",
        description: "Great for sharing.",
        price: "100",
        image: pipinoImg,
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
        image: tunaPestoImg,
      },
      {
        name: "Creamy Carbonara",
        description: "Hearty pasta serving.",
        price: "280",
        image: creamyCarbonaraImg,
      },
      {
        name: "Canton Bihon",
        description: "Hearty pasta serving.",
        price: "280",
        image: cantonBihonImg,
      },
      {
        name: "Canton",
        description: "Hearty pasta serving.",
        price: "280",
        image: cantonImg,
      },
      {
        name: "Lomi Overload",
        description: "Hearty pasta serving.",
        price: "280",
        image: lomiOverloadImg,
      },
    ],
  },
  {
    id: "best-sellers",
    label: "Best Sellers",
    items: [
      {
        name: "Crispy Pata (Large)",
        description: "House special crispy pork knuckle - Customer Favorite!",
        price: "850",
        image: crispyPataImg,
      },
      {
        name: "Chinese Style Whole Chicken",
        description: "Signature roasted whole chicken - Most Popular!",
        price: "500",
        image: chineseStyleWholeChickenImg,
      },
      {
        name: "Wine Spare Ribs",
        description: "Served with garlic rice and egg - Top Seller!",
        price: "180",
        image: wineSpareRibsImg,
      },
      {
        name: "Pork Sisig",
        description: "Perfect for sharing or pulutan - Guests Love It!",
        price: "300",
        image: porkSisigImg,
      },
      {
        name: "Tempura",
        description: "Perfect for sharing or pulutan - Best Appetizer!",
        price: "360",
        image: tempuraImg,
      },
      {
        name: "Teriyaki",
        description:
          "Crispy chicken coated in signature flavor - Highly Rated!",
        price: "250",
        image: teriyakiImg,
      },
    ],
  },
];

function UserMenu() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [activeCategory, setActiveCategory] = useState("rice-meal");
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(false);

  const currentSection = MENU_SECTIONS.find((s) => s.id === activeCategory);

  const handleQuantityChange = (itemName, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(0, (prev[itemName] || 0) + delta),
    }));
  };

  const handleAddMenuItems = async () => {
    const selectedItems = [];
    let totalAmount = 0;
    const addedItems = new Set();

    MENU_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        const quantity = quantities[item.name] || 0;
        if (quantity > 0 && !addedItems.has(item.name)) {
          const itemTotal = parseFloat(item.price) * quantity;
          selectedItems.push({
            name: item.name,
            price: parseFloat(item.price),
            quantity: quantity,
            category: section.label,
            total: itemTotal,
          });
          totalAmount += itemTotal;
          addedItems.add(item.name);
        }
      });
    });

    if (selectedItems.length === 0) {
      alert("Please select at least one item");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/menu-selections`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedMenu: selectedItems,
          totalAmount: totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save menu selections");
      }

      const data = await response.json();
      alert("Menu items added successfully!");

      setQuantities({});
    } catch (error) {
      console.error("Error saving menu selections:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-menu-container">
      <div className="menu-header">
        <h1>Bochzhog Menu</h1>
      </div>

      <div className="category-filters">
        {MENU_SECTIONS.map((section) => (
          <button
            key={section.id}
            className={`category-btn ${
              activeCategory === section.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(section.id)}
          >
            {section.label}
          </button>
        ))}
        <button
          onClick={handleAddMenuItems}
          disabled={loading}
          className="add-menu-btn"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="menu-items">
        {currentSection?.items.map((item, index) => (
          <div key={index} className="menu-item">
            <div className="item-image-container">
              <img src={item.image} alt={item.name} className="item-image" />
            </div>
            <div className="item-content">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="item-price">₱ {item.price}</span>
                <div className="quantity-selector">
                  <button
                    className="qty-btn minus-btn"
                    onClick={() => handleQuantityChange(item.name, -1)}
                  >
                    −
                  </button>
                  <span className="qty-display">
                    {quantities[item.name] || 0}
                  </span>
                  <button
                    className="qty-btn plus-btn"
                    onClick={() => handleQuantityChange(item.name, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserMenu;
