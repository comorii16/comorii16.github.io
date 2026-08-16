import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader';
import { PostCard } from '@/components/PostCard';
import { createMetadata } from '@/lib/metadata';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = createMetadata({
  title: 'Posts',
  description: '작성한 모든 글 목록입니다.',
  pathname: '/posts/',
});

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <>
      <PageHeader title="Posts" description={`전체 ${posts.length}개의 글`} />

      {posts.length > 0 ? (
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p>아직 작성된 글이 없습니다.</p>
      )}
    </>
  );
}
