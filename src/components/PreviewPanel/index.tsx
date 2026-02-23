import React from 'react';
import { useParagraphs } from '@/stores/documentStore';
import { A4Page } from './A4Page';
import styles from './PreviewPanel.module.css';

export const PreviewPanel: React.FC = () => {
  const paragraphs = useParagraphs();

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          实时预览
        </span>
        <span className={styles.pageInfo}>
          共 {paragraphs.length} 个段落
        </span>
      </div>
      <div className={styles.previewArea}>
        <div className={styles.pageWrapper}>
          <A4Page
            paragraphs={paragraphs}
            pageNumber={1}
            totalPages={1}
          />
        </div>
      </div>
    </div>
  );
};
