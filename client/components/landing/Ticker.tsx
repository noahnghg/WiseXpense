import { ticker } from "@/lib/data";

/**
 * Infinite marquee of spending observations. The list is rendered twice and
 * the track slides exactly -50%, so the seam lands mid-loop and never shows.
 */
export function Ticker() {
  const strip = ` ${ticker.join("  ✳  ")}  ✳  `;

  return (
    <div className="overflow-hidden bg-navy py-[15px] whitespace-nowrap text-cream">
      <div className="inline-flex animate-ticker">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="font-serif text-[17px] tracking-[.01em] italic"
            aria-hidden={i === 1}
          >
            {strip}
          </span>
        ))}
      </div>
    </div>
  );
}
