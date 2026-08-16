import Link from 'next/link';

import { formatDate } from '@/lib/format';
import type { Post } from '@/lib/posts';
import { withBasePath } from '@/site.config';
import { TagList } from './TagList';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  /** 카드 위에 다른 섹션 제목이 있는 경우 h3 으로 낮춰 heading 순서를 지킨다. */
  headingLevel?: 2 | 3;
}

export function PostCard({ post, headingLevel = 2 }: PostCardProps) {
  const { slug, metadata, readingTime } = post;
  const href = `/posts/${slug}/`;
  const Heading = `h${headingLevel}` as const;

  return (
    <article className={styles.card}>
      {metadata.thumbnail ? (
        <Link href={href} className={styles.thumbnailLink} tabIndex={-1} aria-hidden>
          <img
            className={styles.thumbnail}
            src={withBasePath(metadata.thumbnail)}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </Link>
      ) : null}

      <div className={styles.body}>
        <div className={styles.meta}>
          <time dateTime={metadata.date}>{formatDate(metadata.date)}</time>
          <span aria-hidden>·</span>
          <span>{readingTime}분 읽기</span>
          {metadata.draft ? <span className={styles.draft}>DRAFT</span> : null}
        </div>

        <Heading className={styles.title}>
          <Link href={href}>{metadata.title}</Link>
        </Heading>

        <p className={styles.description}>{metadata.description}</p>

        {metadata.tags.length > 0 ? <TagList tags={metadata.tags} size="small" /> : null}
      </div>
    </article>
  );
}
