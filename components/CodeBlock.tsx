'use client';

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react';

import styles from './CodeBlock.module.css';

/**
 * 하이라이팅은 빌드 시점(shiki)에 끝나 있고, 이 컴포넌트는 복사 버튼만 담당한다.
 * 그래서 게시글 본문에서 클라이언트로 내려가는 JS 는 이 파일이 거의 전부다.
 */
export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const language = props['data-language' as keyof typeof props] as string | undefined;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    const text = preRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        {language ? <span className={styles.language}>{language}</span> : <span />}
        {/* 접근 가능한 이름이 보이는 텍스트와 어긋나지 않도록 라벨을 따로 두지 않는다 */}
        <button type="button" className={styles.copyButton} onClick={copy} title="코드 복사">
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
}
