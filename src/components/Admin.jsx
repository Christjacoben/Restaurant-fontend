import { useNavigate, Link } from "react-router-dom";
import { FaCalendarCheck, FaK } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { BsDoorOpenFill } from "react-icons/bs";
import { IoBook } from "react-icons/io5";
import { MdTableBar } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import SidebardLogo from "../assets/sidebar-logo.svg";
import AdminReservations from "./ReservationRoomCategory";
import HomeAdminDashboard from "./HomeAdminDashboard";
import { GrFolderCycle } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
import SaleReport from "./SaleReport";
import Rooms from "./Rooms";
import Report from "./Report";
import Restaurant from "./Restaurant";
import TableList from "./TableList";
import { BiSolidDashboard } from "react-icons/bi";
import BackupAndRestore from "./BackupAndRestore";
import User from "./UserChanges";
import "../styles/Admin.css";
import { useState } from "react";

export default function Admin() {
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(false);
  const [isTalbleListOpen, setIsTalbleListOpen] = useState(false);
  const [isSaleReportOpen, setIsSaleReportOpen] = useState(false);
  const [isBackupAndRestoreOpen, setIsBackupAndRestoreOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isHOmeOpen, setIsHomeOpen] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleRoomIsOpen = () => {
    setIsRoomOpen(!isRoomOpen);
    setIsTableOpen(false);
    setIsTalbleListOpen(false);
    setIsRestaurantOpen(false);
    setIsUserOpen(false);
    setIsSaleReportOpen(false);
    setIsHomeOpen(false);
    setIsBackupAndRestoreOpen(false);
  };

  const handleTableIsOpen = () => {
    setIsTableOpen(!isTableOpen);
    setIsRoomOpen(false);
    setIsTalbleListOpen(false);
    setIsRestaurantOpen(false);
    setIsUserOpen(false);
    setIsSaleReportOpen(false);
    setIsHomeOpen(false);
    setIsBackupAndRestoreOpen(false);
  };
  const handleRestaurantIsOpen = () => {
    setIsRestaurantOpen(!isRestaurantOpen);
    setIsTableOpen(false);
    setIsRoomOpen(false);
    setIsTalbleListOpen(false);
    setIsUserOpen(false);
    setIsHomeOpen(false);
  };

  const handleTableListOpen = () => {
    setIsTalbleListOpen(!isTalbleListOpen);
    setIsRestaurantOpen(false);
    setIsRoomOpen(false);
    setIsTableOpen(false);
    setIsUserOpen(false);
    setIsHomeOpen(false);
  };
  const handleUserIsOpen = () => {
    setIsUserOpen(!isUserOpen);
    setIsRestaurantOpen(false);
    setIsRoomOpen(false);
    setIsTableOpen(false);
    setIsHomeOpen(false);
    setIsSaleReportOpen(false);
    setIsTalbleListOpen(false);
    setIsBackupAndRestoreOpen(false);
  };

  const handleHomeIsOpen = () => {
    setIsUserOpen(false);
    setIsHomeOpen(!isHOmeOpen);
    setIsRestaurantOpen(false);
    setIsRoomOpen(false);
    setIsTableOpen(false);
    setIsTalbleListOpen(false);
    setIsSaleReportOpen(false);
    setIsBackupAndRestoreOpen(false);
  };

  const handleSaleReportIsOpen = () => {
    setIsSaleReportOpen(!isSaleReportOpen);
    setIsUserOpen(false);
    setIsHomeOpen(false);
    setIsRestaurantOpen(false);
    setIsRoomOpen(false);
    setIsTableOpen(false);
    setIsTalbleListOpen(false);
    setIsBackupAndRestoreOpen(false);
  };
  const handleBackupAndRestoreIsOpen = () => {
    setIsBackupAndRestoreOpen(!isBackupAndRestoreOpen);
    setIsUserOpen(false);
    setIsHomeOpen(false);
    setIsRestaurantOpen(false);
    setIsRoomOpen(false);
    setIsTableOpen(false);
    setIsTalbleListOpen(false);
    setIsSaleReportOpen(false);
  };

  return (
    <div className="Admin-Main">
      <div className="main-sidebar">
        <div className="main-sidebar-top">
          <img src={SidebardLogo} alt="sidebarlogo" />
        </div>
        <div className="main-sidebar-bottom">
          <div className="side-items" onClick={handleHomeIsOpen}>
            <BiSolidDashboard size={40} color="white" />
            <p>Dashboard</p>
          </div>
          <div className="side-items" onClick={handleTableIsOpen}>
            <FaCalendarCheck size={40} color="white" />
            <p> Reservations</p>
          </div>
          <div className="side-items" onClick={handleUserIsOpen}>
            <FaUserCircle size={40} color="white" />
            <p>Users</p>
          </div>
          <div className="side-items" onClick={handleRoomIsOpen}>
            <BsDoorOpenFill size={40} color="white" />
            <p>Report</p>
          </div>
          <div className="side-items" onClick={handleSaleReportIsOpen}>
            <TbReport size={40} color="white" />
            <p>Sale Report</p>
          </div>
          <div className="side-items" onClick={handleBackupAndRestoreIsOpen}>
            <GrFolderCycle size={35} color="white" />
            <p>Backup&Restore</p>
          </div>
          <div className="side-items" onClick={handleLogout}>
            <FiLogOut size={40} color="white" />
            <p>Logout</p>
          </div>
        </div>
      </div>
      <div className="main-content">
        {isTableOpen && (
          <div className="reservation">
            <AdminReservations />
          </div>
        )}
        {isRoomOpen && (
          <div className="rooms">
            <Report />
          </div>
        )}
        {isUserOpen && (
          <div className="user">
            <User />
          </div>
        )}
        {isSaleReportOpen && (
          <div className="sale-report">
            <SaleReport />
          </div>
        )}
        {isHOmeOpen && (
          <div className="home-admin-dashboard">
            <HomeAdminDashboard />
          </div>
        )}
        {isBackupAndRestoreOpen && (
          <div className="backup-and-restore">
            <BackupAndRestore />
          </div>
        )}
      </div>
    </div>
  );
}
