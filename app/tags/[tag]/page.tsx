import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/PageHeader';
import { PostCard } from '@/components/PostCard';
import { createMetadata } from '@/lib/metadata';
import { normalizeTag } from '@/lib/posts';
import { getAllTags, getPostsByTag } from '@/lib/tags';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = normalizeTag(decodeURIComponent(tag));

  return createMetadata({
    title: `#${decoded}`,
    description: `${decoded} 태그가 달린 글 목록입니다.`,
    pathname: `/tags/${encodeURIComponent(decoded)}/`,
  });
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decoded = normalizeTag(decodeURIComponent(tag));
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) notFound();

  return (
    <>
      <PageHeader title={`#${decoded}`} description={`${posts.length}개의 글`} />

      <div>
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
