import Link from 'next/link';

import { PageHeader } from '@/components/PageHeader';

export default function NotFound() {
  return (
    <>
      <PageHeader
        title="404 - 페이지를 찾을 수 없습니다"
        description="주소가 바뀌었거나 삭제된 글일 수 있습니다."
      />

      <p>
        <Link href="/">홈으로 돌아가기</Link>
        {' · '}
        <Link href="/posts/">전체 글 보기</Link>
      </p>
    </>
  );
}
