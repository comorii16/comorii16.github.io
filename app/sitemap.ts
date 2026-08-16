import type { MetadataRoute } from 'next';

import { getAllPosts } from '@/lib/posts';
import { getAllTags } from '@/lib/tags';
import { absoluteUrl } from '@/site.config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPostDate = posts[0]?.metadata.updated ?? posts[0]?.metadata.date;

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: latestPostDate, priority: 1, changeFrequency: 'weekly' },
    { url: absoluteUrl('/posts/'), lastModified: latestPostDate, priority: 0.8 },
    { url: absoluteUrl('/tags/'), priority: 0.5 },
    { url: absoluteUrl('/about/'), priority: 0.5 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/posts/${post.slug}/`),
    lastModified: post.metadata.updated ?? post.metadata.date,
    priority: 0.7,
  }));

  const tagPages: MetadataRoute.Sitemap = getAllTags().map(({ tag }) => ({
    url: absoluteUrl(`/tags/${encodeURIComponent(tag)}/`),
    priority: 0.3,
  }));

  return [...staticPages, ...postPages, ...tagPages];
}
