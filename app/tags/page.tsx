import type { Metadata } from 'next';

import { PageHeader } from '@/components/PageHeader';
import { TagList } from '@/components/TagList';
import { createMetadata } from '@/lib/metadata';
import { getAllTags } from '@/lib/tags';

export const metadata: Metadata = createMetadata({
  title: 'Tags',
  description: '태그별로 글을 모아봅니다.',
  pathname: '/tags/',
});

export default function TagsPage() {
  const tags = getAllTags();
  const counts = Object.fromEntries(tags.map(({ tag, count }) => [tag, count]));

  return (
    <>
      <PageHeader title="Tags" description={`전체 ${tags.length}개의 태그`} />

      {tags.length > 0 ? (
        <TagList tags={tags.map(({ tag }) => tag)} counts={counts} />
      ) : (
        <p>아직 태그가 없습니다.</p>
      )}
    </>
  );
}
