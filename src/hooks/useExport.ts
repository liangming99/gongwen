/**
 * 导出功能 Hook
 */

import { useState, useCallback } from 'react';
import { exportToDocx, getDefaultFilename } from '@/utils/docxExport';
import { useDocumentStore, useParagraphs, useFormatConfig } from '@/stores/documentStore';
import type { ExportOptions } from '@/types';

interface UseExportReturn {
  isExporting: boolean;
  exportDocument: () => Promise<void>;
  error: string | null;
}

export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paragraphs = useParagraphs();
  const formatConfig = useFormatConfig();

  const exportDocument = useCallback(async (): Promise<void> => {
    if (paragraphs.length === 0) {
      alert('没有内容可导出，请先输入文本');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const options: ExportOptions = {
        filename: getDefaultFilename(),
        includePageNumbers: true,
      };

      await exportToDocx(paragraphs, formatConfig, options);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '导出失败';
      setError(errorMessage);
      console.error('Export error:', err);
      alert(`导出失败: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  }, [paragraphs, formatConfig]);

  return {
    isExporting,
    exportDocument,
    error,
  };
}
