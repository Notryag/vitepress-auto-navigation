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

给定 `sourceDir` 和 `routeBase` 后，生成器遵循以下规则：

- 一级目录生成顶层 `nav`
- 一级目录下的 Markdown 文件归入名为 `other` 的侧边栏分组
- 二级目录生成侧边栏分组
- 二级目录下的所有 Markdown 文件都会被收集到该分组中
- `sourceDir` 根目录下的 Markdown 文件会被忽略
- `README.md` 和 `index.md` 会解析为栏目根路由

这让包的行为更可预测，但也意味着它是有边界的。

## 安装

```bash
pnpm add vitepress-auto-navigation
```

## 使用

```ts
import autoNavigation from 'vitepress-auto-navigation'

const { nav, sidebar } = autoNavigation({
  sourceDir: './docs',
  routeBase: '/docs',
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
- `sidebar['/docs/guide/']`: `other`、`config`
- `sidebar['/docs/api/']`: `other`

## 范围

这个包当前只解决一个窄问题：基于稳定的目录语义，从文档树推导出导航配置。

关键选项：

- `sourceDir`：实际扫描的文件系统目录
- `routeBase`：生成链接和 sidebar key 时使用的路由前缀
- `baseurl`：`sourceDir` 的兼容别名，保留是为了向后兼容
- `extensions`：要纳入索引的扩展名，例如 `['.md', '.js', '.ts']`
- `ignore`：额外忽略的目录或文件名
- `groupLabel`：替换默认的 `other` 分组名
- `resolveText`：自定义文件项显示文本
- `resolveLink`：自定义文件项链接

当前设计的非目标：

- 读取 frontmatter 标题
- 支持自定义排序元数据
- 支持多语言标签生成
- 自动生成外链导航
- 支持任意深度映射到导航结构

如果你的站点路由前缀和实际扫描目录不同，最好显式同时传入 `sourceDir` 和 `routeBase`。

## 代码文件

你也可以把 `.js`、`.ts`、`.html` 这类代码文件纳入索引，但它们本身不是 VitePress 页面。

做法是先用 `extensions` 把这些文件纳入扫描，再用 `resolveLink` 把它们映射到真正存在的页面路由：

```ts
const { nav, sidebar } = autoNavigation({
  sourceDir: './docs',
  routeBase: '/docs',
  extensions: ['.md', '.js', '.ts'],
  resolveText: (file) => file.relativePath.endsWith('.md') ? file.name : `code:${file.name}`,
  resolveLink: (file) =>
    file.relativePath.endsWith('.md')
      ? file.routePath
      : `/snippets/${file.relativePath.replace(/\.(js|ts)$/, '')}`,
})
```

这种方式适合你已经准备好了包装 Markdown 页面，或者站点里本来就有专门展示源码的自定义路由。

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
