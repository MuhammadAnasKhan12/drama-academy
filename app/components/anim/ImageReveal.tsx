import { useRef } from "react";
import { Picture } from "~/components/ui/Picture";
import { ease, gsap, mq, useGSAP } from "~/lib/gsap";

type Props = {
  picture: ResponsivePicture;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  from?: "bottom" | "left" | "right";
};

const clipFrom = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** Photo that wipes in with a clip-path mask while the image settles from a slight zoom. */
export function ImageReveal({ picture, alt, sizes, className, imgClassName, from = "bottom" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mq.motion, () => {
        const img = ref.current!.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } });
        tl.fromTo(ref.current, { clipPath: clipFrom[from] }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: ease.inOut }).fromTo(
          img,
          { scale: 1.25 },
          { scale: 1, duration: 1.6, ease: ease.out },
          0,
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <Picture picture={picture} alt={alt} sizes={sizes} className="block h-full w-full" imgClassName={`h-full w-full object-cover ${imgClassName ?? ""}`} />
    </div>
  );
}
