# vitepress-auto-navigation

[中文说明](./README.zh-CN.md)

Generate `nav` and `sidebar` config for VitePress from a predictable docs directory structure.

This package is intentionally opinionated. It is not a general-purpose content indexing system. It is a small generator for teams that want to keep navigation in sync with folders instead of maintaining a large manual config.

## Positioning

Use this package if:

- you want navigation to follow a fixed docs tree convention
- you prefer folder structure over hand-written `themeConfig.nav` and `themeConfig.sidebar`
- your VitePress site mainly uses first-level sections with grouped content underneath

Do not use this package if:

- you need fully custom navigation labels, ordering, badges, icons, or mixed external links
- your information architecture changes often and does not map cleanly to folders
- you already maintain a hand-tuned VitePress theme config

## Current Convention

Given `baseurl`, the generator follows these rules:

- first-level directories become top-level `nav`
- Markdown files directly under a first-level directory go into a sidebar group named `other`
- second-level directories become sidebar groups
- all Markdown files nested under a second-level directory are collected into that group
- Markdown files directly under `baseurl` are ignored

This makes the package predictable, but also intentionally limited.

## Install

```bash
pnpm add vitepress-auto-navigation
```

## Usage

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

## Example

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

Generates:

- `nav`: `guide`, `api`
- `sidebar['docs/guide']`: `other`, `config`
- `sidebar['docs/api']`: `other`

## Scope

This package currently solves one narrow problem: derive navigation from a docs tree with stable directory semantics.

Non-goals for the current design:

- reading frontmatter titles
- custom sorting metadata
- localized labels
- automatic external link generation
- arbitrary depth-to-navigation mapping

## Roadmap

Near term:

- support explicit sorting hooks or file-name based ordering
- allow replacing the default `other` group label
- improve package output so published types are cleaner

Later, if demand is real:

- derive labels from frontmatter or headings
- allow opt-in handling for Markdown files at the root of `baseurl`
- expose lower-level tree utilities for custom generators

## Why This Package Still Exists

VitePress handles routing and internal links well, but it still expects you to provide `nav` and `sidebar` config. This package exists for users who want that config to be generated from a directory convention instead of being maintained manually.
