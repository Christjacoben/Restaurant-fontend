import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import "../styles/Auth.css";

export default function Signup() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaExpired, setCaptchaExpired] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

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

    if (formData.password !== formData.confirmPassword) {
      alert(" Passwords do not match!");
      return;
    }

    if (!captchaVerified) {
      alert(" Please verify captcha first.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/auth/signup`,
        {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
          password: formData.password,
        },
        { withCredentials: true },
      );

      alert(" Account created! You're now signed in.");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="signup-container">
        <h2>Create Account</h2>
        {captchaVerified ? (
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="contact"
              placeholder="Contact Number"
              value={formData.contact}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit">Sign Up</button>
          </form>
        ) : (
          <p className="verify-text">Verify captcha to unlock the form.</p>
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
