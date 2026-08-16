'use client';

import { useEffect, useSyncExternalStore } from 'react';

import {
  applyTheme,
  getServerTheme,
  getStoredTheme,
  setStoredTheme,
  subscribeTheme,
  THEME_LABEL,
  THEME_ORDER,
  type Theme,
} from '@/lib/theme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getStoredTheme, getServerTheme);

  useEffect(() => {
    applyTheme(theme);
    if (theme !== 'system') return;

    // system 을 선택한 동안에는 OS 설정 변경을 그대로 따라간다.
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [theme]);

  function cycle() {
    const next = THEME_ORDER[(THEME_ORDER.indexOf(theme) + 1) % THEME_ORDER.length] ?? 'system';
    setStoredTheme(next);
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={cycle}
      aria-label={`테마: ${THEME_LABEL[theme]} (클릭하면 변경)`}
      title={`테마: ${THEME_LABEL[theme]}`}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (theme === 'light') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }

  if (theme === 'dark') {
    return (
      <svg {...common}>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
