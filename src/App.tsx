import { useEffect } from "react";
import Desktop from "./components/Desktop";
import Mobile from "./components/Mobile";

function App() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (isMobile) {
      document.body.style.display = "block";
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [isMobile]);

  return <div className="App">{isMobile ? <Mobile /> : <Desktop />}</div>;
}

export default App;
