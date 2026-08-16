import { getAllPosts, normalizeTag, type Post } from './posts';

export interface TagSummary {
  tag: string;
  count: number;
}

/** 글이 많은 태그부터, 개수가 같으면 이름순. */
export function getAllTags(): TagSummary[] {
  const counts = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.metadata.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  const normalized = normalizeTag(tag);
  return getAllPosts().filter((post) => post.metadata.tags.includes(normalized));
}
