import { getAllPosts } from '@/lib/posts';
import { absoluteUrl, siteConfig } from '@/site.config';

// static export 에서도 빌드 시점에 파일로 떨어지도록 강제한다.
export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function GET() {
  const posts = getAllPosts();
  const feedUrl = absoluteUrl('/rss.xml');
  const lastBuildDate = new Date(
    posts[0] ? `${posts[0].metadata.date}T00:00:00Z` : Date.now(),
  ).toUTCString();

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/posts/${post.slug}/`);
      return `    <item>
      <title>${escapeXml(post.metadata.title)}</title>
      <description>${escapeXml(post.metadata.description)}</description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${post.metadata.date}T00:00:00Z`).toUTCString()}</pubDate>
${post.metadata.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${absoluteUrl('/')}</link>
    <language>${siteConfig.locale}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
