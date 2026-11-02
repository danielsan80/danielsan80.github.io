import { PixelGrid } from "./PixelGrid";

const FACES = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export type DieValue = keyof typeof FACES;

type DieProps = {
  value: DieValue;
  size: string;
};

export function Die({ value, size }: DieProps) {
  return <PixelGrid lit={FACES[value]} size={size} />;
}
