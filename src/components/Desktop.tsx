import { useState, useRef, useEffect } from "react";
import { CiZoomIn, CiZoomOut } from "react-icons/ci";
import Grid from "./Grid";
import Card from "./Card";
import Card0 from "../assets/cards/0.jpg";
import Card1 from "../assets/cards/1.jpg";
import Card2 from "../assets/cards/2.jpg";
import Card3 from "../assets/cards/3.jpg";
import Card4 from "../assets/cards/4.jpg";
import Card5 from "../assets/cards/5.jpg";
import Card6 from "../assets/cards/6.jpg";
import Card7 from "../assets/cards/7.jpg";
import Card8 from "../assets/cards/8.jpg";
import Card9 from "../assets/cards/9.jpg";
import Card10 from "../assets/cards/10.jpg";
import Alt0 from "../assets/cards-alt/0.jpg";
import Alt1 from "../assets/cards-alt/1.jpg";
import Alt2 from "../assets/cards-alt/2.jpg";
import Alt3 from "../assets/cards-alt/3.jpg";
import Alt4 from "../assets/cards-alt/4.jpg";
import Alt5 from "../assets/cards-alt/5.jpg";
import Alt6 from "../assets/cards-alt/6.jpg";
import Alt7 from "../assets/cards-alt/7.jpg";
import Alt8 from "../assets/cards-alt/8.jpg";
import Alt9 from "../assets/cards-alt/9.jpg";
import Alt10 from "../assets/cards-alt/10.jpg";

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
        for (let i = 1; i < sandbox.current.children.length; i++) {
          sandbox.current.children[i].animate(
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
        <Card
          name="SANGYEON"
          position="MAIN VOCALIST"
          year={"96"}
          src={Card0}
          altSrc={Alt0}
          id={0}
          drag={isDragging}
        />
        <Card
          name="JACOB"
          position="LEAD RAPPER"
          year={"97"}
          src={Card1}
          altSrc={Alt1}
          id={1}
          drag={isDragging}
        />
        <Card
          name="YOUNGHOON"
          position="VISUAL"
          year={"97"}
          src={Card2}
          altSrc={Alt2}
          id={2}
          drag={isDragging}
        />
        <Card
          name="HYUNJAE"
          position="VISUAL"
          year={"97"}
          src={Card3}
          altSrc={Alt3}
          id={3}
          drag={isDragging}
        />
        <Card
          name="JUYEON"
          position="MAIN DANCER"
          year={"98"}
          src={Card4}
          altSrc={Alt4}
          id={4}
          drag={isDragging}
        />
        <Card
          name="KEVIN"
          position="MAIN VOCALIST"
          year={"98"}
          src={Card5}
          altSrc={Alt5}
          id={5}
          drag={isDragging}
        />
        <Card
          name="CHANHEE"
          position="MAIN VOCALIST"
          year={"98"}
          src={Card6}
          altSrc={Alt6}
          id={6}
          drag={isDragging}
        />
        <Card
          name="CHANGMIN"
          position="MAIN DANCER"
          year={"98"}
          src={Card7}
          altSrc={Alt7}
          id={7}
          drag={isDragging}
        />
        <Card
          name="HAKNYEON"
          position="LEAD DANCER"
          year={"99"}
          src={Card8}
          altSrc={Alt8}
          id={8}
          drag={isDragging}
        />
        <Card
          name="SUNWOO"
          position="MAIN RAPPER"
          year={"00"}
          src={Card9}
          altSrc={Alt9}
          id={9}
          drag={isDragging}
        />
        <Card
          name="ERIC"
          position="LEAD RAPPER"
          year={"00"}
          src={Card10}
          altSrc={Alt10}
          id={10}
          drag={isDragging}
        />
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
    </>
  );
};

export default Desktop;
