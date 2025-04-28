
import Form from "../Components/Form.tsx";

export default function Register() {
  return (
    <div className="login-page">
        <div className="form-wrapper">
            <Form
              name="Register"
              route="http://localhost:8000/api/user/register/"
              method="register"
            />
        </div>
    </div>
  );
}
