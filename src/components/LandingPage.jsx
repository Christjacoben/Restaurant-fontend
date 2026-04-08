import { useNavigate } from "react-router-dom";
import CenterSingleBed from "../assets/Untitled-design.svg";
import "../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <div className="landing-container">
      <div className="top">
        <div className="header">
          <li onClick={handleLoginClick}>Login</li>
        </div>
        <button onClick={handleLoginClick}>BOOK YOUR STAY</button>
      </div>
      <div className="center">
        <div className="center-title">
          <h3>THE COLLECTION</h3>
          <h1>Featured Suites</h1>
        </div>
        <div className="center-single-bed"></div>
        <h2
          style={{
            marginTop: "-30px",
            color: "#b98144",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          SINGLE BED
        </h2>
        <p>
          A cozy and thoughtfully designed space perfect for solo travelers.
          Enjoy comfort, privacy, and a relaxing atmosphere for a restful stay
        </p>
      </div>
      <div className="center">
        <div className="center-double-bed"></div>
        <h2
          style={{
            marginTop: "-30px",
            color: "#b98144",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          DOUBLE BED
        </h2>
        <p>
          Ideal for couples or friends, this room offers a perfect balance of
          comfort and space. Relax in a warm, modern setting designed for shared
          moments
        </p>
      </div>
      <div className="center" style={{ marginTop: "-40px" }}>
        <div className="center-family-size"></div>
        <h2
          style={{
            marginTop: "-30px",
            color: "#b98144",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
          }}
        >
          FAMILY SIZE
        </h2>
        <p>
          Spacious and welcoming, our family room is designed for comfort and
          togetherness. Enjoy a relaxing stay with enough space for everyone to
          unwind
        </p>
      </div>

      <footer className="footer">
        <p>
          {"Copyright "}
          {new Date().getFullYear()} Bochzhog Hotel & Restaurant
        </p>
        <p> All Rights Reserved</p>
        <p>Purok 5, Maharlika Highway, Brgy. Culing West, Cabatuan, Isabela</p>
      </footer>
    </div>
  );
}
