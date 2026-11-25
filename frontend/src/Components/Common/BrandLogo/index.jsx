import React from 'react';

export default function BrandLogo({ className = '', onClick, ariaLabel = 'ConnectIn Home' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 158 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? ariaLabel : undefined}
      aria-hidden={!onClick ? 'true' : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
    >
      <text
        x="0"
        y="26"
        fill="#0A66C2"
        fontSize="27"
        fontWeight="800"
        fontFamily="-apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
        letterSpacing="-0.6px"
      >
        Connect
      </text>
      <rect x="116" y="2" width="31" height="30" rx="4" fill="#0A66C2" />
      <text
        x="121"
        y="25"
        fill="#FFFFFF"
        fontSize="24"
        fontWeight="700"
        fontFamily="-apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
      >
        in
      </text>
    </svg>
  );
}
