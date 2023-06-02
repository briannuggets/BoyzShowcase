import { FC, useRef, useEffect } from "react";
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

interface CardsProps {
  isDragging: boolean;
}

const Cards: FC<CardsProps> = ({ isDragging }) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Remove fade-in animation on mobile
  useEffect(() => {
    if (cardsRef.current === null) {
      return;
    }
    if (isMobile) {
      for (const card of cardsRef.current.children) {
        (card as HTMLElement).style.animation = "none";
        (card as HTMLElement).style.opacity = "1";
      }
    }
  }, [isMobile]);

  return (
    <div id={isMobile ? "cards-mobile" : "cards"} ref={cardsRef}>
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
  );
};

export default Cards;
