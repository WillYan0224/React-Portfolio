import React from "react";
import {
  BASE_HERO_BUBBLES,
  EXTRA_HERO_BUBBLES,
  SECTION_BUBBLES_ALT,
  SECTION_BUBBLES_ALT_EXTRA,
  repeatArray,
  applyDensityProfile,
  makeBubbleBackground,
  makeBubbleMotion,
} from "../../utils/bubbles";

const AmbientBubbles = ({
  extraDensity = 0,
  scale = 1,
  className = "",
  variant = "hero",
  baseOpacity = 0.42,
  extraOpacityBase = 0.08,
  extraOpacityGain = 0.38,
  borderOpacity = 0.2,
  fillOpacity = 0.05,
  blurPx = 0.35,
  glow = false,
  countMultiplier = 1,
  densityProfile = "even",
  fresnel = false,
  centerTransparency = 0.9,
}) => {
  const rawPrimary =
    variant === "section" ? SECTION_BUBBLES_ALT : BASE_HERO_BUBBLES;
  const rawSecondary =
    variant === "section" ? SECTION_BUBBLES_ALT_EXTRA : EXTRA_HERO_BUBBLES;

  const primarySet = repeatArray(
    applyDensityProfile(rawPrimary, densityProfile),
    countMultiplier,
  );

  const secondarySet = repeatArray(
    applyDensityProfile(rawSecondary, densityProfile),
    countMultiplier,
  );

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {primarySet.map((bubble, i) => {
        const motion = makeBubbleMotion(bubble, false);

        return (
          <span
            key={`base-${variant}-${bubble.id ?? i}`}
            className="absolute bottom-[-10%] rounded-full bubble-float"
            style={{
              left: bubble.left,
              width: `${bubble.size * scale}px`,
              height: `${bubble.size * scale}px`,
              ...motion,
              filter: glow
                ? `blur(${blurPx}px) drop-shadow(0 0 8px rgba(180,240,255,0.16))`
                : `blur(${blurPx}px)`,
              opacity: baseOpacity,
              background: makeBubbleBackground({
                fresnel,
                fillOpacity,
                borderOpacity,
                centerTransparency,
              }),
              border: fresnel
                ? "none"
                : `1px solid rgba(224,242,254,${borderOpacity})`,
              boxShadow: glow
                ? `0 0 10px rgba(180,240,255,0.12), inset 0 0 10px rgba(255,255,255,0.04)`
                : "none",
            }}
          />
        );
      })}

      {secondarySet.map((bubble, i) => {
        const motion = makeBubbleMotion(bubble, true);

        return (
          <span
            key={`extra-${variant}-${bubble.id ?? i}`}
            className="absolute bottom-[-10%] rounded-full bubble-float"
            style={{
              left: bubble.left,
              width: `${bubble.size * scale}px`,
              height: `${bubble.size * scale}px`,
              ...motion,
              filter: glow
                ? `blur(${blurPx + 0.15}px) drop-shadow(0 0 8px rgba(180,240,255,0.12))`
                : `blur(${blurPx + 0.15}px)`,
              opacity: extraOpacityBase + extraDensity * extraOpacityGain,
              background: makeBubbleBackground({
                fresnel,
                fillOpacity: fillOpacity * 0.8,
                borderOpacity: borderOpacity * 0.8,
                centerTransparency,
              }),
              border: fresnel
                ? "none"
                : `1px solid rgba(224,242,254,${borderOpacity * 0.8})`,
              boxShadow: glow
                ? `0 0 8px rgba(180,240,255,0.10), inset 0 0 8px rgba(255,255,255,0.03)`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
};

export default AmbientBubbles;
