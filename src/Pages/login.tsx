import Form from "../Components/Form.tsx";
import "../Styles/Form.css";

export default function Login() {
  return (
      <div className="login-page">
          <div className="form-wrapper">
              <Form name="Login" method="login" route="http://localhost:8000/user/token" />
          </div>
      </div>

  );
}
