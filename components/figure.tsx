import Image, { type StaticImageData } from "next/image";

// Datasheet figures. A real screenshot renders with next/image; until one
// exists, a drawn placeholder stands in (named in the caption and alt).

type Aspect = "wide" | "standard";

const aspects: Record<Aspect, string> = {
  wide: "aspect-16/10",
  standard: "aspect-4/3",
};

// The screenshots are wider than the frames, so object-cover crops the
// sides; `position` keeps the part that matters in view.
type Position = "left" | "center" | "right";

const positions: Record<Position, string> = {
  left: "object-left",
  center: "object-center",
  right: "object-right",
};

export type Screenshot = { src: StaticImageData; position?: Position };

// A generic app screen: title bar, sidebar, a heading, rows, one accent block.
function ScreenPlaceholder({ alt, aspect }: { alt: string; aspect: Aspect }) {
  return (
    <div role="img" aria-label={alt} className={`flex flex-col border border-rule bg-surface ${aspects[aspect]}`}>
      <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
        <span className="h-2 w-1/5 bg-fg" />
        <span className="ml-auto h-2 w-1/12 bg-rule" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex w-1/4 flex-col gap-3 border-r border-rule p-4">
          <span className="h-1.5 w-4/5 bg-rule" />
          <span className="h-1.5 w-3/5 bg-accent" />
          <span className="h-1.5 w-2/3 bg-rule" />
          <span className="h-1.5 w-1/2 bg-rule" />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4 lg:p-6">
          <span className="h-2 w-2/5 bg-fg" />
          <span className="h-1.5 w-11/12 bg-rule" />
          <span className="h-1.5 w-4/5 bg-rule" />
          <span className="h-1.5 w-5/6 bg-rule" />
          <span className="mt-auto h-1/6 w-2/5 self-end bg-accent opacity-85" />
        </div>
      </div>
    </div>
  );
}

// The work list thumbnail: a page with a margin strip and a few lines.
function ThumbPlaceholder({ alt }: { alt: string }) {
  return (
    <span role="img" aria-label={alt} className="flex aspect-16/10 w-full bg-surface">
      <span className="w-1/5 bg-rule" />
      <span className="flex flex-1 flex-col gap-1 p-2 md:gap-2 md:p-3 xl:gap-1 xl:p-2">
        <span className="h-1.5 w-3/5 bg-fg md:h-2 xl:h-1.5" />
        <span className="h-1 w-5/6 bg-rule md:h-1.5 xl:h-1" />
        <span className="h-1 w-2/3 bg-rule md:h-1.5 xl:h-1" />
        <span className="h-1 w-2/5 bg-accent md:h-1.5 xl:h-1" />
        <span className="h-1 w-3/4 bg-rule md:h-1.5 xl:h-1" />
      </span>
    </span>
  );
}

type ThumbnailProps = {
  image: StaticImageData | undefined;
  alt: string;
  sizes: string;
  className?: string;
};

export function Thumbnail({ image, alt, sizes, className = "" }: ThumbnailProps) {
  return (
    <span className="block overflow-hidden border border-rule">
      <span className={`block ${className}`}>
        {image ? (
          <Image src={image} alt={alt} sizes={sizes} className="aspect-16/10 h-auto w-full object-cover" />
        ) : (
          <ThumbPlaceholder alt={alt} />
        )}
      </span>
    </span>
  );
}

type FigureProps = {
  n: number;
  image: Screenshot | undefined;
  caption: string;
  alt: string;
  aspect: Aspect;
  sizes: string;
  priority?: boolean;
  labels: { label: string; placeholder: string };
  className?: string;
};

export function Figure({ n, image, caption, alt, aspect, sizes, priority = false, labels, className = "" }: FigureProps) {
  return (
    <figure className={`flex flex-col gap-2 ${className}`}>
      {image ? (
        <Image
          src={image.src}
          alt={alt}
          sizes={sizes}
          priority={priority}
          className={`h-auto w-full border border-rule object-cover ${positions[image.position ?? "center"]} ${aspects[aspect]}`}
        />
      ) : (
        <ScreenPlaceholder alt={alt} aspect={aspect} />
      )}
      <figcaption className="font-mono text-label text-muted">
        <span className="text-accent uppercase">
          {labels.label} {n}
        </span>{" "}
        · {caption}
        {image ? null : ` · ${labels.placeholder}`}
      </figcaption>
    </figure>
  );
}
