import Cards from "./Cards";
import Logo from "./Logo";
import { HiChevronDoubleDown } from "react-icons/hi";

const Mobile = () => {
  return (
    <div id="grid-mobile">
      <section id="hero-mobile">
        <Logo />
        <a
          id="teaser"
          href="https://www.youtube.com/watch?v=5bGIWUAq1SY"
          target="_blank"
        >
          WATCH TEASER &#x2197;
        </a>
        <div id="hero-prompt">
          <span>CONCEPT PHOTOS </span>
          <HiChevronDoubleDown size={20} color="white" />
        </div>
      </section>
      <Cards isDragging={false} />
    </div>
  );
};

export default Mobile;
