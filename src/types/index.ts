/**
 * 公文写作排版助手 - 类型定义
 */

/** 段落类型 */
export type ParagraphType =
  | 'main-title'      // 主标题
  | 'level-1'         // 一级标题：一、二、三...
  | 'level-2'         // 二级标题：（一）（二）...
  | 'level-3'         // 三级标题：1. 2. 3...
  | 'level-4'         // 四级标题：（1）（2）...
  | 'body'            // 正文
  | 'signature';      // 落款

/** 段落数据 */
export interface Paragraph {
  id: string;
  type: ParagraphType;
  content: string;
  rawContent: string;
}

/** 字体设置 */
export interface FontSettings {
  family: string;
  size: number;       // pt
  weight?: 'normal' | 'bold';
}

/** 页面设置 */
export interface PageSettings {
  marginTop: number;      // cm
  marginBottom: number;   // cm
  marginLeft: number;     // cm
  marginRight: number;    // cm
}

/** 段落间距设置 */
export interface SpacingSettings {
  lineHeight: number;     // pt，固定行距
  firstLineIndent: number; // em，首行缩进
  paragraphSpacing: number; // pt，段前段后间距
}

/** 完整格式配置 */
export interface FormatConfig {
  page: PageSettings;
  fonts: {
    mainTitle: FontSettings;
    level1: FontSettings;
    level2: FontSettings;
    level3: FontSettings;
    level4: FontSettings;
    body: FontSettings;
    pageNumber: FontSettings;
  };
  spacing: SpacingSettings;
}

/** 文档状态 */
export interface DocumentState {
  // 原始输入文本
  rawText: string;
  // 解析后的段落
  paragraphs: Paragraph[];
  // 格式配置
  formatConfig: FormatConfig;
  // 当前页码
  currentPage: number;
  // 总页数
  totalPages: number;
}

/** 文档 Store Actions */
export interface DocumentActions {
  // 设置原始文本并解析
  setRawText: (text: string) => void;
  // 更新格式配置
  updateFormatConfig: (config: Partial<FormatConfig>) => void;
  // 更新页面设置
  updatePageSettings: (settings: Partial<PageSettings>) => void;
  // 更新字体设置
  updateFontSettings: (level: keyof FormatConfig['fonts'], settings: Partial<FontSettings>) => void;
  // 更新间距设置
  updateSpacingSettings: (settings: Partial<SpacingSettings>) => void;
  // 重置为默认配置
  resetFormatConfig: () => void;
  // 设置页码信息
  setPageInfo: (current: number, total: number) => void;
}

/** 导出选项 */
export interface ExportOptions {
  filename: string;
  includePageNumbers: boolean;
}
