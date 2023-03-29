# vitepress-auto-blog

vitepress导航栏自动生成

🚀根据文件目录生成导航

可以根据配置生成`vitepress`的`nav`和`sidebar`配置

> 一级目录为顶部`nav`导航

> 二级目录为侧边栏`sidebar`导航


## Usage

1. 安装

```bash
pnpm i vitepress-auto-navigation
```

2. 在`vuepress`配置中使用插件，示例如下

```js
import autoNavigation from 'vitepress-auto-navigation'

const { nav, sidebar } = autoNavigation({
  baseurl: './blog'
})
module.exports = {
  themeConfig: {
    nav,
    sidebar,
  },
};
```

