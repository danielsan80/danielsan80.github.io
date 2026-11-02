import { CELL, CELLS_PER_SIDE, GRID, STEP } from "./geometry";
import styles from "./PixelGrid.module.css";

const CELLS = Array.from({ length: CELLS_PER_SIDE ** 2 }, (_, cell) => cell);

type PixelGridProps = {
  lit: number[];
  size: string;
};

export function PixelGrid({ lit, size }: PixelGridProps) {
  return (
    <svg
      className={styles.grid}
      viewBox={`0 0 ${GRID} ${GRID}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      {CELLS.map((cell) => (
        <rect
          key={cell}
          className={lit.includes(cell) ? styles.on : styles.off}
          data-lit={lit.includes(cell)}
          x={(cell % CELLS_PER_SIDE) * STEP}
          y={Math.floor(cell / CELLS_PER_SIDE) * STEP}
          width={CELL}
          height={CELL}
        />
      ))}
    </svg>
  );
}
