import Form from "../Components/Form.tsx";
import "../Styles/Form.css";

//Function to handle login, call this function in the form component
export default function Login() {
  const API_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, ""); // Ensure no trailing slash
  return (
      <div className="login-page">
        <div className="form-wrapper">
          <Form
              name="Login"
              route={`http://${API_URL}:8000/user/token`}
              method="login"
          />
        </div>
      </div>
  );
}