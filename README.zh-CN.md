# vitepress-auto-navigation

[English](./README.md)

根据固定的文档目录结构，为 VitePress 生成 `nav` 和 `sidebar` 配置。

这个包是有明确约束的，不是通用内容索引系统。它更适合那些希望让导航跟随目录结构，而不是长期手写大段 `themeConfig` 配置的团队。

## 定位

适合这些场景：

- 你希望导航遵循固定的文档目录约定
- 你更愿意维护文件夹结构，而不是手写 `themeConfig.nav` 和 `themeConfig.sidebar`
- 你的 VitePress 站点主要由一级栏目和其下分组内容组成

不适合这些场景：

- 你需要完全自定义的导航标题、排序、徽标、图标或混合外链
- 你的信息架构经常变化，且很难稳定映射到目录
- 你已经在维护一套精细手调的 VitePress 主题配置

## 当前约定

给定 `baseurl` 后，生成器遵循以下规则：

- 一级目录生成顶层 `nav`
- 一级目录下的 Markdown 文件归入名为 `other` 的侧边栏分组
- 二级目录生成侧边栏分组
- 二级目录下的所有 Markdown 文件都会被收集到该分组中
- `baseurl` 根目录下的 Markdown 文件会被忽略

这让包的行为更可预测，但也意味着它是有边界的。

## 安装

```bash
pnpm add vitepress-auto-navigation
```

## 使用

```ts
import autoNavigation from 'vitepress-auto-navigation'

const { nav, sidebar } = autoNavigation({
  baseurl: './docs',
})

export default {
  themeConfig: {
    nav,
    sidebar,
  },
}
```

## 示例

```text
docs
├─ guide
│  ├─ getting-started.md
│  └─ config
│     ├─ basic.md
│     └─ advanced
│        └─ deep-dive.md
└─ api
   └─ reference.md
```

会生成：

- `nav`: `guide`、`api`
- `sidebar['docs/guide']`: `other`、`config`
- `sidebar['docs/api']`: `other`

## 范围

这个包当前只解决一个窄问题：基于稳定的目录语义，从文档树推导出导航配置。

当前设计的非目标：

- 读取 frontmatter 标题
- 支持自定义排序元数据
- 支持多语言标签生成
- 自动生成外链导航
- 支持任意深度映射到导航结构

## 路线图

近期：

- 支持显式排序钩子或基于文件名的排序
- 支持替换默认的 `other` 分组名
- 继续清理发布产物里的类型结构

如果后续确实有需求：

- 从 frontmatter 或标题中推导展示名称
- 可选支持处理 `baseurl` 根目录下的 Markdown 文件
- 暴露更底层的目录树工具，供自定义生成器复用

## 为什么这个包仍然有存在意义

VitePress 在路由和站内链接方面已经做得很好，但它仍然要求你提供 `nav` 和 `sidebar` 配置。这个包的存在意义，是让这部分配置可以基于目录约定自动生成，而不是完全手工维护。
