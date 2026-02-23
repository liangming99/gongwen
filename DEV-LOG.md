# 公文写作排版助手 - 开发日志

## 项目概述

**项目名称**: 公文写作排版助手
**项目目标**: 复刻 https://hehecat.github.io/gongwen/ 公文排版工具，实现符合 GB/T 9704 国家标准的公文写作排版助手
**开发周期**: 2026-02-23
**技术栈**: React 18 + TypeScript + Vite + Zustand + docx.js

---

## 一、项目初始化

### 1.1 技术选型

| 技术 | 选择理由 |
|------|----------|
| React 18 | 组件化开发，生态成熟，适合工具类应用 |
| TypeScript | 强类型保证，减少运行时错误，提升开发体验 |
| Vite | 构建速度快，HMR 热更新，配置简单 |
| Zustand | 轻量级状态管理，API 简洁，支持持久化 |
| docx.js | 成熟稳定的 Word 文档生成库 |
| CSS Modules | 样式隔离，避免命名冲突 |

### 1.2 项目结构

```
src/
├── components/          # UI组件
│   ├── Header/          # 顶部工具栏
│   ├── InputPanel/      # 左侧文本编辑
│   ├── PreviewPanel/    # 右侧A4预览
│   └── SettingsDrawer/  # 格式设置抽屉
├── hooks/               # 自定义Hooks
├── stores/              # 状态管理
├── utils/               # 工具函数
├── types/               # TypeScript类型
├── constants/           # 标准常量
└── styles/              # 全局样式
```

---

## 二、核心功能实现

### 2.1 段落解析算法

**问题**: 如何自动识别公文中的各级标题？

**解决方案**: 使用正则表达式 + 优先级匹配

```typescript
const PATTERNS = {
  level1: /^[一二三四五六七八九十百千万亿]+[、．.]\s*/,  // 一、二、三...
  level2: /^[（(][一二三四五六七八九十][)）]\s*/,       // （一）（二）...
  level3: /^\d+[、．.]\s*/,                             // 1. 2. 3...
  level4: /^[（(]\d+[)）]\s*/,                         // （1）（2）...
};
```

**经验**:
- 优先匹配四级标题再匹配三级，避免 `1.` 和 `（1）` 混淆
- 第一行非空内容默认作为主标题
- 短文本 + 日期/单位特征识别为落款

### 2.2 实时预览实现

**问题**: 如何实现 A4 纸张的实时预览？

**解决方案**:
- 使用 CSS 变量动态绑定格式配置
- A4 尺寸固定为 210mm × 297mm
- 使用 mm/cm 单位确保打印准确性

```css
.a4-page {
  width: 210mm;
  min-height: 297mm;
}
```

**教训**: 不要使用 px 单位，打印时会出现尺寸偏差

### 2.3 Word 导出实现

**问题**: 如何精确还原预览样式到 Word？

**解决方案**:
- 厘米转 twip: `cm * 567`
- pt 转 half-point: `pt * 2`
- 使用 `LineRuleType.EXACT` 确保行距精确

**关键代码**:
```typescript
// 厘米转 twip (1cm = 567 twip)
const cmToTwip = (cm: number): number => Math.round(cm * 567);

// pt 转 half-point (1pt = 2 half-point)
const ptToHalfPoint = (pt: number): number => Math.round(pt * 2);
```

**经验**: docx.js 的单位和 CSS 不同，需要仔细转换

---

## 三、遇到的问题与解决方案

### 问题 1: 文本编辑区无法滚动

**现象**: 左侧文本编辑区内容超出时无法滚动

**原因**: `overflow: hidden` 阻止了滚动

**解决**: 改为 `overflow: auto`，并确保 textarea 有 `min-height: 100%`

### 问题 2: 预览区无法滚动

**现象**: 右侧预览区 A4 纸张超出时无法滚动

**原因**: 容器高度计算问题

**解决**: 添加 `max-height: calc(100vh - 56px - 48px)` 限制最大高度

### 问题 3: 字体设置不够灵活

**现象**: 用户需要自定义字体

**解决**: 将字体设置改为 Tab 形式，支持选择：
- 字体（方正小标宋、宋体、黑体、楷体、仿宋）
- 字号（初号~小四）
- 字重（常规、粗体）

### 问题 4: TypeScript 编译错误

**现象**: `TS6133` 未使用变量错误，`TS2749` 类型错误

**解决**:
- 删除未使用的 import
- 函数返回类型推断，不显式声明
- 使用 `|| 'normal'` 处理可选属性

### 问题 5: 部署到 GitHub Pages 404

**现象**: 部署后访问 404

**原因**:
1. GitHub Pages 未在仓库设置中启用
2. base 路径配置不正确

**解决**:
- vite.config.ts 添加 `base: '/gongwen/'`
- 在仓库 Settings → Pages 中启用

---

## 四、最佳实践

### 4.1 状态管理

**经验**: Zustand + persist 中间件是最佳选择

```typescript
export const useDocumentStore = create<DocumentState & DocumentActions>()(
  persist(
    (set, get) => ({
      // 状态和 actions
    }),
    {
      name: 'gongwen-document-storage',
      partialize: (state) => ({
        formatConfig: state.formatConfig,
        rawText: state.rawText,
      }),
    }
  )
);
```

### 4.2 CSS 变量动态绑定

**经验**: 使用 CSS 变量实现实时样式更新

```typescript
export function useFormatStyles(config: FormatConfig): void {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-main-title-family', config.fonts.mainTitle.family);
    root.style.setProperty('--font-main-title-size', `${config.fonts.mainTitle.size}pt`);
    // ...
  }, [config]);
}
```

### 4.3 组件拆分原则

- **Header**: 纯展示组件，接收回调函数
- **InputPanel**: 管理文本输入，触发解析
- **PreviewPanel**: 纯展示，依赖 store 数据
- **SettingsDrawer**: 表单管理，实时更新配置

---

## 五、开发流程总结

### 5.1 推荐的开发顺序

1. **搭建项目结构** → 技术选型、目录规划
2. **定义类型和常量** → TypeScript 类型、GB/T 9704 标准
3. **实现核心算法** → 段落解析
4. **实现状态管理** → Zustand store
5. **开发基础组件** → InputPanel、PreviewPanel
6. **开发高级功能** → SettingsDrawer、Word 导出
7. **修复 Bug** → 滚动问题、TypeScript 错误
8. **部署上线** → GitHub Pages 配置

### 5.2 调试技巧

- 使用 Playwright MCP 进行浏览器自动化测试
- 使用 `console.log` 打印解析结果
- 使用 React DevTools 检查组件状态

---

## 六、经验与教训

### ✅ 做得好的地方

1. **技术选型合理**: React + TS + Vite 组合开发效率高
2. **状态管理清晰**: Zustand 比 Redux 轻量，适合本项目
3. **样式方案正确**: CSS Modules + CSS 变量实现动态样式
4. **组件拆分合理**: 各组件职责单一，易于维护

### ❌ 需要改进的地方

1. **前期规划不足**: 字体设置应该在第一阶段就设计为可配置
2. **TypeScript 严格模式**: 应该一开始就启用更严格的类型检查
3. **测试覆盖不足**: 缺乏单元测试，特别是段落解析算法
4. **文档不够完善**: 应该更早编写 README 和开发文档

### 📝 给后来者的建议

1. **先定义类型**: 在开始写组件前，先定义好所有 TypeScript 类型
2. **CSS 变量优先**: 对于需要动态调整的样式，优先使用 CSS 变量
3. **滚动问题早处理**: 页面布局时要尽早考虑滚动问题
4. **部署配置提前**: GitHub Pages 的配置应该在开发初期就完成

---

## 七、项目成果

### 功能清单

- [x] 智能段落识别（主标题、1-4级标题、正文、落款）
- [x] A4 实时预览（210mm×297mm）
- [x] 格式自定义（边距、字体、行距、缩进）
- [x] Word 导出（符合 GB/T 9704 标准）
- [x] 配置持久化（localStorage）

### 在线访问

- **GitHub**: https://github.com/liangming99/gongwen
- **Demo**: https://liangming99.github.io/gongwen/

---

## 八、后续优化方向

1. **分页预览**: 当内容超出 A4 时，显示多页预览
2. **图片插入**: 支持在公文中插入图片
3. **模板功能**: 提供常用公文模板
4. **协作编辑**: 支持多人实时协作
5. **移动端适配**: 优化手机端体验

---

**记录时间**: 2026-02-23
**记录者**: Claude Sonnet 4.6
**项目状态**: 已完成，已部署上线
