import { FC } from "react";

interface CardProps {
  name: string;
  src: string;
}

const Card: FC<CardProps> = ({ name, src }) => {
  return (
    <div className="card">
      <img src={src} draggable={false} />
    </div>
  );
};

export default Card;
