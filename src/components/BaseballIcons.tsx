
import React from 'react';
import { LucideProps } from 'lucide-react';

// Baseball Bat icon (custom)
export const BaseballBat = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5.5 21.5c-.83.83-2.17.83-3 0-.83-.83-.83-2.17 0-3L9 12" />
      <path d="M9.5 14.5c-.83.83-.83 2.17 0 3 .83.83 2.17.83 3 0L21 9a1 1 0 0 0 0-1.41L19.6 6.2a1 1 0 0 0-1.42 0L9.5 14.5z" />
    </svg>
  );
};

// Baseball Glove icon (custom)
export const BaseballGlove = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 9v2.5a1.5 1.5 0 0 0 3 0V9" />
      <path d="M11 9V7a1.5 1.5 0 0 1 3 0v2" />
      <path d="M14 9v1a1.5 1.5 0 0 0 3 0V8.5A2.5 2.5 0 0 0 14.5 6" />
      <path d="M5 9h3" />
      <path d="M5 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2" />
      <path d="M13 14v4a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4" />
    </svg>
  );
};

// Baseball Ball icon (custom)
export const BaseballBall = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M5 10.3C6.3 10.7 7.7 10 8 8.5m2 9.5c1.3.4 2.7-.3 3-1.8m-1-4.4c1.3.4 2.7-.3 3-1.8m-7 6.2c1.3.4 2.7-.3 3-1.8" />
    </svg>
  );
};

// Baseball Base icon (custom)
export const BaseballBase = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="5" y="5" width="14" height="14" rx="1" transform="rotate(45 12 12)" />
    </svg>
  );
};

// Animated Baseball Checkmark (custom)
export const BaseballCheckmark = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-bat-swing origin-bottom-right"
      {...props}
    >
      <path d="M9 5l-7 7 7 7" />
      <path d="M17 5c-5.1.5-9 4.5-9 9.5 0 2.5 2 4.5 4.5 4.5h.5" />
      <line x1="9" y1="12" x2="21" y2="12" />
    </svg>
  );
};

// Scoreboard icon (custom)
export const Scoreboard = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="12" y1="10" x2="12" y2="20" />
      <path d="M6 7h.01" />
      <path d="M18 7h.01" />
      <path d="M6 15h1v1h-1z" />
      <path d="M18 15h1v1h-1z" />
    </svg>
  );
};

// Stadium icon (custom)
export const Stadium = (props: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10V7.5c0-1-1.1-2-2.5-2S15 6.5 15 7.5v0M4 10V7.5C4 6.5 5.1 5.5 6.5 5.5S9 6.5 9 7.5v0" />
      <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M12 19c-6 0-8.1-4-8.1-9h16.2c0 5-2.1 9-8.1 9Z" />
    </svg>
  );
};
