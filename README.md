# My Blog

Markdown/MDX 파일로 글을 관리하고, GitHub Pages로 배포하는 개인 블로그입니다.

- 글은 전부 `content/posts/` 안의 Markdown 파일입니다. Git이 콘텐츠의 source of truth입니다.
- 모든 페이지는 빌드 시점에 정적으로 생성됩니다. (Next.js Static Export)
- 서버, 데이터베이스, CMS, 유료 호스팅을 사용하지 않습니다. 운영 비용은 0원입니다.
- `main` 브랜치에 push하면 GitHub Actions가 빌드해서 GitHub Pages에 배포합니다.

**기술 스택**: Next.js 16 (App Router) · React 19 · TypeScript · MDX · shiki · GitHub Actions · GitHub Pages

---

## 요구 사항

| 도구 | 버전 |
| --- | --- |
| Node.js | 20.9 이상 (LTS 권장) |
| pnpm | 11 이상 |

pnpm이 없다면 Node에 포함된 corepack으로 설치할 수 있습니다.

```bash
corepack enable pnpm
```

## 로컬 실행

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` 에서 확인합니다.
개발 서버에서는 `draft: true` 인 글도 함께 보입니다.

### 사용 가능한 명령

| 명령 | 설명 |
| --- | --- |
| `pnpm dev` | 개발 서버 실행 |
| `pnpm build` | production 빌드. 결과물은 `out/` |
| `pnpm preview` | 빌드된 `out/` 을 로컬 정적 서버로 확인 |
| `pnpm lint` | ESLint 검사 |
| `pnpm typecheck` | TypeScript 타입 검사 |
| `pnpm check` | typecheck + lint + build 한 번에 실행 |

## 프로젝트 구조

```
.
├── app/                      # 라우트 (App Router)
│   ├── layout.tsx            # 공통 레이아웃, 전역 metadata
│   ├── page.tsx              # /  최신 글
│   ├── posts/                # /posts, /posts/[slug]
│   ├── tags/                 # /tags, /tags/[tag]
│   ├── about/                # /about
│   ├── not-found.tsx         # 404
│   ├── sitemap.ts            # /sitemap.xml
│   ├── robots.ts             # /robots.txt
│   ├── rss.xml/route.ts      # /rss.xml
│   └── icon.svg              # 파비콘
│
├── components/               # UI 컴포넌트 (컴포넌트별 CSS Module)
├── content/posts/            # 글 (Markdown / MDX)  ← 콘텐츠는 전부 여기
├── lib/                      # 글 로딩, 태그 집계, metadata 생성
├── public/images/posts/      # 글에 사용하는 이미지
├── styles/globals.css        # 디자인 토큰 + 본문 타이포그래피
├── mdx-components.tsx        # MDX 태그 → React 컴포넌트 매핑
├── site.config.ts            # 사이트 이름, 주소, basePath
└── .github/workflows/deploy.yml
```

---

## 새 글 쓰기

1. `content/posts/` 에 `.mdx` 파일을 만듭니다. **파일 이름이 그대로 URL slug가 됩니다.**

   ```
   content/posts/http-cache.mdx  →  /posts/http-cache/
   ```

2. 파일 맨 위에 Front Matter를 작성합니다.

   ```mdx
   ---
   title: "HTTP Cache 정리"
   description: "HTTP Cache 동작 방식을 정리합니다."
   date: "2026-08-20"
   tags:
     - http
     - backend
   category: "development"
   draft: false
   ---

   본문을 Markdown으로 작성합니다.
   ```

3. 커밋하고 push하면 배포됩니다.

   ```bash
   git add .
   git commit -m "post: HTTP Cache 정리"
   git push
   ```

목록/태그/사이트맵/RSS는 모두 파일에서 자동으로 만들어집니다. 따로 등록할 곳은 없습니다.

### Front Matter 명세

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `title` | string | O | 글 제목. 목록과 `<title>` 에 사용 |
| `description` | string | O | 한 줄 요약. 목록과 SEO description에 사용 |
| `date` | string | O | 작성일. `YYYY-MM-DD` 형식. 정렬 기준 |
| `tags` | string[] | O | 태그 목록. 소문자로 정규화되어 `/tags/<tag>/` 생성 |
| `draft` | boolean | O | `true` 면 production 빌드에서 제외 |
| `updated` | string | | 수정일. `YYYY-MM-DD` |
| `category` | string | | 분류 |
| `thumbnail` | string | | 목록 카드와 Open Graph 이미지 경로 |

필수 필드가 없거나 형식이 틀리면 **빌드가 실패하고 어떤 파일의 어떤 필드가 문제인지 알려줍니다.**
타입 정의는 `lib/posts.ts` 의 `PostMetadata` 입니다.

### draft 사용법

```yaml
draft: true
```

- `pnpm dev`: 목록과 상세 페이지에 모두 보입니다.
- `pnpm build`: 페이지 자체가 생성되지 않고 sitemap/RSS에도 포함되지 않습니다.

production 빌드 결과에서 draft를 확인해야 한다면 `NEXT_PUBLIC_SHOW_DRAFTS=true pnpm build` 로 빌드합니다.

### 이미지 추가

글 slug와 같은 이름의 디렉터리를 만들고 그 안에 넣습니다.

```
public/images/posts/http-cache/
├── cover.webp
└── flow.webp
```

Markdown에서는 `public/` 을 뺀 절대 경로로 참조합니다.

```markdown
![캐시 흐름](/images/posts/http-cache/flow.webp)
```

- GitHub Pages에는 Next.js 이미지 최적화 서버가 없습니다. **이미지는 미리 적절한 크기로 줄여서 커밋하세요.**
- 사진은 WebP나 AVIF를 권장합니다. 다이어그램은 SVG도 좋습니다.
- `alt` 텍스트는 접근성을 위해 꼭 채웁니다. 장식용 이미지라면 `![](...)` 처럼 비워둡니다.

### MDX에서 컴포넌트 쓰기

`.mdx` 파일에서는 별도 import 없이 컴포넌트를 사용할 수 있습니다.

```mdx
<Callout type="info">
추가로 설명할 내용을 적습니다.
</Callout>
```

`type` 은 `info`, `tip`, `warning`, `danger` 중 하나입니다. `title` 로 제목을 바꿀 수 있습니다.
사용할 수 있는 컴포넌트와 태그 매핑은 `mdx-components.tsx` 에서 관리합니다.

`.md` 파일에서는 컴포넌트를 쓸 수 없고, 나머지 Markdown 문법은 동일하게 동작합니다.

### 코드 블록

구문 강조는 **빌드 시점**에 shiki로 처리합니다. 브라우저는 하이라이팅 JS를 내려받지 않습니다.

````markdown
```typescript
const hello = "world"
```
````

- 언어 이름이 코드 블록 위에 표시되고, 복사 버튼이 함께 붙습니다.
- 라이트/다크 테마 색상이 CSS 변수로 같이 들어가서 테마 전환 시 다시 하이라이팅하지 않습니다.
- 파일명을 붙이려면 ` ```ts title="next.config.ts" ` 처럼 씁니다.

---

## 사이트 설정

이름, 소개 문구, 작성자, 주소는 `site.config.ts` 한 곳에서 바꿉니다.

```ts
export const siteConfig = {
  name: 'My Blog',
  title: 'My Blog',
  description: '개발하면서 공부하고 경험한 내용을 기록합니다.',
  latestPostCount: 5,
  // ...
}
```

사이트 주소와 GitHub 사용자 이름은 환경 변수로도 덮어쓸 수 있습니다.

| 환경 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 사이트 절대 주소. canonical, sitemap, RSS에 사용 |
| `NEXT_PUBLIC_BASE_PATH` | 하위 경로 배포 시의 base path |
| `NEXT_PUBLIC_GITHUB_USERNAME` | GitHub 사용자 이름 (푸터 링크, 기본 주소 계산) |
| `NEXT_PUBLIC_SHOW_DRAFTS` | `true` 면 production 빌드에도 draft 포함 |

배포 워크플로가 GitHub Pages에서 받은 실제 주소를 이 값들로 넣어주기 때문에, 보통은 직접 설정하지 않아도 됩니다.
로컬에서 완성된 주소로 확인하고 싶다면 `site.config.ts` 의 기본값을 본인 사용자 이름으로 바꾸세요.

---

## GitHub Pages 배포

### 1. 저장소 만들기

주소를 `https://<username>.github.io/` 로 쓰려면 저장소 이름을 **`<username>.github.io`** 로 만듭니다.

```bash
git init
git add .
git commit -m "init: blog"
git branch -M main
git remote add origin https://github.com/<username>/<username>.github.io.git
git push -u origin main
```

### 2. Pages 활성화

저장소의 **Settings → Pages → Build and deployment → Source** 를 **`GitHub Actions`** 로 바꿉니다.
(`Deploy from a branch` 가 아닙니다. 이 설정을 바꾸지 않으면 배포가 실패합니다.)

### 3. 배포 확인

push하면 **Actions** 탭에서 `Deploy to GitHub Pages` 워크플로가 실행됩니다.
성공하면 `https://<username>.github.io/` 에서 확인할 수 있습니다.

이후로는 글을 push할 때마다 자동으로 다시 배포됩니다.

### 배포 파이프라인

`.github/workflows/deploy.yml` 이 하는 일입니다.

```
main 에 push
   ↓
checkout → pnpm 설정 → Node.js 설정
   ↓
actions/configure-pages   (Pages 주소와 base path를 받아온다)
   ↓
pnpm install --frozen-lockfile
   ↓
pnpm build                (Next.js static export → out/)
   ↓
actions/upload-pages-artifact  (./out 업로드)
   ↓
actions/deploy-pages      (GitHub Pages에 배포)
```

권한은 배포에 필요한 `contents: read`, `pages: write`, `id-token: write` 만 사용합니다.

### 일반 저장소(`<username>/blog`)에 배포하려면

주소가 `https://<username>.github.io/blog/` 처럼 하위 경로가 됩니다.
`configure-pages` 가 알려주는 base path를 워크플로가 그대로 빌드에 넘기기 때문에 **추가 설정 없이 그대로 동작합니다.**

경로 처리는 `site.config.ts` 한 곳에 모여 있습니다.

- `basePath` : `next.config.ts` 의 `basePath` 로 그대로 전달
- `withBasePath()` : Markdown 이미지처럼 Next.js가 자동으로 경로를 붙여주지 않는 곳에 사용
- `absoluteUrl()` : canonical / sitemap / RSS 의 절대 주소 생성

로컬에서 하위 경로 배포를 확인하려면 이렇게 빌드합니다.

```bash
NEXT_PUBLIC_BASE_PATH=/blog pnpm build && pnpm preview
```

---

## 알아둘 제약

GitHub Pages는 정적 파일만 제공하므로 다음 기능은 **사용할 수 없습니다.**

- SSR, ISR, Server Actions, Middleware, 서버 API
- 요청 시점 동적 렌더링
- Next.js 서버가 필요한 Image Optimization (`images.unoptimized: true` 로 꺼둔 상태입니다)

모든 데이터는 빌드 시점에 결정되어야 합니다.
검색이나 테마 전환처럼 브라우저 인터랙션이 꼭 필요한 곳에만 Client Component를 사용합니다.
현재 클라이언트로 내려가는 컴포넌트는 테마 토글과 코드 복사 버튼 두 개뿐입니다.
