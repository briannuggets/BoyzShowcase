import { useState, useRef, useEffect } from "react";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import Grid from "./Grid";
import Cards from "./Cards";
import Logo from "./Logo";

const Desktop = () => {
  const sandbox = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // -------------------------- DRAG CONTROLS -------------------------- //
  useEffect(() => {
    // On drag start
    window.addEventListener("mousedown", (e) => {
      if (sandbox.current === null) {
        return;
      }
      // Ignore if click is on a card
      if ((e.target as HTMLElement).closest(".card") !== null) {
        return;
      }
      if ((e.target as HTMLElement).closest(".interface-content") !== null) {
        return;
      }

      // Save initial position of mouse
      sandbox.current.dataset.initialx = e.clientX.toString();
      sandbox.current.dataset.initialy = e.clientY.toString();
      setIsDragging(true);
    });

    // On drag end
    window.addEventListener("mouseup", () => {
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

      // Zoom out on initial click
      sandbox.current.animate(
        {
          transform: `translate3d(${currentX * 25}%, ${currentY * 25}%, ${
            zoom - 300
          }px)`,
        },
        { duration: 100, fill: "forwards", easing: "ease-out" }
      );
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

        // Animate sandbox to new position
        sandbox.current.animate(
          {
            transform: `translate3d(${deltaPercentageX * 25}%, ${
              deltaPercentageY * 25
            }%, ${zoom - 300}px)`,
          },
          { duration: 800, fill: "forwards", easing: "ease-out" }
        );
      };
    } else {
      if (sandbox.current === null) {
        return;
      }
      window.onmousemove = null;

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
        { duration: 200, fill: "forwards", easing: "ease-out" }
      );
    }
  }, [isDragging]);

  // ------------------------ ZOOM CONTROLS ------------------------ //
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

    // Flash zoom buttons on scroll
    let timer: number = -1;
    const handleWheel = () => {
      if (zoomInRef.current === null || zoomOutRef.current === null) {
        return;
      }
      if (timer !== -1) {
        clearTimeout(timer);
      }
      zoomInRef.current.classList.add("flash");
      zoomOutRef.current.classList.add("flash");
      timer = setTimeout(() => {
        if (zoomInRef.current === null || zoomOutRef.current === null) {
          return;
        }
        zoomInRef.current.classList.remove("flash");
        zoomOutRef.current.classList.remove("flash");
      }, 500);
    };
    window.addEventListener("wheel", handleWheel, false);
  }, []);

  return (
    <>
      <div
        id="sandbox"
        data-initialx="0"
        data-initialy="0"
        data-currentx="0"
        data-currenty="0"
        data-zoom="0"
        ref={sandbox}
      >
        <Grid />
        <Logo />
        <Cards isDragging={isDragging} />
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
        <a
          id="teaser"
          className="interface-content"
          href="https://www.youtube.com/watch?v=5bGIWUAq1SY"
          target="_blank"
        >
          WATCH TEASER &#x2197;
        </a>
      </div>
    </>
  );
};

export default Desktop;
