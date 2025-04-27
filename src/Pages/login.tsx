import Form from "../Components/Form.tsx";
import "../Styles/Form.css";

//Function to handle login, call this function in the form component
export default function Login() {
  const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, ""); // Ensure no trailing slash
  return (
    <Form
      name="Login"
      route={`${API_URL}/user/token`} // Use the environment variable
      method="login"
    />
  );
}