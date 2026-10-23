import type { ImgHTMLAttributes } from "react";

type Props = {
  picture: ResponsivePicture;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "className">;

const mime: Record<string, string> = { avif: "image/avif", webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg" };

/** Responsive <picture> with AVIF/WebP/JPEG, explicit width/height (no layout shift) and lazy loading. */
export function Picture({ picture, alt, sizes = "100vw", priority = false, className, imgClassName, ...rest }: Props) {
  return (
    <picture className={className}>
      {Object.entries(picture.sources).map(([format, srcSet]) => (
        <source key={format} type={mime[format]} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={picture.img.src}
        width={picture.img.w}
        height={picture.img.h}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={imgClassName}
        {...rest}
      />
    </picture>
  );
}
