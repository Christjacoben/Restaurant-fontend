import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/Auth.css";

export default function Login() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaExpired, setCaptchaExpired] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCaptcha = (token) => {
    if (token) setCaptchaVerified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaVerified) {
      alert("Please verify captcha first.");
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData, {
        withCredentials: true,
      });
      alert("Login successful!");
      navigate(data.user.role === "admin" ? "/admin" : "/user");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="login-container">
        <h2>Login</h2>
        {captchaVerified ? (
          <>
            <form onSubmit={handleSubmit}>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit">Login</button>
            </form>

            <div className="auth-buttons">
              <Link to="/signup" className="btn-secondary">
                Sign Up
              </Link>
              <Link to="/" className="btn-outline">
                ← Back to Home
              </Link>
            </div>
          </>
        ) : (
          <p className="verify-text">Verify captcha to continue.</p>
        )}
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={(token) => {
            if (token) {
              setCaptchaVerified(true);
              setCaptchaExpired(false);
            }
          }}
          onExpired={() => {
            setCaptchaExpired(true);
          }}
        />
      </div>
    </div>
  );
}
