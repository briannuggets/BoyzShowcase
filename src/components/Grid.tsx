import { useMemo, useState, useEffect, useRef } from "react";

const Grid = () => {
  const [columns, setColumns] = useState(0);
  const [rows, setRows] = useState(0);

  const tileSize = 4;
  const constructTiles = () => {
    const columns = Math.floor((2 * window.innerWidth) / (tileSize * 16)) + 1;
    const rows = Math.floor((2 * window.innerHeight) / (tileSize * 16)) + 1;
    setColumns(columns);
    setRows(rows);

    const tiles = [];
    for (let i = 0; i < columns * rows; i++) {
      tiles.push(
        <div
          className="tile"
          key={i}
          style={{ ["--spawn-delay" as string]: `${Math.random() * 1 + 1.5}s` }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).classList.add("active");
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).classList.remove("active");
          }}
        />
      );
    }

    return tiles;
  };

  const gridRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (gridRef.current === null) {
      return;
    }
    gridRef.current.style.setProperty("--columns", columns.toString());
    gridRef.current.style.setProperty("--rows", rows.toString());
    gridRef.current.style.setProperty("--tile-size", `${tileSize * 16}px`);
  }, [columns, rows]);

  const tiles = useMemo(constructTiles, [window.innerWidth]);

  return (
    <div id="grid" draggable={false} ref={gridRef}>
      <span className="grid-text">eyes on me</span>
      <span className="grid-text">skateboard</span>
      <span className="grid-text">lipsync</span>
      <span className="grid-text">here is</span>
      <span className="grid-text">talk about us</span>
      <span className="grid-text">take me back</span>
      <span className="grid-text">door</span>
      {tiles}
    </div>
  );
};

export default Grid;
