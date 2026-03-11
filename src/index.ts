import * as fs from "node:fs"
import * as path from "node:path"
import type { DefaultTheme } from "vitepress/types/default-theme"
import type { FileInfo, Option, ResolveLink, ResolveText } from "./types"
import {
  createDirectoryRoute,
  createFileRoute,
  formatFileInfos,
  formatFileName,
  isContentFile,
  normalizeExtensions,
  normalizeRouteBase,
  shouldIgnoreEntry,
  toPosixPath,
} from "./utils"

type ResolvedOption = {
  sourceDir: string
  routeBase: string
  extensions: string[]
  ignore: string[]
  groupLabel: string
  resolveText?: ResolveText
  resolveLink?: ResolveLink
}

function resolveOptions(option: Option): ResolvedOption {
  const sourceDir = toPosixPath(option.sourceDir ?? option.baseurl ?? "./blog")
  const routeBaseInput =
    option.routeBase ??
    (option.baseurl && !path.isAbsolute(option.baseurl) ? option.baseurl : undefined) ??
    (!path.isAbsolute(sourceDir) ? sourceDir : "")
  const routeBase = normalizeRouteBase(routeBaseInput)

  return {
    sourceDir,
    routeBase,
    extensions: normalizeExtensions(option.extensions),
    ignore: option.ignore ?? [],
    groupLabel: option.groupLabel ?? "other",
    resolveText: option.resolveText,
    resolveLink: option.resolveLink,
  }
}

function getFiles(
  dir: string,
  settings: ResolvedOption,
  level = 1,
  filesMap: Record<string, FileInfo> = {},
): FileInfo[] {
  const normalizedDir = toPosixPath(dir)
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))

  const result: FileInfo[] = []

  for (const entry of entries) {
    if (shouldIgnoreEntry(entry.name, settings.ignore)) {
      continue
    }

    const filePath = toPosixPath(path.join(dir, entry.name))
    const relativePath = toPosixPath(path.relative(settings.sourceDir, filePath))

    if (entry.isDirectory()) {
      const fileObj: FileInfo = {
        name: entry.name,
        path: filePath,
        relativePath,
        routePath: createDirectoryRoute(settings.routeBase, relativePath),
        isDirectory: true,
        level,
        parentPath: normalizedDir,
      }

      filesMap[filePath] = fileObj
      result.push(fileObj, ...getFiles(filePath, settings, level + 1, filesMap))
      continue
    }

    if (!entry.isFile() || !isContentFile(entry.name, settings.extensions)) {
      continue
    }

    const fileObj: FileInfo = {
      name: formatFileName(entry.name, settings.extensions),
      path: filePath,
      relativePath,
      routePath: createFileRoute(settings.routeBase, relativePath, settings.extensions),
      level,
      isDirectory: false,
      parentPath: normalizedDir,
    }

    if (settings.resolveText) {
      fileObj.name = settings.resolveText(fileObj)
    }

    if (settings.resolveLink) {
      fileObj.routePath = settings.resolveLink(fileObj)
    }

    filesMap[filePath] = fileObj
    result.push(fileObj)
  }

  return result
}

function isNestedUnder(filePath: string, parentDirPath: string): boolean {
  return filePath.startsWith(`${parentDirPath}/`)
}

function sortFiles(left: FileInfo, right: FileInfo): number {
  return left.level - right.level || left.path.localeCompare(right.path)
}

function createSidebarGroups(
  rootDir: FileInfo,
  files: FileInfo[],
  groupLabel: string,
): DefaultTheme.SidebarItem[] {
  const directChildren = files.filter((file) => file.parentPath === rootDir.path)
  const sidebarGroups: DefaultTheme.SidebarItem[] = []

  const rootMarkdownFiles = directChildren
    .filter((file) => !file.isDirectory)
    .map((file) => formatFileInfos(file))

  if (rootMarkdownFiles.length > 0) {
    sidebarGroups.push({
      text: groupLabel,
      items: rootMarkdownFiles,
    })
  }

  const childDirectories = directChildren.filter((file) => file.isDirectory)

  for (const childDirectory of childDirectories) {
    const items = files
      .filter((file) => !file.isDirectory && isNestedUnder(file.path, childDirectory.path))
      .sort(sortFiles)
      .map((file) => formatFileInfos(file))

    if (items.length === 0) {
      continue
    }

    sidebarGroups.push({
      text: childDirectory.name,
      items,
    })
  }

  return sidebarGroups
}

export default function genNav(option: Option = { sourceDir: "./blog" }): {
  nav: DefaultTheme.NavItem[]
  sidebar: DefaultTheme.Sidebar
} {
  const settings = resolveOptions(option)
  const filesMap: Record<string, FileInfo> = {}
  const files = getFiles(settings.sourceDir, settings, 1, filesMap)
  const nav: DefaultTheme.NavItem[] = []
  const sidebar: DefaultTheme.Sidebar = {}

  const rootDirs = files.filter((file) => file.isDirectory && file.parentPath === settings.sourceDir)

  for (const dir of rootDirs) {
    const sidebarItems = createSidebarGroups(dir, files, settings.groupLabel)

    if (sidebarItems.length === 0) {
      continue
    }

    sidebar[dir.routePath] = sidebarItems
    nav.push({
      text: filesMap[dir.path].name,
      items: sidebarItems.reduce<DefaultTheme.NavItemWithLink[]>((items, group) => {
        const first = group.items?.[0]

        if (!first) {
          return items
        }

        items.push({
          text: group.text === settings.groupLabel ? first.text : group.text,
          link: first.link,
        })
        return items
      }, []),
    })
  }

  return {
    nav,
    sidebar,
  }
}
