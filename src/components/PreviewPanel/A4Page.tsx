import React from 'react';
import type { Paragraph } from '@/types';
import { ParagraphItem } from './ParagraphItem';
import styles from './A4Page.module.css';

interface A4PageProps {
  paragraphs: Paragraph[];
  pageNumber: number;
  totalPages: number;
}

export const A4Page: React.FC<A4PageProps> = ({
  paragraphs,
  pageNumber,
}) => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {paragraphs.map((paragraph) => (
          <ParagraphItem key={paragraph.id} paragraph={paragraph} />
        ))}
      </div>
      <div className={styles.pageNumber}>
        — {pageNumber} —
      </div>
    </div>
  );
};
