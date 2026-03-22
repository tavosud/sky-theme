// Helper for SSR frameworks: injects the anti-flash script-inline in <head>
import React from 'react';

export interface ThemeScriptProps {
  /** Storage key (must match ThemeProvider) */
  storageKey?: string;
  /** Default mode (must match ThemeProvider) */
  defaultMode?: 'light' | 'dark' | 'system';
}

/**
 * Injects the minified anti-flash script for SSR (Next.js, Remix, etc).
 * Usage: <ThemeScript storageKey="my-key" defaultMode="system" />
 */
export function ThemeScript({ storageKey = 'sky-theme', defaultMode = 'system' }: ThemeScriptProps) {
  // The script is generated dynamically to match custom storageKey/defaultMode
  // (defaultMode only affects the fallback if no storage entry exists)
  const script = `!function(){try{var k='${storageKey}',d='${defaultMode}',s=localStorage.getItem(k),p=window.matchMedia('(prefers-color-scheme: dark)').matches,m=s==='dark'||(s!=='light'&&(s==='system'||!s)&&p);if(m)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark')}catch(e){}}();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} suppressHydrationWarning />;
}
