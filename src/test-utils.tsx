// Utilities for testing ThemeProvider and theme context
// Provides helpers to mock context, simulate theme changes, and test SSR/DOM sync

import React, { ReactNode } from 'react';
import { ThemeProvider, ThemeProviderProps, useTheme, ThemeContextValue } from './ThemeProvider';

/**
 * Renders ThemeProvider with custom props for testing.
 * Returns the context value and a wrapper for use in tests.
 */
export function renderWithThemeProvider(
  ui: ReactNode,
  providerProps?: Partial<ThemeProviderProps>
) {
  let contextValue: ThemeContextValue | undefined;
  function CaptureContext() {
    contextValue = useTheme();
    return null;
  }
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <ThemeProvider {...providerProps}>
      <CaptureContext />
      {children}
    </ThemeProvider>
  );
  return { Wrapper, getContext: () => contextValue };
}

/**
 * Mocks localStorage for theme persistence tests.
 */
export function mockLocalStorage(initial: Record<string, string> = {}) {
  const store = { ...initial };
  const mock = {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
  Object.defineProperty(window, 'localStorage', { value: mock, configurable: true });
  return mock;
}

/**
 * Simulates a theme change by calling the context toggle function.
 */
export function simulateThemeToggle(context: ThemeContextValue) {
  context.toggle();
}

/**
 * Simulates SSR hydration by setting document class and calling effect manually.
 */
export function simulateSSRHydration(theme: string, target: HTMLElement = document.documentElement) {
  target.className = theme;
}
