import { PixelGrid } from "../pixel-grid/PixelGrid";

const LOGO_CELLS = [0, 1, 3, 4, 5, 6, 7, 8];

type PixelLogoProps = {
  size: string;
};

export function PixelLogo({ size }: PixelLogoProps) {
  return <PixelGrid lit={LOGO_CELLS} size={size} />;
}
