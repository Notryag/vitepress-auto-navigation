# Changelog

[中文版本](./CHANGELOG.zh-CN.md)

## 0.2.0 - 2026-03-11

### Changed

- publish both ESM and CommonJS entry points so modern VitePress configs can import the package directly
- split filesystem scanning from route generation with `sourceDir` and `routeBase`
- normalize generated sidebar keys and links to site routes instead of local disk paths
- map `README.md` and `index.md` files to section root routes
- add default ignore rules for directories such as `.git`, `.vitepress`, `node_modules`, and `dist`

### Added

- support `extensions` so non-Markdown files can be indexed when needed
- support `resolveText` and `resolveLink` hooks so users can surface code files through custom routes
- add coverage for route generation, ignored directories, section root mapping, and custom code-file links

### Documentation

- document the new `sourceDir`, `routeBase`, `extensions`, `resolveText`, and `resolveLink` options

## 0.1.0 - 2026-03-10

### Changed

- tightened the package positioning around an opinionated docs-tree-to-navigation generator
- replaced fragile path matching with explicit parent-child directory traversal
- stabilized sidebar item ordering so generated nav links point to the shallowest entry page
- switched tests to fixture-based coverage for nested directories, similar names, and empty folders
- added package `exports`, `prepack`, `clean`, and `peerDependencies` metadata
- added `bugs`, release-oriented package files, and an MIT `LICENSE`
- replaced deprecated `rollup-plugin-terser` with `@rollup/plugin-terser`
- moved source type definitions into `src/` so published declarations are generated from source

### Documentation

- added bilingual README files
- clarified supported conventions, non-goals, and roadmap
