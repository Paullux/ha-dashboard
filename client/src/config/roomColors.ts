/**
 * Color substitution map for SVG room illustrations.
 * Keys = colors used in the light-theme SVG files.
 * Values = replacement colors for dark theme.
 * Only background/structural elements change — furniture keeps its palette.
 */
export const DARK_COLOR_MAP: Record<string, string> = {
  // Wall
  "#EDE5D0": "#1a1d2e",
  // Baseboard fill / stroke
  "#D8CEBC": "#22263a",
  "#C8BCA8": "#2a2e42",
  // Floor
  "#C8906A": "#16141f",
  // Floor grain lines
  "#B8804A": "#201e2e",
};
