import React, { useState, useContext, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext"; // Adjust the import path as necessary
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"; // Adjust the import path as necessary
import "../Styles/Form.css";
import "../Styles/Index.css";

const passwordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};

const strengthLabel = (strength: number) => {
  switch (strength) {
    case 0:
    case 1:
      return { label: "Weak", color: "red" };
    case 2:
    case 3:
      return { label: "Moderate", color: "orange" };
    case 4:
    case 5:
      return { label: "Strong", color: "green" };
    default:
      return { label: "", color: "" };
  }
};

const LoginForm: React.FC<{ name: string; method: string; route: string }> = ({
  name,
  method,
  route,
}) => {
  const [username, setUsername] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault(); // Prevents the form from submitting

    if (password !== confirmPassword && method === "register") {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    if (method === "register") {
      formData.append("first_name", firstname);
      formData.append("last_name", lastname);
      formData.append("email", email);
      formData.append("dob", dob);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
    }
    formData.append("password", password);

    try {
      const res = await axios.post(route, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        setIsLoggedIn(true); // Update the login state
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(password);
  const { label, color } = strengthLabel(strength);

  return (
      <div>
    <form onSubmit={handleSubmit} className="form-container glass text-center">
      <img // our logo
        className="mt-5 rounded-2 mx-auto"
        src="../../public/H2HLogo.jpg"
        width={100}
        height={100}
        alt="Logo"
      />
      <h1>{name}</h1>
      <input
        className="form-control mb-2"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {method === "register" && (
        <>
          <input
            className="form-control mb-2"
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <input
            className="form-control mb-2"
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <input
            className="form-control mb-2"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form-control mb-2"
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <input
            className="form-control mb-2"
            type="file"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
          />
        </>
      )}
      <input
        className="form-control mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {method === "register" && (
        <>
          <div>
            Password strength: <span style={{ color }}>{label}</span>
          </div>
          <input
            className="form-control mb-2"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      )}
      <button
        className="btn btn-lg btn-primary btn-block mt-3"
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : name}
      </button>
    </form>
      </div>
  );
};

export default LoginForm;
