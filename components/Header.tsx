import Link from 'next/link';

import { siteConfig } from '@/site.config';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { href: '/posts/', label: 'Posts' },
  { href: '/tags/', label: 'Tags' },
  { href: '/about/', label: 'About' },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          {siteConfig.name}
        </Link>

        <nav aria-label="주요 메뉴" className={styles.nav}>
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
