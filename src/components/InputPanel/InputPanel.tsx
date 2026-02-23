import React, { useCallback, useMemo } from 'react';
import { useDocumentStore, useParagraphs, useRawText } from '@/stores/documentStore';
import { countParagraphTypes } from '@/utils/paragraphParser';
import styles from './InputPanel.module.css';

export const InputPanel: React.FC = () => {
  const rawText = useRawText();
  const paragraphs = useParagraphs();
  const setRawText = useDocumentStore((state) => state.setRawText);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
  }, [setRawText]);

  const handleClear = useCallback(() => {
    if (confirm('确定要清空所有内容吗？')) {
      setRawText('');
    }
  }, [setRawText]);

  const stats = useMemo(() => {
    const counts = countParagraphTypes(paragraphs);
    const totalChars = rawText.length;
    const totalLines = rawText.split('\n').length;

    return {
      totalChars,
      totalLines,
      totalParagraphs: paragraphs.length,
      titleCount: counts['level-1'] + counts['level-2'] + counts['level-3'] + counts['level-4'],
    };
  }, [paragraphs, rawText]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <span className={styles.toolbarTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          文本编辑
        </span>
        <div className={styles.stats}>
          <span className={styles.statItem}>{stats.totalChars} 字符</span>
          <span className={styles.statItem}>{stats.totalParagraphs} 段落</span>
          <button className={styles.clearBtn} onClick={handleClear} title="清空内容">
            清空
          </button>
        </div>
      </div>
      <div className={styles.textareaWrapper}>
        <textarea
          className={styles.textarea}
          value={rawText}
          onChange={handleChange}
          placeholder="在此输入公文内容...&#10;支持自动识别各级标题：&#10;一、一级标题&#10;（一）二级标题&#10;1. 三级标题&#10;（1）四级标题"
          spellCheck={false}
        />
      </div>
      <div className={styles.tips}>
        <div className={styles.tipsTitle}>📝 排版提示</div>
        <ul className={styles.tipsList}>
          <li>系统会自动识别各级标题格式</li>
          <li>正文段落首行自动缩进 2 字符</li>
          <li>落款（日期/署名）自动右对齐</li>
        </ul>
      </div>
    </div>
  );
};
