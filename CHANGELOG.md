# Changelog

[中文版本](./CHANGELOG.zh-CN.md)

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
