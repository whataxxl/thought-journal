# Thought Journal PWA — 项目状态

## 概述

「想法记录」PWA — 温暖复古风格的私人想法记录应用。主题为「云端壁炉」(The Digital Hearth)。

**部署地址:** https://whataxxl.github.io/thought-journal

## 技术栈

- React 19 + TypeScript 6
- Vite 8 (构建)
- TailwindCSS 4 (`@tailwindcss/vite` + `@theme` 配置)
- Dexie 4 (IndexedDB 封装)
- framer-motion (动画)
- React Router 7 (路由)
- lucide-react (图标)

## 色彩系统

| 变量 | 色值 | 用途 |
|------|------|------|
| cream | #FDF5E6 | 页面背景 |
| cream-light | #FFF9F0 | 卡片表面 |
| amber | #FFBF00 | 强调色/按钮 |
| coral | #F88379 | 删除/录音指示 |
| chocolate | #3E2723 | 主文字 |

## 路由

| 路径 | 页面 | 描述 |
|------|------|------|
| `/` | TodayPage | 首页瀑布流 + 呼吸FAB + 沉浸式输入 |
| `/all` | AllPage | 全部想法 (标签筛选 + 日期分组) |
| `/calendar` | CalendarPage | 月历视图 |
| `/settings` | SettingsPage | 位置授权/导出/删除 |
| `/thought/:id` | ThoughtDetailPage | 想法详情 + 段落批注 |

## 功能清单

### 数据层 ✅
- [x] Dexie IndexedDB (thoughts, annotations, tags, thoughtTags, media 五表)
- [x] thoughtRepo / annotationRepo / mediaRepo / tagRepo
- [x] 类型定义 (Thought, Annotation, MediaItem, Tag)

### UI 层 ✅ (Digital Hearth 改造完成)
- [x] 全站颜色迁移 (cream + amber + chocolate)
- [x] 卡片大圆角 (24-28px) + 琥珀彩色投影
- [x] CSS columns 瀑布流布局 (MasonryGrid)
- [x] framer-motion spring hover/tap 效果
- [x] 呼吸感 FAB (SVG blob + CSS breathe keyframe + 涟漪 + 长按)
- [x] 果冻滚动 (whileInView spring 入场)
- [x] 沉浸式输入 (backdrop-filter 模糊 + AnimatePresence + 琥珀光标)
- [x] 情绪光谱背景 (基于 emoji 心情选择 → 6种色调)
- [x] TabBar 新配色
- [x] 日历组件新配色
- [x] 设置页新配色

### 暂缓功能
- [ ] 时间色温变化 (日出/日落动画、烛光模式)
- [ ] 长按 FAB 直接启动录音 (当前长按仅打开输入框)

## 文件结构

```
src/
├── main.tsx              # 入口 (BrowserRouter + SW注册)
├── App.tsx               # 路由定义
├── index.css             # Tailwind v4 @theme + CSS变量 + 动画
├── types/index.ts        # 类型定义
├── pages/
│   ├── TodayPage.tsx     # 首页 (FAB + MasonryGrid + ImmersiveInput + 情绪背景)
│   ├── AllPage.tsx       # 全部 (标签筛选 + MasonryGrid + 情绪背景)
│   ├── CalendarPage.tsx  # 日历
│   ├── SettingsPage.tsx  # 设置
│   └── ThoughtDetailPage.tsx  # 详情 (段落批注)
├── components/
│   ├── BreathingFAB.tsx  # 呼吸感浮动按钮 (SVG blob + 涟漪 + 长按)
│   ├── ImmersiveInput.tsx # 沉浸式输入 (模糊遮罩 + AnimatePresence)
│   ├── MasonryGrid.tsx   # CSS columns 瀑布流容器
│   ├── ThoughtInput.tsx  # 输入组件 (文字+图片+音频+标签+心情)
│   ├── ThoughtCard.tsx   # 想法卡片 (framer-motion spring)
│   ├── Calendar.tsx      # 月历组件
│   ├── TabBar.tsx        # 底部导航
│   ├── MoodSelector.tsx  # 心情选择器 (10预设 + 自定义)
│   ├── TagInput.tsx      # 标签输入
│   ├── ImagePicker.tsx   # 图片选择 (拍照/相册)
│   ├── AudioRecorder.tsx # 录音组件
│   ├── AnnotationInput.tsx # 批注输入
│   ├── AnnotationItem.tsx  # 批注展示
│   └── LocationBadge.tsx   # 时间+位置标签
├── hooks/
│   ├── useThoughts.ts       # 想法数据加载
│   ├── useAnnotations.ts    # 批注数据加载
│   ├── useLocation.ts       # 地理定位
│   └── useMoodBackground.ts # 情绪→背景色
├── database/
│   ├── db.ts             # Dexie 数据库定义
│   ├── thoughtRepo.ts
│   ├── annotationRepo.ts
│   ├── mediaRepo.ts
│   └── tagRepo.ts
└── utils/
    ├── dateFormat.ts     # 日期工具
    ├── export.ts         # JSON/MD导出
    └── moodDetect.ts     # emoji→色调映射
```

## 最后更新

2026-04-29 — Digital Hearth UI 7 阶段完成 + 情绪检测改为 emoji 驱动
