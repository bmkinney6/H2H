import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

type LoaderLinkProps = {
  to: string;
  children: React.ReactNode;
  setGlobalLoading: (v: boolean) => void;
  delay?: number; // optional delay before navigating (ms)
};

const LoaderLink: React.FC<LoaderLinkProps> = ({ to, children, setGlobalLoading, delay = 500 }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    setGlobalLoading(true);
    setTimeout(() => {
      navigate(to);
    }, delay);
  }, [to, navigate, setGlobalLoading, delay]);

  return (
    <span onClick={handleClick} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
      {children}
    </span>
  );
};

export default LoaderLink;
