import type { SkillLevel } from "../../content/skills";
import { PixelGrid } from "../pixel-grid/PixelGrid";
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

type MarkerProps = {
  level: SkillLevel;
};

export function Marker({ level }: MarkerProps) {
  return (
    <>
      <PixelGrid lit={ORDER.slice(0, CELLS[level])} size="0.75em" />
      <span className={styles.level}>{level}</span>
    </>
  );
}
