import "react";

// Lets `style` carry CSS custom properties (`--i`, `--chars`) without a cast.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
