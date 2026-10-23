/** Responsive image produced by vite-imagetools for `*.jpg?photo` imports. */
type ResponsivePicture = {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
};
declare module "*?photo" {
  const picture: ResponsivePicture;
  export default picture;
}
