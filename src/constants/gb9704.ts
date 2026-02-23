/**
 * GB/T 9704-2012 党政机关公文格式 标准常量
 */

import type { FormatConfig } from '@/types';

/** 默认页面设置（单位：cm） */
export const DEFAULT_PAGE_SETTINGS = {
  marginTop: 3.7,
  marginBottom: 3.5,
  marginLeft: 2.8,
  marginRight: 2.6,
} as const;

/** A4 纸张尺寸（单位：mm） */
export const A4_SIZE = {
  width: 210,
  height: 297,
} as const;

/** 标准字体设置 */
export const DEFAULT_FONT_SETTINGS = {
  mainTitle: {
    family: '方正小标宋简体, 方正小标宋_GBK, 宋体, SimSun, serif',
    size: 22,           // 二号
    weight: 'normal' as const,
  },
  level1: {
    family: '黑体, SimHei, sans-serif',
    size: 16,           // 三号
    weight: 'bold' as const,
  },
  level2: {
    family: '楷体, KaiTi, 楷体_GB2312, serif',
    size: 16,           // 三号
    weight: 'bold' as const,
  },
  level3: {
    family: '仿宋, FangSong, 仿宋_GB2312, serif',
    size: 16,           // 三号
    weight: 'bold' as const,
  },
  level4: {
    family: '仿宋, FangSong, 仿宋_GB2312, serif',
    size: 16,           // 三号
    weight: 'normal' as const,
  },
  body: {
    family: '仿宋, FangSong, 仿宋_GB2312, serif',
    size: 16,           // 三号
    weight: 'normal' as const,
  },
  pageNumber: {
    family: '宋体, SimSun, serif',
    size: 14,           // 四号
    weight: 'normal' as const,
  },
} as const;

/** 标准间距设置（单位：pt） */
export const DEFAULT_SPACING_SETTINGS = {
  lineHeight: 29,           // 固定值 29 磅（约 1.02 倍行距）
  firstLineIndent: 2,       // 首行缩进 2 字符
  paragraphSpacing: 0,      // 段前段后 0
} as const;

/** 完整的默认格式配置 */
export const DEFAULT_FORMAT_CONFIG: FormatConfig = {
  page: { ...DEFAULT_PAGE_SETTINGS },
  fonts: { ...DEFAULT_FONT_SETTINGS },
  spacing: { ...DEFAULT_SPACING_SETTINGS },
};

/** 段落类型显示名称 */
export const PARAGRAPH_TYPE_LABELS: Record<string, string> = {
  'main-title': '主标题',
  'level-1': '一级标题',
  'level-2': '二级标题',
  'level-3': '三级标题',
  'level-4': '四级标题',
  'body': '正文',
  'signature': '落款',
};

/** 字号对照表（pt） */
export const FONT_SIZE_MAP: Record<string, number> = {
  '初号': 42,
  '小初': 36,
  '一号': 26,
  '小一': 24,
  '二号': 22,
  '小二': 18,
  '三号': 16,
  '小三': 15,
  '四号': 14,
  '小四': 12,
  '五号': 10.5,
  '小五': 9,
  '六号': 7.5,
  '小六': 6.5,
  '七号': 5.5,
  '八号': 5,
};

/** 示例文本 */
export const SAMPLE_TEXT = `关于开展2024年度工作总结的通知

各科室、各部门：

一、工作总结内容

（一）年度工作完成情况

1. 重点工作任务

（1）完成年度目标制定

（2）推进各项改革措施

2. 常规工作内容

（二）存在问题与不足

二、工作要求

（一）高度重视

各部门要充分认识年度总结工作的重要性，认真组织，确保质量。

（二）按时完成

请于2024年12月31日前将总结材料报送至办公室。

三、联系方式

联系人：张三
联系电话：1234567890

办公室
2024年12月1日`;
