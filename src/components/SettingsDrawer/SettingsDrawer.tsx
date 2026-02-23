import React, { useState, useEffect } from 'react';
import { useDocumentStore, useFormatConfig } from '@/stores/documentStore';
import { DEFAULT_FORMAT_CONFIG } from '@/constants/gb9704';
import type { FontSettings } from '@/types';
import styles from './SettingsDrawer.module.css';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// 字号选项
const FONT_SIZE_OPTIONS = [
  { label: '初号 (42pt)', value: 42 },
  { label: '小初 (36pt)', value: 36 },
  { label: '一号 (26pt)', value: 26 },
  { label: '小一 (24pt)', value: 24 },
  { label: '二号 (22pt)', value: 22 },
  { label: '小二 (18pt)', value: 18 },
  { label: '三号 (16pt)', value: 16 },
  { label: '小三 (15pt)', value: 15 },
  { label: '四号 (14pt)', value: 14 },
  { label: '小四 (12pt)', value: 12 },
];

// 字体选项
const FONT_FAMILY_OPTIONS = [
  { label: '方正小标宋简体', value: "'方正小标宋简体', '方正小标宋_GBK', '宋体', SimSun, serif" },
  { label: '宋体', value: "'宋体', SimSun, serif" },
  { label: '黑体', value: "'黑体', SimHei, sans-serif" },
  { label: '楷体', value: "'楷体', KaiTi, '楷体_GB2312', serif" },
  { label: '仿宋', value: "'仿宋', FangSong, '仿宋_GB2312', serif" },
];

// 字重选项
const FONT_WEIGHT_OPTIONS = [
  { label: '常规', value: 'normal' },
  { label: '粗体', value: 'bold' },
];

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const formatConfig = useFormatConfig();
  const { updatePageSettings, updateSpacingSettings, updateFontSettings, resetFormatConfig } = useDocumentStore();

  // 本地状态
  const [localConfig, setLocalConfig] = useState(formatConfig);
  const [activeTab, setActiveTab] = useState<'page' | 'font'>('page');

  // 同步外部配置变化
  useEffect(() => {
    setLocalConfig(formatConfig);
  }, [formatConfig]);

  if (!isOpen) return null;

  const handlePageChange = (field: keyof typeof localConfig.page, value: number) => {
    setLocalConfig(prev => ({
      ...prev,
      page: { ...prev.page, [field]: value },
    }));
    updatePageSettings({ [field]: value });
  };

  const handleSpacingChange = (field: keyof typeof localConfig.spacing, value: number) => {
    setLocalConfig(prev => ({
      ...prev,
      spacing: { ...prev.spacing, [field]: value },
    }));
    updateSpacingSettings({ [field]: value });
  };

  const handleFontChange = (
    level: keyof typeof localConfig.fonts,
    field: keyof FontSettings,
    value: string | number
  ) => {
    const newValue = field === 'size' ? Number(value) : value;
    setLocalConfig(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [level]: { ...prev.fonts[level], [field]: newValue },
      },
    }));
    updateFontSettings(level, { [field]: newValue });
  };

  const handleReset = () => {
    if (confirm('确定要重置为默认格式设置吗？')) {
      resetFormatConfig();
    }
  };

  // 查找当前字体对应的选项标签
  const getFontLabel = (fontValue: string) => {
    const option = FONT_FAMILY_OPTIONS.find(opt => opt.value === fontValue);
    return option?.label || '自定义';
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <h3 className={styles.title}>格式设置</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab 切换 */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'page' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('page')}
          >
            页面设置
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'font' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('font')}
          >
            字体设置
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'page' ? (
            <>
              {/* 页面设置 */}
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>页面边距</h4>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>上边距 (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className={styles.input}
                      value={localConfig.page.marginTop}
                      onChange={(e) => handlePageChange('marginTop', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>下边距 (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className={styles.input}
                      value={localConfig.page.marginBottom}
                      onChange={(e) => handlePageChange('marginBottom', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>左边距 (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className={styles.input}
                      value={localConfig.page.marginLeft}
                      onChange={(e) => handlePageChange('marginLeft', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>右边距 (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className={styles.input}
                      value={localConfig.page.marginRight}
                      onChange={(e) => handlePageChange('marginRight', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* 间距设置 */}
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>间距设置</h4>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>固定行距 (pt)</label>
                    <input
                      type="number"
                      step="1"
                      min="12"
                      max="50"
                      className={styles.input}
                      value={localConfig.spacing.lineHeight}
                      onChange={(e) => handleSpacingChange('lineHeight', parseFloat(e.target.value) || 29)}
                    />
                    <p className={styles.helpText}>标准值: 29pt</p>
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>首行缩进 (字符)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="4"
                      className={styles.input}
                      value={localConfig.spacing.firstLineIndent}
                      onChange={(e) => handleSpacingChange('firstLineIndent', parseFloat(e.target.value) || 0)}
                    />
                    <p className={styles.helpText}>标准值: 2字符</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 字体设置 */}
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>主标题字体</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>字体</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.mainTitle.family}
                      onChange={(e) => handleFontChange('mainTitle', 'family', e.target.value)}
                    >
                      {FONT_FAMILY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>字号</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.mainTitle.size}
                      onChange={(e) => handleFontChange('mainTitle', 'size', e.target.value)}
                    >
                      {FONT_SIZE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>字重</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.mainTitle.weight}
                      onChange={(e) => handleFontChange('mainTitle', 'weight', e.target.value)}
                    >
                      {FONT_WEIGHT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>一级标题字体</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>字体</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.level1.family}
                      onChange={(e) => handleFontChange('level1', 'family', e.target.value)}
                    >
                      {FONT_FAMILY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>字号</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.level1.size}
                      onChange={(e) => handleFontChange('level1', 'size', e.target.value)}
                    >
                      {FONT_SIZE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>字重</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.level1.weight}
                      onChange={(e) => handleFontChange('level1', 'weight', e.target.value)}
                    >
                      {FONT_WEIGHT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>二级标题字体</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>字体</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.level2.family}
                      onChange={(e) => handleFontChange('level2', 'family', e.target.value)}
                    >
                      {FONT_FAMILY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>字号</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.level2.size}
                      onChange={(e) => handleFontChange('level2', 'size', e.target.value)}
                    >
                      {FONT_SIZE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>字重</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.level2.weight}
                      onChange={(e) => handleFontChange('level2', 'weight', e.target.value)}
                    >
                      {FONT_WEIGHT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>正文/三级/四级标题字体</h4>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>字体</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.body.family}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleFontChange('body', 'family', value);
                        handleFontChange('level3', 'family', value);
                        handleFontChange('level4', 'family', value);
                      }}
                    >
                      {FONT_FAMILY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>字号</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.body.size}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        handleFontChange('body', 'size', value);
                        handleFontChange('level3', 'size', value);
                        handleFontChange('level4', 'size', value);
                      }}
                    >
                      {FONT_SIZE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className={`${styles.formGroup} ${styles.formGroupHalf}`}>
                    <label className={styles.label}>字重</label>
                    <select
                      className={styles.select}
                      value={localConfig.fonts.body.weight}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleFontChange('body', 'weight', value);
                        handleFontChange('level3', 'weight', value);
                        handleFontChange('level4', 'weight', value);
                      }}
                    >
                      {FONT_WEIGHT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleReset}>
            重置默认
          </button>
          <button className={styles.saveBtn} onClick={onClose}>
            完成
          </button>
        </div>
      </div>
    </>
  );
};
