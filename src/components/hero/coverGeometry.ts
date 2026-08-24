export const GARDEN_INTRINSIC = { width: 1672, height: 941 } as const;

export interface CoverBox {
  renderedW: number;
  renderedH: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Reproduces `object-fit: cover` geometry: the image is scaled to fill the
 * container and centered, overflowing (and cropping) on one axis. Shared by
 * the lantern overlay (image-% -> screen px) and the calibration tool
 * (screen px -> image-%), so both agree exactly.
 */
export function coverBox(
  containerW: number,
  containerH: number,
  intrinsicW: number,
  intrinsicH: number
): CoverBox {
  const scale = Math.max(containerW / intrinsicW, containerH / intrinsicH);
  const renderedW = intrinsicW * scale;
  const renderedH = intrinsicH * scale;
  return {
    renderedW,
    renderedH,
    offsetX: (containerW - renderedW) / 2,
    offsetY: (containerH - renderedH) / 2,
  };
}
