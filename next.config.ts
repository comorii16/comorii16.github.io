import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

import { siteConfig } from './site.config';

const nextConfig: NextConfig = {
  // GitHub Pages 는 정적 파일만 제공하므로 static export 를 사용한다.
  output: 'export',
  // `/posts/foo/` 형태로 디렉터리 + index.html 이 생성되어 직접 URL 접근이 가능해진다.
  trailingSlash: true,
  // Next.js 서버가 없으므로 런타임 이미지 최적화를 사용하지 않는다.
  images: { unoptimized: true },
  basePath: siteConfig.basePath || undefined,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
};

/**
 * Turbopack 은 로더 옵션을 직렬화해서 Rust 쪽으로 넘기기 때문에
 * remark/rehype 플러그인을 함수가 아닌 "문자열 + 직렬화 가능한 옵션" 으로 지정해야 한다.
 * (각 항목은 옵션이 없어도 배열로 감싸야 한다.)
 */
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [['remark-frontmatter'], ['remark-gfm']],
    rehypePlugins: [
      ['rehype-slug'],
      [
        'rehype-pretty-code',
        {
          // 빌드 시점에 하이라이팅하고, 라이트/다크 두 벌을 CSS 변수로 함께 내보낸다.
          // high-contrast 변형을 써야 코드 안의 색까지 대비 4.5:1 을 만족한다.
          theme: {
            light: 'github-light-high-contrast',
            dark: 'github-dark-high-contrast',
          },
          defaultLang: 'plaintext',
          keepBackground: false,
          bypassInlineCode: true,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
