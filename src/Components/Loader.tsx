import React, { useEffect, useState } from "react";
import "../Styles/Loader.css";

interface CurtainLoaderProps {
  active: boolean;
}

const Loader: React.FC<CurtainLoaderProps> = ({ active }) => {
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (active) {
      setAnimationClass("curtain-enter");
    } else {
      setAnimationClass("curtain-exit");
    }
  }, [active]);

  return (
    <div className={`curtain-loader ${animationClass}`}>
      <div className="curtain-spinner" />
    </div>
  );
};

export default Loader;
