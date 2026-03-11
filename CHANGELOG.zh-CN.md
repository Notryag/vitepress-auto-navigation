# 更新日志

[English](./CHANGELOG.md)

## 0.2.0 - 2026-03-11

### 变更

- 同时发布 ESM 和 CommonJS 入口，让新版 VitePress 配置可以直接 `import`
- 将文件系统扫描和站点路由生成拆分为 `sourceDir` 与 `routeBase`
- 生成的 sidebar key 和 link 统一改为站点路由，而不是本地磁盘路径
- 将 `README.md` 和 `index.md` 映射为栏目根路由
- 增加对 `.git`、`.vitepress`、`node_modules`、`dist` 等目录的默认忽略规则

### 新增

- 增加 `extensions`，允许在需要时把非 Markdown 文件纳入索引
- 增加 `resolveText` 和 `resolveLink` 钩子，方便通过自定义路由展示代码文件
- 增加针对路由生成、忽略目录、栏目根路由映射和代码文件自定义链接的测试覆盖

### 文档

- 补充 `sourceDir`、`routeBase`、`extensions`、`resolveText` 和 `resolveLink` 的说明

## 0.1.0 - 2026-03-10

### 变更

- 明确了包的定位：这是一个基于固定文档目录约定生成导航的工具，而不是通用导航系统
- 将原先脆弱的路径包含判断改为显式的父子目录遍历
- 稳定了侧边栏项目顺序，确保生成的 `nav` 链接优先指向更浅层的入口页面
- 将测试改为基于临时目录夹具，覆盖嵌套目录、相似目录名和空目录等场景
- 补充了 `exports`、`prepack`、`clean` 和 `peerDependencies` 等发包元信息
- 增加了 `bugs`、发版需要的附加文件配置以及 MIT `LICENSE`
- 用 `@rollup/plugin-terser` 替换已弃用的 `rollup-plugin-terser`
- 将源码类型定义迁移到 `src/`，使发布的声明文件完全由源码生成

### 文档

- 增加中英文 README
- 补充支持约定、非目标和路线图说明
