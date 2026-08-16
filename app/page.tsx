import Link from 'next/link';

import { PostCard } from '@/components/PostCard';
import { getAllPosts, getLatestPosts } from '@/lib/posts';
import { siteConfig } from '@/site.config';
import styles from './page.module.css';

export default function HomePage() {
  const latestPosts = getLatestPosts(siteConfig.latestPostCount);
  const totalCount = getAllPosts().length;

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.title}>{siteConfig.title}</h1>
        <p className={styles.description}>{siteConfig.description}</p>
      </section>

      <section aria-labelledby="latest-posts">
        <div className={styles.sectionHeader}>
          <h2 id="latest-posts" className={styles.sectionTitle}>
            Latest Posts
          </h2>
          {totalCount > latestPosts.length ? (
            <Link href="/posts/" className={styles.more}>
              전체 {totalCount}개 보기
            </Link>
          ) : null}
        </div>

        {latestPosts.length > 0 ? (
          <div>
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} headingLevel={3} />
            ))}
          </div>
        ) : (
          <p>아직 작성된 글이 없습니다.</p>
        )}
      </section>
    </>
  );
}
