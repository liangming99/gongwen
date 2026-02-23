/**
 * 文档状态管理 - Zustand Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DocumentState, DocumentActions, FormatConfig } from '@/types';
import { parseParagraphs } from '@/utils/paragraphParser';
import { DEFAULT_FORMAT_CONFIG, SAMPLE_TEXT } from '@/constants/gb9704';

// 初始状态
const initialState: Omit<DocumentState, keyof DocumentActions> = {
  rawText: SAMPLE_TEXT,
  paragraphs: parseParagraphs(SAMPLE_TEXT),
  formatConfig: { ...DEFAULT_FORMAT_CONFIG },
  currentPage: 1,
  totalPages: 1,
};

// 创建 Store
export const useDocumentStore = create<DocumentState & DocumentActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 设置原始文本并重新解析
      setRawText: (text: string) => {
        const paragraphs = parseParagraphs(text);
        set({ rawText: text, paragraphs });
      },

      // 更新完整格式配置
      updateFormatConfig: (config: Partial<FormatConfig>) => {
        const currentConfig = get().formatConfig;
        set({
          formatConfig: { ...currentConfig, ...config },
        });
      },

      // 更新页面设置
      updatePageSettings: (settings) => {
        const currentConfig = get().formatConfig;
        set({
          formatConfig: {
            ...currentConfig,
            page: { ...currentConfig.page, ...settings },
          },
        });
      },

      // 更新字体设置
      updateFontSettings: (level, settings) => {
        const currentConfig = get().formatConfig;
        set({
          formatConfig: {
            ...currentConfig,
            fonts: {
              ...currentConfig.fonts,
              [level]: { ...currentConfig.fonts[level], ...settings },
            },
          },
        });
      },

      // 更新间距设置
      updateSpacingSettings: (settings) => {
        const currentConfig = get().formatConfig;
        set({
          formatConfig: {
            ...currentConfig,
            spacing: { ...currentConfig.spacing, ...settings },
          },
        });
      },

      // 重置为默认配置
      resetFormatConfig: () => {
        set({ formatConfig: { ...DEFAULT_FORMAT_CONFIG } });
      },

      // 设置页码信息
      setPageInfo: (current: number, total: number) => {
        set({ currentPage: current, totalPages: total });
      },
    }),
    {
      name: 'gongwen-document-storage',
      partialize: (state) => ({
        formatConfig: state.formatConfig,
        rawText: state.rawText,
      }),
      onRehydrateStorage: () => (state) => {
        // 重新解析段落
        if (state && state.rawText) {
          state.paragraphs = parseParagraphs(state.rawText);
        }
      },
    }
  )
);

// 选择器钩子，用于获取特定状态片段
export const useParagraphs = () => useDocumentStore((state) => state.paragraphs);
export const useFormatConfig = () => useDocumentStore((state) => state.formatConfig);
export const useRawText = () => useDocumentStore((state) => state.rawText);
export const usePageInfo = () => useDocumentStore((state) => ({
  currentPage: state.currentPage,
  totalPages: state.totalPages
}));
