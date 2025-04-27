import Form from "../Components/Form.tsx";
import "../Styles/Form.css";

//Function to handle login, call this function in the form component
export default function Login() {
  return (
      <div className="login-page">
          <div className="form-wrapper">
              <Form name="Login" method="login" route="http://localhost:8000/user/token" />
          </div>
      </div>

  );
}
