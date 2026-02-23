import React, { useMemo } from 'react';
import type { Paragraph, ParagraphType } from '@/types';
import styles from './ParagraphItem.module.css';

interface ParagraphItemProps {
  paragraph: Paragraph;
}

// 段落类型到 CSS 类名的映射
const TYPE_CLASS_MAP: Record<ParagraphType, string> = {
  'main-title': styles.mainTitle,
  'level-1': styles.level1,
  'level-2': styles.level2,
  'level-3': styles.level3,
  'level-4': styles.level4,
  'body': styles.body,
  'signature': styles.signature,
};

// 提取标题标记（如"一、"、"（一）"等）
function extractMarker(content: string, type: ParagraphType): string {
  switch (type) {
    case 'level-1':
      const l1Match = content.match(/^([一二三四五六七八九十百千万亿]+[、．.])/);
      return l1Match ? l1Match[1] : '';
    case 'level-2':
      const l2Match = content.match(/^([（(][一二三四五六七八九十][)）])/);
      return l2Match ? l2Match[1] : '';
    case 'level-3':
      const l3Match = content.match(/^(\d+[、．.])/);
      return l3Match ? l3Match[1] : '';
    case 'level-4':
      const l4Match = content.match(/^([（(]\d+[)）])/);
      return l4Match ? l4Match[1] : '';
    default:
      return '';
  }
}

// 获取内容（移除标题标记）
function getContentWithoutMarker(content: string, type: ParagraphType): string {
  const marker = extractMarker(content, type);
  return marker ? content.substring(marker.length).trim() : content;
}

export const ParagraphItem: React.FC<ParagraphItemProps> = ({ paragraph }) => {
  const { type, content } = paragraph;
  const className = TYPE_CLASS_MAP[type] || styles.body;

  const displayContent = useMemo(() => {
    if (type === 'main-title' || type === 'body' || type === 'signature') {
      return content;
    }
    return getContentWithoutMarker(content, type);
  }, [content, type]);

  const marker = useMemo(() => {
    return extractMarker(content, type);
  }, [content, type]);

  // 标题类型需要显示标记
  if (type.startsWith('level-')) {
    return (
      <p className={className}>
        <span className={styles.marker}>{marker}</span>
        {displayContent}
      </p>
    );
  }

  return <p className={className}>{displayContent}</p>;
};
