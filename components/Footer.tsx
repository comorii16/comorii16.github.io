import { siteConfig, withBasePath } from '@/site.config';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} {siteConfig.author.name}
        </p>
        <ul className={styles.links}>
          <li>
            <a href={withBasePath('/rss.xml')}>RSS</a>
          </li>
          <li>
            <a href={`https://github.com/${siteConfig.author.github}`}>GitHub</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
