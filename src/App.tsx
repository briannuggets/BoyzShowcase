import React, { useRef, useState, useEffect } from "react";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";

function App() {
  const sandbox = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

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
  window.addEventListener("mouseup", (e) => {
    if (sandbox.current === null) {
      return;
    }
    // Save current position of sandbox; used as initial position for next drag
    sandbox.current.dataset.currentx = sandbox.current.dataset.dx || "0";
    sandbox.current.dataset.currenty = sandbox.current.dataset.dy || "0";
    setIsDragging(false);
  });

  window.addEventListener("touchend", (e) => {
    if (sandbox.current === null) {
      return;
    }
    // Save current position of sandbox; used as initial position for next drag
    sandbox.current.dataset.currentx = sandbox.current.dataset.dx || "0";
    sandbox.current.dataset.currenty = sandbox.current.dataset.dy || "0";
    setIsDragging(false);
  });

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

        // Smoothly animate sandbox to new position
        sandbox.current.animate(
          {
            transform: `translate3d(${deltaPercentageX * 25}%, ${
              deltaPercentageY * 25
            }%, ${zoom}px)`,
          },
          { duration: 800, fill: "forwards", easing: "ease-out" }
        );
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

        // Smoothly animate sandbox to new position
        sandbox.current.animate(
          {
            transform: `translate3d(${deltaPercentageX * 25}%, ${
              deltaPercentageY * 25
            }%, ${zoom}px)`,
          },
          { duration: 800, fill: "forwards", easing: "ease-out" }
        );
      };
    } else {
      window.onmousemove = null;
      window.ontouchmove = null;
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

  // Zoom keyboard shortcut
  window.onkeydown = (e) => {
    if (e.key === "1" || e.key === "-") {
      zoom(false);
    } else if (e.key === "2" || e.key === "=") {
      zoom(true);
    }
  };

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
      ></div>
      <div id="interface">
        <div id="zoom">
          <button
            id="zoom-out"
            onClick={() => {
              zoom(false);
            }}
          >
            <CiZoomOut size={25} />
          </button>
          <button
            id="zoom-in"
            onClick={() => {
              zoom(true);
            }}
          >
            <CiZoomIn size={25} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
