# 渐变背景生成器

一个基于 Next.js + React + TypeScript 的渐变背景生成工具，使用色轮进行颜色选择，支持自由选择和智能推荐两种模式。

## 功能特性

### 色彩选择模式

1. **自由选择模式**
   - 在色轮上自由拖动选择两种颜色
   - 完全掌控您的配色方案
   - 支持手动输入 HEX 颜色值

2. **推荐选择模式**
   - 选择一个主颜色，系统自动推荐最佳配色
   - 基于色彩理论算法，提供 6 种色彩和谐方案：
     - **互补色 (Complementary)**: 色轮对面 180°，对比强烈
     - **类似色 (Analogous)**: 相邻 ±30°，和谐统一
     - **三色 (Triadic)**: 等距 120°，平衡丰富
     - **分裂互补色 (Split-Complementary)**: 互补色两侧，对比适中
     - **四色 (Tetradic)**: 矩形分布，丰富多彩
     - **单色 (Monochromatic)**: 同色相不同明度，简洁优雅

### 核心功能

- **可视化色轮**: 直观的颜色选择界面
- **实时预览**: 即时查看渐变效果
- **高度调节**: 可调整预览区域高度
- **CSS 代码生成**: 一键复制 CSS 代码
- **API 接口**: 提供 API 调用方式

## 色彩推荐算法

本项目采用基于 **HSL 色彩空间** 和 **色彩理论** 的推荐算法：

### 算法原理

1. **色彩空间转换**: 将 HEX 颜色转换为 HSL (色相/饱和度/明度)
2. **色相偏移计算**: 根据不同的和谐规则计算推荐色相
   - 互补色: `hue + 180°`
   - 类似色: `hue ± 30°`
   - 三色: `hue + 120°, hue + 240°`
   - 分裂互补: `hue + 150°, hue + 210°`
   - 四色: `hue + 60°, hue + 180°, hue + 240°`
3. **对比度优化**: 计算颜色对比度，确保可读性

### 算法优势

- 基于成熟的色彩理论
- 计算速度快，实时响应
- 支持多种和谐方案
- 可扩展性强

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **测试**: Jest

## 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 项目结构

```
project/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # 全局样式
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx            # 主页面
│   ├── components/             # React 组件
│   │   ├── ColorWheel.tsx      # 色轮组件
│   │   └── ColorPicker.tsx     # 色彩选择器组件
│   ├── types/                  # TypeScript 类型定义
│   │   └── color.ts            # 颜色相关类型
│   ├── utils/                  # 工具函数
│   │   └── colorUtils.ts       # 颜色转换和推荐算法
│   └── __tests__/              # 测试文件
│       └── colorUtils.test.ts  # 颜色工具测试
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── jest.config.js
```

## 使用说明

### 自由选择模式

1. 点击"自由选择"按钮
2. 在色轮上拖动白色边框的选择器选择主颜色
3. 拖动另一个选择器选择第二颜色
4. 查看实时预览效果
5. 复制生成的 CSS 代码

### 推荐选择模式

1. 点击"推荐选择"按钮
2. 在色轮上选择主颜色
3. 系统自动计算并显示推荐颜色
4. 查看下方"色彩和谐方案"区域
5. 点击不同方案应用到预览

### 亮度调节

使用"变暗"/"变亮"按钮微调主颜色的亮度。

## API 使用

### 获取渐变 CSS

```
GET /api/gradient?from={hex}&to={hex}&height={number}
```

参数:
- `from`: 起始颜色 (HEX，不带 #)
- `to`: 结束颜色 (HEX，不带 #)
- `height`: 高度 (像素)

示例:
```
/api/gradient?from=3b82f6&to=f59e0b&height=400
```

## 测试覆盖

测试文件: `src/__tests__/colorUtils.test.ts`

测试内容:
- 颜色格式转换 (HEX ↔ RGB ↔ HSL)
- 色彩和谐方案生成
- 对比度计算
- 颜色推荐算法
- 边界情况处理

运行测试:
```bash
npm test
```

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT
