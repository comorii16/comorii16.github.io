import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';

import { Callout } from '@/components/Callout';
import { CodeBlock } from '@/components/CodeBlock';
import { withBasePath } from '@/site.config';

function Anchor({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#');

  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

/**
 * GitHub Pages 에서는 서버 이미지 최적화를 쓸 수 없으므로 그대로 <img> 로 내보내고,
 * public/ 기준 절대 경로에는 basePath 만 붙여준다.
 */
function MdxImage({ src, alt, ...props }: ComponentPropsWithoutRef<'img'>) {
  const resolved = typeof src === 'string' ? withBasePath(src) : src;
  return <img src={resolved} alt={alt ?? ''} loading="lazy" decoding="async" {...props} />;
}

/** 좁은 화면에서 표가 본문 폭을 넘지 않도록 가로 스크롤 컨테이너로 감싼다. */
function MdxTable(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="tableWrapper">
      <table {...props} />
    </div>
  );
}

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    a: Anchor,
    img: MdxImage,
    pre: CodeBlock,
    table: MdxTable,
    Callout,
    ...components,
  };
}
