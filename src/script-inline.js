// ─────────────────────────────────────────────────────────────────────────────
// sky-theme — anti-flash inline script
//
// Paste the MINIFIED line below inside the <head> of your HTML/JSX, BEFORE any
// stylesheet or React hydration. It runs synchronously so the browser never
// paints a mismatched theme.
//
// Next.js (App Router) — layout.tsx:
//   import Script from 'next/script'
//   <Script id="sky-theme" strategy="beforeInteractive" src="/sky-theme.js" />
//   — or inline it via dangerouslySetInnerHTML={{ __html: ... }}
//
// Next.js (Pages Router) — _document.tsx:
//   <script dangerouslySetInnerHTML={{ __html: require('@tavosud/sky-theme/script') }} />
//
// Remix — root.tsx:
//   <script dangerouslySetInnerHTML={{ __html: ... }} />
//
// ─────────────────────────────────────────────────────────────────────────────

// UNMINIFIED SOURCE (for readability / auditing)
(function () {
  try {
    var stored = localStorage.getItem('sky-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark =
      stored === 'dark' ||
      (stored !== 'light' && (stored === 'system' || !stored) && prefersDark);
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();

// ─────────────────────────────────────────────────────────────────────────────
// MINIFIED — copy exactly this one line into your <head>:
// ─────────────────────────────────────────────────────────────────────────────
// <script>!function(){try{var s=localStorage.getItem('sky-theme'),p=window.matchMedia('(prefers-color-scheme: dark)').matches,d=s==='dark'||(s!=='light'&&(s==='system'||!s)&&p);d?document.documentElement.classList.add('dark'):document.documentElement.classList.remove('dark')}catch(e){}}();</script>
