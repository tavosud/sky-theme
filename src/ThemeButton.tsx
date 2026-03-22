import React, { CSSProperties } from 'react';
import { useTheme } from './ThemeProvider';
import type { ThemeMode } from './ThemeProvider';

// ---------------------------------------------------------------------------
// Icons — inline SVGs, zero external deps
// ---------------------------------------------------------------------------

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <polyline points="8 21 12 17 16 21" />
  </svg>
);

const icons: Record<string, React.ComponentType> = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
};

const labels: Record<string, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System theme',
};

// ---------------------------------------------------------------------------
// Styles — CSS-in-JS object, no stylesheet required
// ---------------------------------------------------------------------------

const BASE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.25rem',
  height: '2.25rem',
  padding: '0.375rem',
  borderRadius: '0.5rem',
  border: '1px solid transparent',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: 'inherit',
  transition: 'opacity 150ms ease, transform 150ms ease, background-color 150ms ease',
  willChange: 'transform, opacity',
};

const HOVER: CSSProperties = {
  backgroundColor: 'rgba(128, 128, 128, 0.15)',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ThemeButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * Show the current mode label next to the icon.
   * @default false
   */
  showLabel?: boolean;
}

/**
 * A zero-dependency toggle button that cycles light → dark → system.
 *
 * @example
 * <ThemeButton />
 * <ThemeButton showLabel />
 */
export function ThemeButton({ showLabel = false, style, ...rest }: ThemeButtonProps) {
  const { mode, toggle } = useTheme();
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const Icon = icons[mode] ?? SunIcon;

  const computedStyle: CSSProperties = {
    ...BASE,
    ...(hovered ? HOVER : {}),
    transform: pressed ? 'scale(0.88)' : 'scale(1)',
    opacity: pressed ? 0.75 : 1,
    ...style,
  };

  // Keyboard accessibility: handle Enter/Space for toggle
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      setPressed(true);
      e.preventDefault();
      toggle();
    }
  };
  const handleKeyUp = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') setPressed(false);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mode === 'dark'}
      aria-label={labels[mode] ?? 'Switch theme'}
      title={labels[mode] ?? 'Switch theme'}
      tabIndex={0}
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={computedStyle}
      {...rest}
    >
      <Icon />
      {showLabel && (
        <span style={{ marginLeft: '0.375rem', fontSize: '0.875rem', userSelect: 'none' }}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </span>
      )}
    </button>
  );
}

export { SunIcon, MoonIcon, SystemIcon };
