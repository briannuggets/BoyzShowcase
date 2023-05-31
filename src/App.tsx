import { useRef, useState, useEffect } from "react";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import Card from "./components/Card";
import Card0 from "./assets/cards/0.jpg";
import Card1 from "./assets/cards/1.jpg";
import Card2 from "./assets/cards/2.jpg";
import Card3 from "./assets/cards/3.jpg";
import Card4 from "./assets/cards/4.jpg";
import Card5 from "./assets/cards/5.jpg";
import Card6 from "./assets/cards/6.jpg";
import Card7 from "./assets/cards/7.jpg";
import Card8 from "./assets/cards/8.jpg";
import Card9 from "./assets/cards/9.jpg";
import Card10 from "./assets/cards/10.jpg";

function App() {
  const sandbox = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // On drag start
    window.addEventListener("mousedown", (e) => {
      if (sandbox.current === null) {
        return;
      }
      // Save initial position of mouse
      sandbox.current.dataset.initialx = e.clientX.toString();
      sandbox.current.dataset.initialy = e.clientY.toString();
      setIsDragging(true);
    });
    window.addEventListener("touchstart", (e) => {
      if (sandbox.current === null) {
        return;
      }
      // Save initial position of mouse
      sandbox.current.dataset.initialx = e.touches[0].clientX.toString();
      sandbox.current.dataset.initialy = e.touches[0].clientY.toString();
      setIsDragging(true);
    });

    // On drag end
    window.addEventListener("mouseup", () => {
      if (sandbox.current) {
        setIsDragging(false);
      }
    });
    window.addEventListener("touchend", () => {
      if (sandbox.current) {
        setIsDragging(false);
      }
    });
  }, []);

  // Drag handler
  useEffect(() => {
    if (isDragging) {
      if (sandbox.current === null) {
        return;
      }
      const initialX = parseInt(sandbox.current.dataset.initialx || "0");
      const initialY = parseInt(sandbox.current.dataset.initialy || "0");
      const currentX = parseFloat(sandbox.current.dataset.currentx || "0");
      const currentY = parseFloat(sandbox.current.dataset.currenty || "0");
      const zoom = parseInt(sandbox.current.dataset.zoom || "0");
      window.ontouchmove = (e) => {
        if (sandbox.current === null) {
          return;
        }

        const dragSpeed = 2.5;
        const maxDeltaX = window.innerWidth / dragSpeed;
        const maxDeltaY = window.innerHeight / dragSpeed;

        // Add current drag offset to previous drag offset
        let deltaPercentageX =
          (e.touches[0].clientX - initialX) / maxDeltaX + currentX;
        let deltaPercentageY =
          (e.touches[0].clientY - initialY) / maxDeltaY + currentY;

        // Clamp values between -1 and 1
        deltaPercentageX = Math.min(Math.max(deltaPercentageX, -1), 1);
        deltaPercentageY = Math.min(Math.max(deltaPercentageY, -1), 1);

        sandbox.current.dataset.dx = deltaPercentageX.toString();
        sandbox.current.dataset.dy = deltaPercentageY.toString();

        // Zoom out and smoothly animate sandbox to new position
        sandbox.current.animate(
          {
            transform: `translate3d(${deltaPercentageX * 25}%, ${
              deltaPercentageY * 25
            }%, ${Math.max(zoom - 500, -300)}px)`,
          },
          { duration: 800, fill: "forwards", easing: "ease-out" }
        );

        // Skew cards relative to drag direction
        for (const child of sandbox.current.children) {
          child.animate(
            {
              transform: `skewX(${deltaPercentageX * -7}deg)`,
            },
            { duration: 800, easing: "ease-out" }
          );
        }
      };
      window.onmousemove = (e) => {
        if (sandbox.current === null) {
          return;
        }

        const dragSpeed = 2.5;
        const maxDeltaX = window.innerWidth / dragSpeed;
        const maxDeltaY = window.innerHeight / dragSpeed;

        // Add current drag offset to previous drag offset
        let deltaPercentageX = (e.clientX - initialX) / maxDeltaX + currentX;
        let deltaPercentageY = (e.clientY - initialY) / maxDeltaY + currentY;

        // Clamp values between -1 and 1
        deltaPercentageX = Math.min(Math.max(deltaPercentageX, -1), 1);
        deltaPercentageY = Math.min(Math.max(deltaPercentageY, -1), 1);

        sandbox.current.dataset.dx = deltaPercentageX.toString();
        sandbox.current.dataset.dy = deltaPercentageY.toString();

        // Zoom out and smoothly animate sandbox to new position
        sandbox.current.animate(
          {
            transform: `translate3d(${deltaPercentageX * 25}%, ${
              deltaPercentageY * 25
            }%, ${Math.max(zoom - 500, -300)}px)`,
          },
          { duration: 800, fill: "forwards", easing: "ease-out" }
        );

        // Skew cards relative to drag direction
        for (const child of sandbox.current.children) {
          child.animate(
            {
              transform: `skewX(${deltaPercentageX * -7}deg)`,
            },
            { duration: 800, easing: "ease-out", fill: "forwards" }
          );
        }
      };
    } else {
      if (sandbox.current === null) {
        return;
      }
      // Remove drag handlers
      window.onmousemove = null;
      window.ontouchmove = null;

      // Save current drag offset; used as initial offset for next drag
      sandbox.current.dataset.currentx = sandbox.current.dataset.dx || "0";
      sandbox.current.dataset.currenty = sandbox.current.dataset.dy || "0";

      // Smoothly zoom back in
      const currentX = parseFloat(sandbox.current.dataset.currentx || "0");
      const currentY = parseFloat(sandbox.current.dataset.currenty || "0");
      const zoom = parseInt(sandbox.current.dataset.zoom || "0");
      sandbox.current.animate(
        {
          transform: `translate3d(${currentX * 25}%, ${
            currentY * 25
          }%, ${zoom}px)`,
        },
        { duration: 600, fill: "forwards", easing: "ease-out" }
      );

      // Smoothly reset skew of cards
      for (const child of sandbox.current.children) {
        child.animate(
          { transform: "skewX(0deg)" },
          { duration: 400, easing: "ease-out", fill: "forwards" }
        );
      }
    }
  }, [isDragging]);

  // Zoom handler
  const maxZoom = 300;
  const minZoom = -300;
  const zoom = (increase: boolean) => {
    if (sandbox.current === null) {
      return;
    }

    // Clamp zoom between min and max
    const zoom = parseInt(sandbox.current.dataset.zoom || "0");
    if (zoom >= maxZoom && increase) {
      return;
    } else if (zoom <= minZoom && !increase) {
      return;
    }

    if (increase) {
      sandbox.current.dataset.zoom = (zoom + 100).toString();
    } else {
      sandbox.current.dataset.zoom = (zoom - 100).toString();
    }

    // Smooth zoom animation
    const currentX = parseFloat(sandbox.current.dataset.currentx || "0");
    const currentY = parseFloat(sandbox.current.dataset.currenty || "0");
    sandbox.current.animate(
      {
        transform: `translate3d(${currentX * 25}%, ${currentY * 25}%, ${
          sandbox.current.dataset.zoom
        }px)`,
      },
      { duration: 800, fill: "forwards", easing: "ease-out" }
    );
  };

  // Zoom keyboard shortcut with on-press indicator
  const zoomInRef = useRef<HTMLButtonElement>(null);
  const zoomOutRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    window.onkeydown = (e) => {
      if (zoomInRef.current === null || zoomOutRef.current === null) {
        return;
      }
      if (isDragging) {
        return;
      }

      // Light up button on key press
      if (e.key === "1" || e.key === "-") {
        zoomOutRef.current.classList.add("active");
        zoom(false);
      } else if (e.key === "2" || e.key === "=") {
        zoomInRef.current.classList.add("active");
        zoom(true);
      }
    };
    window.onkeyup = () => {
      if (zoomInRef.current === null || zoomOutRef.current === null) {
        return;
      }
      // Remove button light on key release
      zoomOutRef.current.classList.remove("active");
      zoomInRef.current.classList.remove("active");
    };
  }, []);

  return (
    <div className="App">
      <div
        id="sandbox"
        data-initialx="0"
        data-initialy="0"
        data-currentx="0"
        data-currenty="0"
        data-zoom="0"
        ref={sandbox}
      >
        <Card name="sangyeon" src={Card0} id={0} drag={isDragging} />
        <Card name="jacob" src={Card1} id={1} drag={isDragging} />
        <Card name="younghoon" src={Card2} id={2} drag={isDragging} />
        <Card name="hyunjae" src={Card3} id={3} drag={isDragging} />
        <Card name="juyeon" src={Card4} id={4} drag={isDragging} />
        <Card name="kevin" src={Card5} id={5} drag={isDragging} />
        <Card name="chanhee" src={Card6} id={6} drag={isDragging} />
        <Card name="changmin" src={Card7} id={7} drag={isDragging} />
        <Card name="haknyeon" src={Card8} id={8} drag={isDragging} />
        <Card name="sunwoo" src={Card9} id={9} drag={isDragging} />
        <Card name="eric" src={Card10} id={10} drag={isDragging} />
      </div>
      <div id="interface">
        <div id="zoom" className="interface-content">
          <button
            onClick={() => {
              zoom(false);
            }}
            ref={zoomOutRef}
          >
            <CiZoomOut size={25} />
          </button>
          <button
            onClick={() => {
              zoom(true);
            }}
            ref={zoomInRef}
          >
            <CiZoomIn size={25} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
