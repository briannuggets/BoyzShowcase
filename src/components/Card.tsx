import { FC, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { MdSwapVert } from "react-icons/md";

interface CardProps {
  name: string;
  position: string;
  year: string;
  src: string;
  altSrc: string;
  id: number;
  drag: boolean;
}

const Card: FC<CardProps> = ({
  name,
  position,
  year,
  src,
  altSrc,
  id,
  drag,
}) => {
  // Attach svg filter to image
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.setProperty("--filter", `url(#grain-${id})`);
    }
  }, []);

  // Hover effect
  const grainRef = useRef<SVGFETurbulenceElement>(null);
  const mapRef = useRef<SVGFEDisplacementMapElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
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

    // Activate title flicker animation
    if (titleRef.current) {
      titleRef.current.classList.add("active");
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

  // Swap images when card is clicked
  const [isAlt, setIsAlt] = useState(false);
  useEffect(() => {
    if (imageRef.current === null) {
      return;
    }

    if (isAlt) {
      imageRef.current.src = altSrc;
    } else {
      imageRef.current.src = src;
    }
  }, [isAlt]);

  // Wrap each character in a span for flicker animation
  const constructText = (text: string) => {
    const spans = [];
    for (let i = 0; i < text.length; i++) {
      if (text[i] === " ") {
        spans.push(<span key={i}>&nbsp;</span>);
      } else {
        spans.push(
          <span
            key={i}
            className="title-char"
            style={{ ["--delay" as string]: `${Math.random() * -20}s` }}
          >
            {text[i]}
          </span>
        );
      }
    }
    return spans;
  };

  return (
    <div className="card-container">
      <div
        className="card"
        id={`card-${id}`}
        onMouseEnter={cardHover}
        onMouseLeave={() => {
          if (titleRef.current) {
            titleRef.current.classList.remove("active");
          }
        }}
        onClick={() => {
          setIsAlt(!isAlt);
        }}
      >
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
      <MdSwapVert color="white" size={30} className="swap" />
      <div className="title" ref={titleRef}>
        <div>
          <span className="name">{constructText(name)}</span>
          <span className="year">{constructText(`'${year}`)}</span>
        </div>
        <span className="position">{constructText(position)}</span>
      </div>
    </div>
  );
};

export default Card;
