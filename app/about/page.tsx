import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader';
import { createMetadata } from '@/lib/metadata';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = createMetadata({
  title: 'About',
  description: `${siteConfig.title} 소개`,
  pathname: '/about/',
});

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About" description={siteConfig.description} />

      <div className="prose">
        <p>
          개발하면서 공부한 내용과 실제로 겪은 문제, 그리고 그 해결 과정을 기록하는 공간입니다. 주로
          웹 프론트엔드와 그 주변 이야기를 다룹니다.
        </p>

        <h2>이 블로그는</h2>
        <ul>
          <li>Next.js App Router 와 MDX 로 만들었습니다.</li>
          <li>모든 글은 Git 저장소의 <code>content/posts</code> 에 Markdown 으로 보관합니다.</li>
          <li>빌드 결과를 GitHub Pages 로 정적 배포합니다. 서버와 데이터베이스는 없습니다.</li>
        </ul>

        <h2>연락</h2>
        <p>
          <a href={`https://github.com/${siteConfig.author.github}`}>
            github.com/{siteConfig.author.github}
          </a>
        </p>
      </div>
    </>
  );
}
