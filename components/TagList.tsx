import Link from 'next/link';

import styles from './TagList.module.css';

interface TagListProps {
  tags: string[];
  size?: 'small' | 'medium';
  counts?: Record<string, number>;
}

export function TagList({ tags, size = 'medium', counts }: TagListProps) {
  return (
    <ul className={`${styles.list} ${size === 'small' ? styles.small : ''}`}>
      {tags.map((tag) => (
        <li key={tag}>
          <Link href={`/tags/${encodeURIComponent(tag)}/`} className={styles.tag}>
            <span aria-hidden>#</span>
            {tag}
            {counts ? <span className={styles.count}>{counts[tag] ?? 0}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
