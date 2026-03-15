import React from "react";

interface ZoneProgressBadgeProps {
  progress: number; // 0–1
  locked?: boolean;
}

export const ZoneProgressBadge: React.FC<ZoneProgressBadgeProps> = ({ progress, locked }) => {
  const clamped = Math.max(0, Math.min(1, progress));

  const radius = 28;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  const baseGreen = locked ? "#A2E46B" : "#58CC02";
  const ringBg = "#E5E7EB"; // light grey
  const ringProgress = "#FFC800"; // yellow, like duolingo ring

  return (
    <svg
      width="70"
      height="65"
      viewBox="0 0 70 65"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Outer grey ring */}
      <circle
        cx="35"
        cy="32.5"
        r={radius}
        fill="none"
        stroke={ringBg}
        strokeWidth={strokeWidth}
      />

      {/* Progress arc */}
      <circle
        cx="35"
        cy="32.5"
        r={radius}
        fill="none"
        stroke={ringProgress}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 35 32.5)"
      />

      {/* Inner green pill / circle */}
      <g filter="url(#shadow)">
        <circle cx="35" cy="32.5" r="24" fill={baseGreen} />
      </g>

      {/* White star icon, centered */}
      <g transform="translate(0,2)">
        <path
          d="M35 18.5L37.4726 23.5159L43 24.3149L39 28.1841L39.9453 33.6851L35 31.1409L30.0547 33.6851L31 28.1841L27 24.3149L32.5274 23.5159L35 18.5Z"
          fill="white"
        />
      </g>

      <defs>
        <filter
          id="shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          colorInterpolationFilters="sRGB"
        >
          <feOffset dy="2" in="SourceAlpha" result="offset" />
          <feGaussianBlur stdDeviation="2" in="offset" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.15 0 0 0 0 0.15 0 0 0 0 0.15 0 0 0 0.2 0"
            result="shadow"
          />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};

