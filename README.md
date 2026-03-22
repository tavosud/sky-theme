# Sky Theme

[![npm version](https://img.shields.io/npm/v/@tavosud/sky-theme)](https://www.npmjs.com/package/@tavosud/sky-theme)
[![npm types](https://img.shields.io/npm/types/@tavosud/sky-theme)](https://www.npmjs.com/package/@tavosud/sky-theme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/tavosud/sky-theme)
[![Edit CodeSandbox](https://img.shields.io/badge/CodeSandbox-Edit-blue?logo=codesandbox)](https://codesandbox.io/p/sandbox/y5rt5f)

> Ultra-lightweight, SSR-safe, zero-dependency dark mode and theme manager for React.

## Features

- **Zero dependencies** — only React
- **SSR-safe** — no hydration flash
- **TypeScript** — full type definitions
- **Scoped themes** — multiple providers support
- **Professional styles** — built-in gradients and glassmorphism
- **Accessible** — ARIA labels, keyboard navigation

## Installation

```bash
npm install @tavosud/sky-theme
```

## Quick Start

### 1. Import styles (optional)

For professional dark mode with gradients and glassmorphism:

```tsx
import '@tavosud/sky-theme/styles';
```

Or in CSS:

```css
@import '@tavosud/sky-theme/styles';
```

### 2. Add the anti-flash script

To prevent flash of wrong theme on SSR, add this to your HTML `<head>`:

```html
<script>
  (function(){
    try{
      var s=localStorage.getItem('sky-theme');
      var p=window.matchMedia('(prefers-color-scheme: dark)').matches;
      var d=s==='dark'||(s!=='light'&&(s==='system'||!s)&&p);
      d?document.documentElement.classList.add('dark'):document.documentElement.classList.remove('dark');
    }catch(e){}
  })();
</script>
```

Or use the React component (Next.js, Remix, etc.):

```tsx
import { ThemeScript } from '@tavosud/sky-theme';

// In your layout root
<ThemeScript storageKey="sky-theme" defaultMode="system" />
```

### 3. Wrap your app

```tsx
import { ThemeProvider, ThemeButton } from '@tavosud/sky-theme';

export function App() {
  return (
    <ThemeProvider defaultMode="system">
      <Navbar />
      <Content />
    </ThemeProvider>
  );
}
```

### 4. Use the hook

```tsx
import { useTheme } from '@tavosud/sky-theme';

function MyComponent() {
  const { resolvedTheme } = useTheme();
  
  return (
    <div className="sky-surface">
      Current theme: {resolvedTheme}
    </div>
  );
}
```

## Built-in CSS Classes

Import `@tavosud/sky-theme/styles` for professional styling:

| Class | Description |
|-------|-------------|
| `.sky-surface` | Background with gradient |
| `.sky-glass` | Glassmorphism effect (blur + transparency) |
| `.sky-card` | Card with shadow and border |
| `.sky-border` | Adaptive border color |
| `.sky-text` | Primary text color |
| `.sky-text-muted` | Secondary text color |

## API Reference

### ThemeProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultMode` | `'light' \| 'dark' \| 'system'` | `'system'` | Initial mode |
| `storageKey` | `string` | `'sky-theme'` | localStorage key |
| `persist` | `boolean` | `true` | Persist to localStorage |
| `scope` | `string` | `'default'` | Provider scope (for multiple themes) |
| `classMap` | `Record<string, string>` | `{ dark: 'dark' }` | Map modes to CSS classes |
| `onThemeChange` | `(theme: string) => void` | - | Callback on change |
| `transitionClassName` | `string` | - | Class added during transitions |

### useTheme

```tsx
const { mode, resolvedTheme, toggle, setMode } = useTheme();
```

- `mode` — current setting (`'light'`, `'dark'`, `'system'`, or custom)
- `resolvedTheme` — actual theme (`'light'` or `'dark'`, never `'system'`)
- `toggle()` — cycle to next mode
- `setMode(mode)` — set specific mode

### ThemeButton

```tsx
import { ThemeButton } from '@tavosud/sky-theme';

// With label
<ThemeButton showLabel />

// With custom styles
<ThemeButton style={{ color: 'red' }} />
```

## License

MIT
