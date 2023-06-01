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
  // useEffect(() => {
  //   if (sandbox.current === null) {
  //     return;
  //   }

  //   const maskImage =
  //     "linear-gradient(to right, black 2px, transparent 2px), linear-gradient(to bottom, black 2px, transparent 2px)";
  //   if (isMobile) {
  //     sandbox.current.style.setProperty("--mask-image", maskImage);
  //   } else {
  //     sandbox.current.style.setProperty("--mask-image", "none");
  //   }
  // }, [isMobile]);

  return <div className="App">{isMobile ? <Mobile /> : <Desktop />}</div>;
}

export default App;
