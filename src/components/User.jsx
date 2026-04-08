import React from "react";
import { TbLogout } from "react-icons/tb";
import { Link, Element, animateScroll as scroll } from "react-scroll";
import "../styles/User.css";
import { FaShoppingCart } from "react-icons/fa";
import UserTableReservation from "./UserTableReservation";
import UserRoomReservation from "./UserRoomReservation";
import UserReservations from "./UserReservations";
import UserMenu from "./UserMenu";
import NavBarLogo from "../assets/sidebar-logo.svg";

function User() {
  const [isRoomReservation, setIsRoomReservation] = React.useState(true);
  const [isTableReservation, setIsTableReservation] = React.useState(false);
  const [isReservationsIsOpen, setIsReservationsIsOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleRommIsOpen = () => {
    setIsRoomReservation(true);
    setIsReservationsIsOpen(false);
    setIsTableReservation(false);
    setIsMenuOpen(false);
  };

  const handleTableIsOpen = () => {
    setIsTableReservation(true);
    setIsReservationsIsOpen(false);
    setIsRoomReservation(false);
    setIsMenuOpen(false);
  };

  const handleReservationIsOpen = () => {
    setIsReservationsIsOpen(true);
    setIsRoomReservation(false);
    setIsTableReservation(false);
    setIsMenuOpen(false);
  };

  const handleMenuIsOpen = () => {
    setIsReservationsIsOpen(false);
    setIsRoomReservation(false);
    setIsTableReservation(false);
    setIsMenuOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <div className="user-dashboard-main">
      <div className="user-dashboard-main-nav-bar">
        <div className="user-dashboard-main-nav-bar-right">
          <img src={NavBarLogo} alt="nav bar logo" />
        </div>

        <div className="user-dashboard-main-nav-bar-left">
          <p onClick={handleMenuIsOpen}>Menu</p>
          <p onClick={handleRommIsOpen}>Room</p>
          <p onClick={handleTableIsOpen}>Table</p>
          <FaShoppingCart size={30} onClick={handleReservationIsOpen} />

          {/* LOGOUT BUTTON */}
          <TbLogout size={35} onClick={handleLogout} className="logout-btn" />
        </div>
      </div>

      {/* Content section */}
      <div className="user-dashboard-main-content">
        {isRoomReservation && (
          <Element name="reservationSection">
            <UserRoomReservation />
          </Element>
        )}
        {isTableReservation && (
          <Element name="tableReservationSection">
            <UserTableReservation />
          </Element>
        )}
        {isReservationsIsOpen && (
          <Element name="userReservationsSection">
            <UserReservations />
          </Element>
        )}
        {isMenuOpen && (
          <Element name="userMenuSection">
            <UserMenu />
          </Element>
        )}
      </div>
    </div>
  );
}

export default User;
