const svgAssets = import.meta.glob('/src/**/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** Resolves an SVG path to its Vite-generated asset URL. */
export function assetUrl(path: string): string {
  const url = svgAssets[path];
  if (!url) throw new Error(`SVG asset not found: ${path}`);
  return url;
}

export const codeCards = [
  'Property 26.svg', 'Property 19.svg', 'Front (2).svg', 'Front.svg',
  'Property 221.svg', 'Property 22.svg', 'Property 20.svg', 'Property 21.svg',
  'Property 23.svg', 'Property 24.svg', 'Property 25.svg', 'Front (1).svg',
  'Front (3).svg', 'Front (4).svg', 'Front (5).svg', 'Front (6).svg',
  'Front (7).svg', 'Front (8).svg',
].map((name) => assetUrl(`/src/assets/${name}`));

export const gamingCards = [
  'Component 2.svg', 'Property 1=Component 2 (17).svg', 'Property 2.svg',
  'Property 3.svg', 'Property 4.svg', 'Property 5.svg', 'Front (11).svg',
  'Property 6.svg', 'Property 7.svg', 'Property 8.svg', 'Property 9.svg',
  'Property 10.svg', 'Property 11.svg', 'Property 12.svg', 'Property 13.svg',
  'Property 14.svg', 'Property 15.svg', 'Property 16.svg',
].map((name) => assetUrl(`/src/assets/${name}`));

export const cardBacks = {
  code: assetUrl('/src/assets/Property 18.svg'),
  gaming: assetUrl('/src/assets/Property 1.svg'),
};

export const playerIcons = {
  code: {
    blue: assetUrl('/src/assets/label 1.svg'),
    orange: assetUrl('/src/assets/label.svg'),
  },
  gaming: {
    blue: assetUrl('/src/assets/chess_pawnblue.svg'),
    orange: assetUrl('/src/assets/chesspawn.svg'),
  },
};
