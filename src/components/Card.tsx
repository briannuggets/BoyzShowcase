import { FC, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface CardProps {
  name: string;
  src: string;
  id: number;
  drag: boolean;
}

const Card: FC<CardProps> = ({ name, src, id, drag }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.setProperty("--filter", `url(#grain-${id})`);
    }
  }, []);

  // Hover effect
  const grainRef = useRef<SVGFETurbulenceElement>(null);
  const mapRef = useRef<SVGFEDisplacementMapElement>(null);
  const playDuration = 0.5;
  const cardHover = () => {
    if (drag) {
      return;
    }
    if (grainRef.current === null) {
      return;
    }
    if (mapRef.current === null) {
      return;
    }

    // Animate grain by incrementing seed values
    if (grainRef.current.seed.baseVal === 100) {
      gsap.to(grainRef.current, {
        duration: playDuration,
        attr: {
          seed: 0,
        },
      });
    } else {
      gsap.to(grainRef.current, {
        duration: playDuration,
        attr: {
          seed: 100,
        },
      });
    }

    // Add grain on hover, then remove it by scaling the map to 0
    gsap.to(mapRef.current, {
      duration: playDuration / 2,
      attr: {
        scale: 20,
      },
    });
    gsap.to(mapRef.current, {
      duration: playDuration / 2,
      delay: playDuration / 2,
      attr: {
        scale: 0,
      },
    });
  };

  return (
    <div className="card" id={`card-${id}`} onMouseEnter={cardHover}>
      <img src={src} draggable={false} ref={imageRef} />
      <svg>
        <defs>
          <filter id={`grain-${id}`}>
            <feTurbulence
              baseFrequency="0.8, 0.8"
              seed={0}
              type="fractalNoise"
              result="noise"
              ref={grainRef}
            ></feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" ref={mapRef} />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default Card;
