import type { HTMLAttributes, ImgHTMLAttributes } from "react";
import { cn } from "../lib/utils";

type BossFlowTone = "auto" | "dark" | "light";

type BossFlowMarkProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  tone?: BossFlowTone;
  withBackground?: boolean;
};

function logoSource(tone: Exclude<BossFlowTone, "auto">, withBackground: boolean) {
  if (withBackground) {
    return tone === "light"
      ? "/brands/bossflow-mark-square-white.png"
      : "/brands/bossflow-mark-square-black.png";
  }
  return tone === "light" ? "/brands/bossflow-mark-white.png" : "/brands/bossflow-mark-black.png";
}

export function BossFlowMark({
  className,
  tone = "auto",
  withBackground = false,
  ...props
}: BossFlowMarkProps) {
  const sharedProps = {
    alt: "",
    ...props,
  };

  if (tone === "dark" || tone === "light") {
    return (
      <img
        src={logoSource(tone, withBackground)}
        className={cn("shrink-0", className)}
        {...sharedProps}
      />
    );
  }

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    >
      <img
        src={logoSource("dark", withBackground)}
        className="h-full w-full object-contain dark:hidden"
        alt=""
      />
      <img
        src={logoSource("light", withBackground)}
        className="hidden h-full w-full object-contain dark:block"
        alt=""
      />
    </span>
  );
}

type BossFlowLogoProps = HTMLAttributes<HTMLDivElement> & {
  markClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  subtitle?: string;
  tone?: BossFlowTone;
};

export function BossFlowLogo({
  className,
  markClassName,
  titleClassName,
  subtitleClassName,
  subtitle,
  tone = "auto",
  ...props
}: BossFlowLogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      <BossFlowMark className={cn("h-10 w-10", markClassName)} tone={tone} />
      <div className="min-w-0">
        <div className={cn("text-sm font-semibold tracking-[0.12em] text-foreground uppercase", titleClassName)}>
          BossFlow
        </div>
        {subtitle ? (
          <div className={cn("text-xs text-muted-foreground", subtitleClassName)}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}
