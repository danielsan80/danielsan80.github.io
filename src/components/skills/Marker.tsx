import type { SkillLevel } from "../../content/skills";
import styles from "./Marker.module.css";

// How full the square reads: past half at the lowest level, because on a CV the
// mere presence of a skill already claims professional command (doc/STILE.md).
const CELLS: Record<SkillLevel, number> = {
  proficient: 5,
  advanced: 7,
  expert: 9,
};

// Bottom row first, left to right within each row.
const ORDER = [6, 7, 8, 3, 4, 5, 0, 1, 2];

const SIDE = 2.5;
const STEP = 3.25;

type MarkerProps = {
  level: SkillLevel;
};

export function Marker({ level }: MarkerProps) {
  const on = new Set(ORDER.slice(0, CELLS[level]));

  return (
    <>
      <svg
        className={styles.marker}
        viewBox="0 0 9 9"
        aria-hidden="true"
        focusable="false"
      >
        {ORDER.map((cell) => (
          <rect
            key={cell}
            className={on.has(cell) ? styles.on : styles.off}
            data-lit={on.has(cell)}
            x={(cell % 3) * STEP}
            y={Math.floor(cell / 3) * STEP}
            width={SIDE}
            height={SIDE}
          />
        ))}
      </svg>
      <span className={styles.level}>{level}</span>
    </>
  );
}
