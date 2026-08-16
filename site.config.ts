/**
 * 사이트 전역 설정.
 *
 * GitHub Pages 경로(basePath)와 사이트 주소(siteUrl)는 이 파일 한 곳에서만 결정된다.
 * - `<username>.github.io` 저장소  -> basePath 없음 (기본값)
 * - 일반 저장소(`<username>/blog`) -> NEXT_PUBLIC_BASE_PATH=/blog
 *
 * GitHub Actions 에서는 actions/configure-pages 가 알려주는 값을 그대로 주입하므로
 * 저장소 종류가 바뀌어도 워크플로가 알아서 맞춰준다.
 */

/** `/` 나 빈 문자열은 basePath 없음으로 취급하고, 항상 앞에만 슬래시를 남긴다. */
function normalizeBasePath(value: string | undefined): string {
  if (!value) return '';
  const trimmed = value.trim().replace(/\/+$/, '');
  if (!trimmed || trimmed === '/') return '';
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const githubUsername = process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? 'comorii16';

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://${githubUsername}.github.io${basePath}`
).replace(/\/+$/, '');

export const siteConfig = {
  name: 'My Blog',
  title: 'My Blog',
  description: '개발하면서 공부하고 경험한 내용을 기록합니다.',
  locale: 'ko-KR',
  lang: 'ko',
  author: {
    name: 'My Blog',
    github: githubUsername,
  },
  /** 메인 페이지에 노출할 최신 글 개수 */
  latestPostCount: 5,
  siteUrl,
  basePath,
} as const;

/**
 * public/ 자산처럼 Next.js 가 자동으로 basePath 를 붙여주지 않는 경로에 사용한다.
 * (Markdown 본문의 이미지 경로, RSS/OG 이미지 등)
 */
export function withBasePath(pathname: string): string {
  if (!pathname.startsWith('/')) return pathname;
  return `${basePath}${pathname}`;
}

/** sitemap / canonical / RSS 처럼 절대 URL 이 필요한 곳에 사용한다. */
export function absoluteUrl(pathname: string): string {
  if (/^https?:\/\//.test(pathname)) return pathname;
  return `${siteUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}
