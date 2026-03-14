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
          x="5"
          y="4"
          width="60"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="6" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.345098 0 0 0 0 0.8 0 0 0 0 0.00784314 0 0 0 0.6 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

