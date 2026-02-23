/**
 * 段落解析算法
 * 自动识别公文中的各级标题和正文
 */

import type { Paragraph, ParagraphType } from '@/types';

// 段落类型识别正则表达式
const PATTERNS = {
  // 主标题：第一行非空文本，且不符合其他标题格式
  mainTitle: /^[^\n]{1,100}$/,
  // 一级标题：一、二、三... + 顿号/点号
  level1: /^[一二三四五六七八九十百千万亿]+[、．.]\s*/,
  // 二级标题：（一）（二）... 或 (1)(2)...
  level2: /^[（(][一二三四五六七八九十][)）]\s*/,
  // 三级标题：1. 2. 3... 或 1、2、
  level3: /^\d+[、．.]\s*/,
  // 四级标题：（1）（2）... 或 (1)(2)...
  level4: /^[（(]\d+[)）]\s*/,
};

/**
 * 识别段落类型
 */
function identifyParagraphType(content: string, index: number, totalLines: number): ParagraphType {
  const trimmed = content.trim();

  if (!trimmed) {
    return 'body';
  }

  // 第一行非空内容作为主标题
  if (index === 0) {
    // 检查是否符合其他标题格式
    if (!PATTERNS.level1.test(trimmed) &&
        !PATTERNS.level2.test(trimmed) &&
        !PATTERNS.level3.test(trimmed) &&
        !PATTERNS.level4.test(trimmed)) {
      return 'main-title';
    }
  }

  // 按优先级匹配各级标题
  if (PATTERNS.level1.test(trimmed)) {
    return 'level-1';
  }
  if (PATTERNS.level2.test(trimmed)) {
    return 'level-2';
  }
  if (PATTERNS.level4.test(trimmed)) {
    return 'level-4';
  }
  if (PATTERNS.level3.test(trimmed)) {
    return 'level-3';
  }

  // 落款识别：短文本且包含日期或单位名称特征
  if (trimmed.length <= 20) {
    // 日期格式：2024年、二〇二四年、12月1日等
    const datePattern = /(\d{4}年|二[〇○零]二[三四五六七八九]年|\d{1,2}月\d{1,2}日)$/;
    // 单位特征：部、局、室、处、科、组等
    const unitPattern = /[部局室处科组院会]$/.test(trimmed) && trimmed.length <= 10;

    if (datePattern.test(trimmed) || unitPattern) {
      return 'signature';
    }
  }

  return 'body';
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 解析文本为段落数组
 */
export function parseParagraphs(text: string): Paragraph[] {
  if (!text || !text.trim()) {
    return [];
  }

  // 按行分割，保留空行用于段落分隔
  const lines = text.split('\n');
  const paragraphs: Paragraph[] = [];
  let currentParagraph = '';
  let lineIndex = 0;

  const flushParagraph = () => {
    const trimmed = currentParagraph.trim();
    if (trimmed) {
      const type = identifyParagraphType(trimmed, paragraphs.length, lines.length);
      paragraphs.push({
        id: generateId(),
        type,
        content: trimmed,
        rawContent: currentParagraph,
      });
    }
    currentParagraph = '';
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 空行表示段落分隔
    if (!trimmedLine) {
      flushParagraph();
      lineIndex = 0;
      continue;
    }

    // 检查是否是新标题（以标题模式开头）
    const isTitleLine =
      PATTERNS.level1.test(trimmedLine) ||
      PATTERNS.level2.test(trimmedLine) ||
      PATTERNS.level3.test(trimmedLine) ||
      PATTERNS.level4.test(trimmedLine);

    // 如果是标题行且当前有内容，先结束当前段落
    if (isTitleLine && currentParagraph.trim()) {
      flushParagraph();
    }

    // 添加到当前段落
    if (currentParagraph) {
      currentParagraph += '\n' + line;
    } else {
      currentParagraph = line;
    }

    // 标题行单独成段
    if (isTitleLine) {
      flushParagraph();
    }

    lineIndex++;
  }

  // 处理最后一个段落
  flushParagraph();

  return paragraphs;
}

/**
 * 统计各级标题数量
 */
export function countParagraphTypes(paragraphs: Paragraph[]): Record<ParagraphType, number> {
  const counts: Record<string, number> = {
    'main-title': 0,
    'level-1': 0,
    'level-2': 0,
    'level-3': 0,
    'level-4': 0,
    'body': 0,
    'signature': 0,
  };

  paragraphs.forEach((p) => {
    counts[p.type] = (counts[p.type] || 0) + 1;
  });

  return counts as Record<ParagraphType, number>;
}

/**
 * 获取段落显示文本（移除标题标记）
 */
export function getDisplayContent(paragraph: Paragraph): string {
  const { type, content } = paragraph;

  switch (type) {
    case 'level-1':
      return content.replace(PATTERNS.level1, '');
    case 'level-2':
      return content.replace(PATTERNS.level2, '');
    case 'level-3':
      return content.replace(PATTERNS.level3, '');
    case 'level-4':
      return content.replace(PATTERNS.level4, '');
    default:
      return content;
  }
}

/**
 * 判断是否需要首行缩进
 */
export function needsIndent(type: ParagraphType): boolean {
  return type === 'body' || type === 'signature';
}

/**
 * 判断是否居中对齐
 */
export function isCentered(type: ParagraphType): boolean {
  return type === 'main-title';
}
