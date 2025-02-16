import LoginForm from "../Components/Form";

export default function Register() {
  return (
    <LoginForm
      name="Register"
      route="http://localhost:8000/api/user/register/"
      method="register"
    />
  );
}
