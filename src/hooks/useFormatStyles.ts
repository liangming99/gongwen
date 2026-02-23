/**
 * CSS 变量动态绑定 Hook
 * 根据格式配置生成 CSS 变量
 */

import { useEffect } from 'react';
import type { FormatConfig } from '@/types';

/**
 * 将配置应用到 CSS 变量
 */
export function useFormatStyles(config: FormatConfig): void {
  useEffect(() => {
    const root = document.documentElement;

    // 页面设置
    root.style.setProperty('--page-margin-top', `${config.page.marginTop}cm`);
    root.style.setProperty('--page-margin-bottom', `${config.page.marginBottom}cm`);
    root.style.setProperty('--page-margin-left', `${config.page.marginLeft}cm`);
    root.style.setProperty('--page-margin-right', `${config.page.marginRight}cm`);

    // 字体设置
    root.style.setProperty('--font-main-title-family', config.fonts.mainTitle.family);
    root.style.setProperty('--font-main-title-size', `${config.fonts.mainTitle.size}pt`);
    root.style.setProperty('--font-main-title-weight', config.fonts.mainTitle.weight);

    root.style.setProperty('--font-level-1-family', config.fonts.level1.family);
    root.style.setProperty('--font-level-1-size', `${config.fonts.level1.size}pt`);
    root.style.setProperty('--font-level-1-weight', config.fonts.level1.weight);

    root.style.setProperty('--font-level-2-family', config.fonts.level2.family);
    root.style.setProperty('--font-level-2-size', `${config.fonts.level2.size}pt`);
    root.style.setProperty('--font-level-2-weight', config.fonts.level2.weight);

    root.style.setProperty('--font-level-3-family', config.fonts.level3.family);
    root.style.setProperty('--font-level-3-size', `${config.fonts.level3.size}pt`);
    root.style.setProperty('--font-level-3-weight', config.fonts.level3.weight);

    root.style.setProperty('--font-level-4-family', config.fonts.level4.family);
    root.style.setProperty('--font-level-4-size', `${config.fonts.level4.size}pt`);
    root.style.setProperty('--font-level-4-weight', config.fonts.level4.weight);

    root.style.setProperty('--font-body-family', config.fonts.body.family);
    root.style.setProperty('--font-body-size', `${config.fonts.body.size}pt`);
    root.style.setProperty('--font-body-weight', config.fonts.body.weight);

    root.style.setProperty('--font-page-number-family', config.fonts.pageNumber.family);
    root.style.setProperty('--font-page-number-size', `${config.fonts.pageNumber.size}pt`);
    root.style.setProperty('--font-page-number-weight', config.fonts.pageNumber.weight);

    // 间距设置
    root.style.setProperty('--line-height', `${config.spacing.lineHeight}pt`);
    root.style.setProperty('--first-line-indent', `${config.spacing.firstLineIndent}em`);
    root.style.setProperty('--paragraph-spacing', `${config.spacing.paragraphSpacing}pt`);
  }, [config]);
}
