import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Reservation from "./components/Reservation";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Rooms from "./components/Rooms";
import Restaurant from "./components/Restaurant";
import TableList from "./components/TableList";
import Admin from "./components/Admin";
import User from "./components/User";
import AdminReservations from "./components/AdminReservation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/tablelist" element={<TableList />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
        <Route path="/adminreservations" element={<AdminReservations />} />
      </Routes>
    </Router>
  );
}

export default App;
