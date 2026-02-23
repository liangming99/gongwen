# 公文写作排版助手

一个符合 GB/T 9704-2012 国家标准的公文写作排版工具，支持文本输入、实时预览、格式配置和 Word 导出功能。

![预览](./screenshot.png)

## 功能特性

- **智能段落识别**：自动识别主标题、一级~四级标题、正文、落款
- **A4 实时预览**：210mm×297mm 纸张实时渲染排版效果
- **格式自定义**：页面边距、字体、行距、缩进可调
- **Word 导出**：一键导出符合标准的 .docx 文件
- **配置持久化**：自动保存用户偏好设置

## 技术栈

- React 18 + TypeScript
- Vite
- Zustand（状态管理）
- docx.js（Word 导出）
- CSS Modules

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署到 GitHub Pages

### 方式一：自动部署（推荐）

1. Fork 或创建 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages（Settings → Pages → Source 选择 GitHub Actions）
3. 推送代码到 main 分支，自动触发部署

### 方式二：手动部署

```bash
# 部署到 GitHub Pages
npm run deploy
```

部署完成后，访问 `https://你的用户名.github.io/gongwen/`

## GB/T 9704-2012 标准配置

| 项目 | 默认值 |
|------|--------|
| 上边距 | 3.7cm |
| 下边距 | 3.5cm |
| 左边距 | 2.8cm |
| 右边距 | 2.6cm |
| 主标题字体 | 方正小标宋简体 / 二号 |
| 一级标题 | 黑体 / 三号 |
| 二级标题 | 楷体 / 三号 |
| 正文 | 仿宋 / 三号 |
| 行距 | 固定值 29pt |
| 首行缩进 | 2 字符 |

## 开源协议

MIT
