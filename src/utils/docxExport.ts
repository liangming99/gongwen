/**
 * Word 导出功能
 * 使用 docx.js 生成 .docx 文件
 */

import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  Packer,
  PageNumber,
  Header,
  Footer,
  convertInchesToTwip,
  LineRuleType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { Paragraph as GongwenParagraph, FormatConfig, ExportOptions } from '@/types';

// 厘米转 twip (1cm = 567 twip)
const cmToTwip = (cm: number): number => Math.round(cm * 567);

// pt 转 half-point (1pt = 2 half-point)
const ptToHalfPoint = (pt: number): number => Math.round(pt * 2);

// pt 转 twip (近似)
const ptToTwip = (pt: number): number => Math.round(pt * 20);

/**
 * 获取段落对齐方式
 */
function getAlignment(type: GongwenParagraph['type']): AlignmentType {
  switch (type) {
    case 'main-title':
      return AlignmentType.CENTER;
    case 'signature':
      return AlignmentType.RIGHT;
    default:
      return AlignmentType.JUSTIFIED;
  }
}

/**
 * 创建 TextRun
 */
function createTextRun(text: string, config: FormatConfig, type: GongwenParagraph['type']): TextRun {
  let fontSettings = config.fonts.body;

  switch (type) {
    case 'main-title':
      fontSettings = config.fonts.mainTitle;
      break;
    case 'level-1':
      fontSettings = config.fonts.level1;
      break;
    case 'level-2':
      fontSettings = config.fonts.level2;
      break;
    case 'level-3':
      fontSettings = config.fonts.level3;
      break;
    case 'level-4':
      fontSettings = config.fonts.level4;
      break;
    case 'body':
    case 'signature':
      fontSettings = config.fonts.body;
      break;
  }

  return new TextRun({
    text,
    font: fontSettings.family.split(',')[0].replace(/['"]/g, ''),
    size: ptToHalfPoint(fontSettings.size),
    bold: fontSettings.weight === 'bold',
  });
}

/**
 * 创建 docx Paragraph
 */
function createDocxParagraph(
  paragraph: GongwenParagraph,
  config: FormatConfig
): Paragraph {
  const { type, content } = paragraph;

  // 提取标题标记和内容
  let displayContent = content;
  let marker = '';

  if (type === 'level-1') {
    const match = content.match(/^([一二三四五六七八九十百千万亿]+[、．.])(.*)$/);
    if (match) {
      marker = match[1];
      displayContent = match[2].trim();
    }
  } else if (type === 'level-2') {
    const match = content.match(/^([（(][一二三四五六七八九十][)）])(.*)$/);
    if (match) {
      marker = match[1];
      displayContent = match[2].trim();
    }
  } else if (type === 'level-3') {
    const match = content.match(/^(\d+[、．.])(.*)$/);
    if (match) {
      marker = match[1];
      displayContent = match[2].trim();
    }
  } else if (type === 'level-4') {
    const match = content.match(/^([（(]\d+[)）])(.*)$/);
    if (match) {
      marker = match[1];
      displayContent = match[2].trim();
    }
  }

  // 构建子元素
  const children: TextRun[] = [];
  if (marker) {
    children.push(createTextRun(marker, config, type));
  }
  children.push(createTextRun(displayContent, config, type));

  // 计算缩进
  const firstLineIndent = type === 'body' ? cmToTwip(0.74) : 0; // 2字符约0.74cm

  return new Paragraph({
    children,
    alignment: getAlignment(type),
    spacing: {
      line: ptToTwip(config.spacing.lineHeight),
      lineRule: LineRuleType.EXACT,
      before: ptToTwip(config.spacing.paragraphSpacing),
      after: ptToTwip(config.spacing.paragraphSpacing),
    },
    indent: {
      firstLine: firstLineIndent,
    },
  });
}

/**
 * 导出为 Word 文档
 */
export async function exportToDocx(
  paragraphs: GongwenParagraph[],
  config: FormatConfig,
  options: ExportOptions
): Promise<void> {
  const { filename, includePageNumbers } = options;

  // 创建文档段落
  const docxParagraphs = paragraphs.map((p) => createDocxParagraph(p, config));

  // 添加空段落确保页面底部空间
  docxParagraphs.push(
    new Paragraph({
      text: '',
      spacing: { after: ptToTwip(100) },
    })
  );

  // 创建页脚（页码）
  const footer = includePageNumbers
    ? new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: '— ',
                font: config.fonts.pageNumber.family.split(',')[0].replace(/['"]/g, ''),
                size: ptToHalfPoint(config.fonts.pageNumber.size),
              }),
              new TextRun({
                children: [PageNumber.CURRENT],
                font: config.fonts.pageNumber.family.split(',')[0].replace(/['"]/g, ''),
                size: ptToHalfPoint(config.fonts.pageNumber.size),
              }),
              new TextRun({
                text: ' —',
                font: config.fonts.pageNumber.family.split(',')[0].replace(/['"]/g, ''),
                size: ptToHalfPoint(config.fonts.pageNumber.size),
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      })
    : undefined;

  // 创建文档
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: cmToTwip(config.page.marginTop),
              bottom: cmToTwip(config.page.marginBottom),
              left: cmToTwip(config.page.marginLeft),
              right: cmToTwip(config.page.marginRight),
            },
          },
        },
        children: docxParagraphs,
        footers: footer ? { default: footer } : undefined,
      },
    ],
  });

  // 生成并保存文件
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${filename}.docx`);
}

/**
 * 获取默认文件名
 */
export function getDefaultFilename(): string {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  return `公文_${dateStr}`;
}
