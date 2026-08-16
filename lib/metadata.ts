import type { Metadata } from 'next';

import { absoluteUrl, siteConfig, withBasePath } from '@/site.config';
import type { Post } from './posts';

interface PageMetadataInput {
  title: string;
  description: string;
  /** basePath 를 제외한 사이트 내부 경로. 예) /posts/hello-world/ */
  pathname: string;
  image?: string;
}

/** 모든 페이지 metadata 의 공통 형태(canonical + Open Graph + Twitter). */
export function createMetadata({
  title,
  description,
  pathname,
  image,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(pathname);
  const images = image ? [absoluteUrl(withBasePath(image))] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: siteConfig.title,
      locale: siteConfig.locale,
      title,
      description,
      url: canonical,
      images,
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title,
      description,
      images,
    },
  };
}

export function createPostMetadata(post: Post): Metadata {
  const { metadata } = post;
  const base = createMetadata({
    title: metadata.title,
    description: metadata.description,
    pathname: `/posts/${post.slug}/`,
    image: metadata.thumbnail,
  });

  return {
    ...base,
    keywords: metadata.tags,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: metadata.date,
      modifiedTime: metadata.updated ?? metadata.date,
      tags: metadata.tags,
    },
  };
}
