import { THEME_STORAGE_KEY } from '@/lib/theme';

/**
 * 렌더링 전에 실행되어 <html data-theme> 를 확정한다.
 * (React 하이드레이션 전에 동작해야 하므로 인라인 스크립트로 넣는다 -> theme flash 방지)
 */
const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=(s==='light'||s==='dark')?s:(d?'dark':'light');}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
