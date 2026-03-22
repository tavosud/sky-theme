import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type AnyThemeMode = string;

export interface ThemeContextValue {
  mode: AnyThemeMode;
  resolvedTheme: AnyThemeMode;
  setMode: (mode: AnyThemeMode) => void;
  toggle: () => void;
}

export interface ThemeProviderProps {
  onTransition?: (from: AnyThemeMode, to: AnyThemeMode) => void;
  target?: string;
  persist?: boolean;
  initialMode?: AnyThemeMode;
  scope?: string;
  modes?: AnyThemeMode[];
  classMap?: Record<AnyThemeMode, string>;
  onThemeChange?: (theme: AnyThemeMode) => void;
  transitionClassName?: string;
  defaultMode?: ThemeMode;
  storageKey?: string;
  cycle?: ThemeMode[];
  children: React.ReactNode;
}

const THEME_EVENT = 'sky-theme-change';
const ThemeContexts: Record<string, React.Context<ThemeContextValue | null>> = {};
function getThemeContext(scope: string = 'default') {
  if (!ThemeContexts[scope]) {
    ThemeContexts[scope] = createContext<ThemeContextValue | null>(null);
  }
  return ThemeContexts[scope];
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({
  defaultMode = 'system',
  storageKey = 'sky-theme',
  cycle = ['light', 'dark', 'system'],
  modes,
  classMap,
  onThemeChange,
  transitionClassName,
  scope = 'default',
  initialMode,
  persist = true,
  target = 'html',
  onTransition,
  children,
}: ThemeProviderProps) {
  const ThemeContext = getThemeContext(scope);
  const themeModes = modes ?? cycle;
  const themeClassMap = classMap ?? { dark: 'dark' };

  function readStorage(): AnyThemeMode | null {
    if (!persist) return null;
    try {
      const stored = localStorage.getItem(storageKey) as AnyThemeMode | null;
      if (stored && themeModes.includes(stored as AnyThemeMode)) {
        return stored as AnyThemeMode;
      }
    } catch {}
    return null;
  }

  function writeStorage(mode: AnyThemeMode): void {
    if (!persist) return;
    try {
      localStorage.setItem(storageKey, mode);
    } catch {}
  }

  const [mode, setModeState] = useState<AnyThemeMode>(() => {
    if (initialMode) return initialMode;
    if (typeof window === 'undefined') return defaultMode;
    return readStorage() ?? defaultMode;
  });

  useEffect(() => {
    if (!persist) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        const next = (e.newValue as ThemeMode | null) ?? defaultMode;
        setModeState(next);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [defaultMode, storageKey, persist]);

  const resolvedTheme: AnyThemeMode = mode === 'system' ? getSystemTheme() : mode;

  const prevThemeRef = useRef<AnyThemeMode | null>(null);
  useEffect(() => {
    const el = target === 'html' ? document.documentElement :
      target === 'body' ? document.body : document.querySelector(target);
    if (!el) return;
    Object.values(themeClassMap).forEach(cls => el.classList.remove(cls));
    const themeClass = themeClassMap[resolvedTheme];
    if (themeClass) el.classList.add(themeClass);
    if (transitionClassName) {
      el.classList.add(transitionClassName);
      const timer = setTimeout(() => el.classList.remove(transitionClassName), 400);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resolvedTheme, transitionClassName, themeClassMap, target]);

  useEffect(() => {
    if (onThemeChange) onThemeChange(resolvedTheme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme: resolvedTheme, scope } }));
    if (onTransition && prevThemeRef.current !== null && prevThemeRef.current !== resolvedTheme) {
      onTransition(prevThemeRef.current, resolvedTheme);
    }
    prevThemeRef.current = prevThemeRef.current ?? resolvedTheme;
  }, [resolvedTheme, scope]);

  useEffect(() => {
    if (mode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const next = e.matches ? 'dark' : 'light';
      setModeState(next);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [mode]);

  const setMode = useCallback((next: AnyThemeMode) => {
    writeStorage(next);
    setModeState(next);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: { theme: next === 'system' ? getSystemTheme() : next, scope } }));
  }, [scope]);

  const toggle = useCallback(() => {
    setModeState((current: AnyThemeMode) => {
      const idx = themeModes.indexOf(current);
      const next = themeModes[(idx + 1) % themeModes.length];
      writeStorage(next);
      return next;
    });
  }, [themeModes]);

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function onThemeChangeGlobal(cb: (theme: any, scope: string) => void) {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    cb(detail.theme, detail.scope);
  };
  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}

/**
 * Returns the current theme context.
 *
 * @example
 * const { resolvedTheme, toggle } = useTheme();
 */
export function useTheme(fallback?: ThemeContextValue, scope: string = 'default'): ThemeContextValue {
  const ThemeContext = getThemeContext(scope);
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    if (fallback) return fallback;
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}

// Test utilities for unit testing (exported for test files)
export { renderWithThemeProvider, mockLocalStorage, simulateThemeToggle, simulateSSRHydration } from './test-utils';
