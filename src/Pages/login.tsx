import Form from "../Components/Form.tsx";

export default function Login() {
  return (
    <Form
      name="Login"
      route="http://localhost:8000/user/token"
      method="login"
    />
  );
}
