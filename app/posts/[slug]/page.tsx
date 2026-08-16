import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TagList } from '@/components/TagList';
import { formatDate } from '@/lib/format';
import { createPostMetadata } from '@/lib/metadata';
import { getAdjacentPosts, getPostBySlug, getPostSlugs, type Post } from '@/lib/posts';
import { absoluteUrl, siteConfig, withBasePath } from '@/site.config';
import styles from './page.module.css';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return createPostMetadata(post);
}

/**
 * content/posts 의 MDX 를 빌드 시점에 가져온다.
 * 템플릿 리터럴 경로라 번들러가 해당 디렉터리 전체를 정적으로 분석한다.
 */
async function loadPostContent(post: Post) {
  if (post.extension === '.md') {
    const mod = await import(`../../../content/posts/${post.slug}.md`);
    return mod.default;
  }
  const mod = await import(`../../../content/posts/${post.slug}.mdx`);
  return mod.default;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { metadata } = post;
  const { previous, next } = getAdjacentPosts(slug);
  const Content = await loadPostContent(post);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: metadata.title,
    description: metadata.description,
    datePublished: metadata.date,
    dateModified: metadata.updated ?? metadata.date,
    keywords: metadata.tags.join(', '),
    url: absoluteUrl(`/posts/${slug}/`),
    author: { '@type': 'Person', name: siteConfig.author.name },
    ...(metadata.thumbnail
      ? { image: [absoluteUrl(withBasePath(metadata.thumbnail))] }
      : {}),
  };

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.title}>{metadata.title}</h1>
        <p className={styles.description}>{metadata.description}</p>

        <div className={styles.meta}>
          <time dateTime={metadata.date}>{formatDate(metadata.date)} 작성</time>
          {metadata.updated && metadata.updated !== metadata.date ? (
            <time dateTime={metadata.updated}>{formatDate(metadata.updated)} 수정</time>
          ) : null}
          <span>{post.readingTime}분 읽기</span>
          {metadata.draft ? <span className={styles.draft}>DRAFT</span> : null}
        </div>

        {metadata.tags.length > 0 ? <TagList tags={metadata.tags} size="small" /> : null}
      </header>

      {metadata.thumbnail ? (
        <img
          className={styles.cover}
          src={withBasePath(metadata.thumbnail)}
          alt=""
          decoding="async"
        />
      ) : null}

      <div className="prose">
        <Content />
      </div>

      <nav className={styles.pagination} aria-label="다른 글">
        {previous ? (
          <Link href={`/posts/${previous.slug}/`} className={styles.paginationLink}>
            <span className={styles.paginationLabel}>이전 글</span>
            <span className={styles.paginationTitle}>{previous.metadata.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/posts/${next.slug}/`} className={`${styles.paginationLink} ${styles.next}`}>
            <span className={styles.paginationLabel}>다음 글</span>
            <span className={styles.paginationTitle}>{next.metadata.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
