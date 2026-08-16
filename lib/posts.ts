import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

/** Front Matter 스펙. 필수 필드가 빠지면 빌드가 실패한다. */
export interface PostMetadata {
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  /** YYYY-MM-DD */
  updated?: string;
  tags: string[];
  category?: string;
  /** public/ 기준 절대 경로. 예) /images/posts/hello-world/cover.webp */
  thumbnail?: string;
  draft: boolean;
}

export interface Post {
  slug: string;
  metadata: PostMetadata;
  /** 본문 기준 예상 읽기 시간(분) */
  readingTime: number;
  /** 상세 페이지에서 MDX 모듈을 동적으로 import 할 때 사용한다. */
  extension: '.mdx' | '.md';
}

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');
const POST_EXTENSIONS = ['.mdx', '.md'] as const;

/**
 * draft 글은 개발 환경에서만 보인다.
 * production build 에서도 확인하고 싶으면 NEXT_PUBLIC_SHOW_DRAFTS=true 로 빌드한다.
 */
const showDrafts =
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_SHOW_DRAFTS === 'true';

function isDateString(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseMetadata(raw: Record<string, unknown>, source: string): PostMetadata {
  const fail = (message: string): never => {
    throw new Error(`[content] ${source}: ${message}`);
  };

  const { title, description, date, updated, tags, category, thumbnail, draft } = raw;

  if (typeof title !== 'string' || !title.trim()) fail('front matter 의 title 이 필요합니다.');
  if (typeof description !== 'string' || !description.trim()) {
    fail('front matter 의 description 이 필요합니다.');
  }
  if (!isDateString(date)) fail('front matter 의 date 는 "YYYY-MM-DD" 형식이어야 합니다.');
  if (updated !== undefined && !isDateString(updated)) {
    fail('front matter 의 updated 는 "YYYY-MM-DD" 형식이어야 합니다.');
  }
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== 'string')) {
    fail('front matter 의 tags 는 문자열 배열이어야 합니다.');
  }
  if (typeof draft !== 'boolean') fail('front matter 의 draft 는 true 또는 false 여야 합니다.');
  if (category !== undefined && typeof category !== 'string') {
    fail('front matter 의 category 는 문자열이어야 합니다.');
  }
  if (thumbnail !== undefined && typeof thumbnail !== 'string') {
    fail('front matter 의 thumbnail 은 문자열이어야 합니다.');
  }

  return {
    title: title as string,
    description: description as string,
    date: date as string,
    updated: updated as string | undefined,
    tags: (tags as string[]).map(normalizeTag),
    category: category as string | undefined,
    thumbnail: thumbnail as string | undefined,
    draft: draft as boolean,
  };
}

/** 태그는 URL 과 목록에서 동일하게 다루도록 소문자 + 하이픈으로 정규화한다. */
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

/** 본문 200 단어/분 기준. 공백이 없는 한국어는 글자 수로 보정한다. */
function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const characters = content.replace(/\s/g, '').length;
  const minutes = Math.max(words / 200, characters / 500);
  return Math.max(1, Math.round(minutes));
}

function readPostFile(slug: string): Omit<Post, 'slug'> | null {
  for (const extension of POST_EXTENSIONS) {
    const filePath = path.join(POSTS_DIRECTORY, `${slug}${extension}`);
    if (!fs.existsSync(filePath)) continue;

    const file = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(file);

    return {
      metadata: parseMetadata(data, `content/posts/${slug}${extension}`),
      readingTime: estimateReadingTime(content),
      extension,
    };
  }

  return null;
}

let cachedPosts: Post[] | null = null;

/** 최신 글이 먼저 오도록 정렬된 전체 게시글 목록. */
export function getAllPosts(): Post[] {
  if (cachedPosts) return cachedPosts;

  if (!fs.existsSync(POSTS_DIRECTORY)) {
    cachedPosts = [];
    return cachedPosts;
  }

  const slugs = new Set(
    fs
      .readdirSync(POSTS_DIRECTORY)
      .filter((fileName) => POST_EXTENSIONS.some((extension) => fileName.endsWith(extension)))
      .map((fileName) => fileName.replace(/\.mdx?$/, '')),
  );

  const posts = [...slugs]
    .map((slug) => {
      const post = readPostFile(slug);
      return post ? ({ slug, ...post } satisfies Post) : null;
    })
    .filter((post): post is Post => post !== null)
    .filter((post) => showDrafts || !post.metadata.draft)
    .sort((a, b) => (a.metadata.date < b.metadata.date ? 1 : -1));

  cachedPosts = posts;
  return posts;
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((post) => post.slug === slug) ?? null;
}

export function getLatestPosts(count: number): Post[] {
  return getAllPosts().slice(0, count);
}

/** 목록은 최신순이므로 previous 는 더 예전 글, next 는 더 최근 글이다. */
export function getAdjacentPosts(slug: string): { previous: Post | null; next: Post | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}
