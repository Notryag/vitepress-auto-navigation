import * as fs from 'fs'
import * as path from 'path'
import { formatFileInfos, formatFileName, isMarkDown } from './utils'
import type { DefaultTheme } from 'vitepress/types/default-theme'
import type { FileInfo, Option } from './types'

function toPosixPath(filePath: string): string {
  return filePath.replace(/\\/g, '/')
}

/**
 * 获取指定目录下的所有文件和子目录
 * @param dir 目录路径
 * @param level 目录层级
 * @param filesMap 文件和子目录数组
 * @returns 文件和子目录数组
 */
function getFiles(dir: string, level = 1, filesMap: Record<string, FileInfo> = {}): FileInfo[] {
  const normalizedDir = toPosixPath(dir)
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))

  const result: FileInfo[] = []

  for (const entry of entries) {
    const filePath = toPosixPath(path.join(dir, entry.name))

    if (entry.isDirectory()) {
      const fileObj: FileInfo = {
        name: entry.name,
        path: filePath,
        isDirectory: true,
        level,
        parentPath: normalizedDir,
      }

      filesMap[filePath] = fileObj
      result.push(fileObj, ...getFiles(filePath, level + 1, filesMap))
      continue
    }

    if (!entry.isFile() || !isMarkDown(entry.name)) {
      continue
    }

    const fileObj: FileInfo = {
      name: formatFileName(entry.name),
      path: filePath,
      level,
      isDirectory: false,
      parentPath: normalizedDir,
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

function createSidebarGroups(rootDir: FileInfo, files: FileInfo[]): DefaultTheme.SidebarItem[] {
  const directChildren = files.filter((file) => file.parentPath === rootDir.path)
  const sidebarGroups: DefaultTheme.SidebarItem[] = []

  const rootMarkdownFiles = directChildren
    .filter((file) => !file.isDirectory)
    .map((file) => formatFileInfos(file))

  if (rootMarkdownFiles.length > 0) {
    sidebarGroups.push({
      text: 'other',
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

export default function genNav(option: Option = { baseurl: './blog' }): {
  nav: DefaultTheme.NavItem[]
  sidebar: DefaultTheme.Sidebar
} {
  const baseurl = toPosixPath(option.baseurl ?? './blog')
  const filesMap: Record<string, FileInfo> = {}
  const files = getFiles(baseurl, 1, filesMap)
  const nav: DefaultTheme.NavItem[] = []
  const sidebar: DefaultTheme.Sidebar = {}

  const rootDirs = files.filter((file) => file.isDirectory && file.parentPath === baseurl)

  for (const dir of rootDirs) {
    const sidebarItems = createSidebarGroups(dir, files)

    if (sidebarItems.length === 0) {
      continue
    }

    sidebar[dir.path] = sidebarItems
    nav.push({
      text: filesMap[dir.path].name,
      items: sidebarItems.reduce<DefaultTheme.NavItemWithLink[]>((items, group) => {
        const first = group.items?.[0]

        if (!first) {
          return items
        }

        items.push({
          text: group.text === 'other' ? first.text : group.text,
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
