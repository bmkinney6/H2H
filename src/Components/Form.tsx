import { FormEvent, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../Styles/Form.css";
import "../Styles/Index.css";

interface FormProps {
  route: string;
  method: string;
}

function Form({ route, method }: FormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const name = method === "login" ? "login" : "Register";

  const handleSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault(); //prevents from submitting form

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
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

  return (
    <form onSubmit={handleSubmit} className="form-container text-center">
      <img //replace with our logo!
        className="mt-5 rounded-2"
        src="src/assets/H2HLogo.jpg"
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
      <input
        className="form-control"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-lg btn-primary btn-block mt-3" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;
