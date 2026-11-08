import clsx from "clsx";
import type { CSSProperties } from "react";

type LogoProps = {
  /** Side length of the rounded mark in px. Inner geometry scales with it. */
  size?: number;
  /** "navy" = navy mark on cream; "cream" = cream mark on navy. */
  tone?: "navy" | "cream";
  /** Drop the coin slot + inner ring — reads cleaner below ~28px. */
  simple?: boolean;
  /** Font size of the wordmark; omit to render the mark alone. */
  wordmark?: number;
  className?: string;
};

/**
 * The WiseXpense piggy-bank mark: a rounded tile holding a coin, a body,
 * and a slot. Built from positioned blocks (not an SVG) so it inherits the
 * two-tone palette directly, matching the design source.
 */
export function Logo({
  size = 34,
  tone = "navy",
  simple = false,
  wordmark,
  className,
}: LogoProps) {
  const s = size / 34;
  const tile = tone === "navy" ? "#0C2340" : "#FDF6E3";
  const cut = tone === "navy" ? "#FDF6E3" : "#0C2340";

  const px = (n: number) => `${n * s}px`;

  const mark: CSSProperties = {
    width: px(34),
    height: px(34),
    borderRadius: px(10),
    background: tile,
    boxShadow: tone === "navy" ? "0 6px 14px rgba(12,35,64,.25)" : undefined,
  };

  return (
    <span className={clsx("inline-flex items-baseline gap-[11px]", className)}>
      <span aria-hidden="true" className="relative inline-block shrink-0" style={mark}>
        {/* coin */}
        <span
          className="absolute left-1/2 grid -translate-x-1/2 place-items-center rounded-full"
          style={{
            top: px(4),
            width: px(12),
            height: px(12),
            background: cut,
          }}
        >
          {!simple && (
            <span
              className="rounded-full"
              style={{
                width: px(5),
                height: px(5),
                border: `${px(2)} solid ${tile}`,
              }}
            />
          )}
        </span>
        {/* body */}
        <span
          className="absolute"
          style={{
            left: px(6),
            right: px(6),
            bottom: px(5),
            height: px(13),
            background: cut,
            borderRadius: px(4),
          }}
        />
        {/* slot */}
        {!simple && (
          <span
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: px(15),
              width: px(14),
              height: px(4),
              background: tile,
              borderRadius: `0 0 ${px(3)} ${px(3)}`,
            }}
          />
        )}
      </span>
      {wordmark !== undefined && (
        <span
          className="font-serif font-semibold tracking-[-0.01em]"
          style={{
            fontSize: `${wordmark}px`,
            color: tone === "navy" ? "#0C2340" : "#FDF6E3",
          }}
        >
          Wise
          <span style={{ color: tone === "navy" ? "#B58900" : "#E9C46A" }}>
            Xpense
          </span>
        </span>
      )}
    </span>
  );
}
