export const THEME_STORAGE_KEY = 'theme';

export type Theme = 'system' | 'light' | 'dark';

export const THEME_ORDER: Theme[] = ['system', 'light', 'dark'];

export const THEME_LABEL: Record<Theme, string> = {
  system: '시스템 설정',
  light: '라이트',
  dark: '다크',
};

function isTheme(value: string | null): value is Theme {
  return value === 'system' || value === 'light' || value === 'dark';
}

/**
 * 테마 선택값은 React state 가 아니라 localStorage 에 있다.
 * useSyncExternalStore 로 그 값을 그대로 구독한다.
 */
const listeners = new Set<() => void>();

export function subscribeTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

/** 서버 렌더링 시점에는 사용자의 선택을 알 수 없으므로 항상 system 으로 본다. */
export function getServerTheme(): Theme {
  return 'system';
}

export function setStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private 모드 등에서 저장이 막혀도 화면 전환은 계속 동작해야 한다.
  }
  for (const listener of listeners) listener();
}

export function applyTheme(theme: Theme): void {
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  document.documentElement.dataset.theme = resolved;
}
