import type { ReactNode } from 'react';

import styles from './Callout.module.css';

type CalloutType = 'info' | 'tip' | 'warning' | 'danger';

const TYPE_LABEL: Record<CalloutType, string> = {
  info: '참고',
  tip: '팁',
  warning: '주의',
  danger: '경고',
};

export function Callout({
  type = 'info',
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={`${styles.callout} ${styles[type]}`}>
      <p className={styles.title}>{title ?? TYPE_LABEL[type]}</p>
      <div className={styles.content}>{children}</div>
    </aside>
  );
}
