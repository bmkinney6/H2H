
import Form from "../Components/Form.tsx";

// Function to handle registration, call this function in the form component
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
