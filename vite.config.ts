import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    // `import img from "./photo.jpg?photo"` → responsive AVIF/WebP/JPEG <picture> data
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has("photo")) {
          return new URLSearchParams({
            w: "480;800;1200;1600",
            format: "avif;webp;jpg",
            quality: "72",
            as: "picture",
          });
        }
        return new URLSearchParams();
      },
    }),
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    include: ["gsap", "gsap/ScrollTrigger", "gsap/SplitText", "gsap/Flip", "@gsap/react", "lenis", "motion/react", "zustand", "zustand/middleware"],
  },
});
