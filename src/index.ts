import * as fs from 'fs'
import * as path from 'path'
import { formatFileInfos, isMarkDown, formatFileName } from './utils'
import type { DefaultTheme } from 'vitepress/types/default-theme'
import type { FileInfo, Option } from '../types/custom'

/**
 * 获取指定目录下的所有文件和子目录
 * @param {string} dir 目录路径
 * @param {number} level 目录层级
 * @returns {Array} 文件和子目录数组
 */
function getFiles(dir: string, level = 1, filesMap: { [key: string]: any } = {}): FileInfo[] {
  const files = fs.readdirSync(dir)
  const result = [] as FileInfo[]
  files.forEach((file) => {
    const filePath = path.join(dir, file).toString().replace(/\\/g, '/')
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      // 递归读取子目录
      let fileObj = {
        name: file,
        path: filePath,
        isDirectory: true,
        level,
        parentPath: dir,
      }
      const subFiles = getFiles(filePath, level + 1, filesMap)
      result.push(fileObj, ...subFiles)
      filesMap[filePath] = fileObj
    } else if (isMarkDown(file)) {
      // 存储文件名和路径
      let fileObj = {
        name: formatFileName(file),
        path: filePath,
        level,
        isDirectory: false,
        parentPath: dir,
      }
      result.push(fileObj)
      filesMap[filePath] = fileObj
    }
  })

  return result.sort((a, b) => a.level - b.level || (b.isDirectory ? 1 : -1));
}

const addSidebarItem = (sidebarMap: { [key: string]: any }, dir: { path: string }, file: { name: string; path: string; isDirectory: boolean }) => {
  if (!sidebarMap[dir.path]) {
    sidebarMap[dir.path] = [
      {
        text: 'other',
        items: [],
      },
    ]
  }
  if (file.isDirectory) {
    sidebarMap[dir.path].push({
      text: file.name,
      items: [],
    })
  } else {
    sidebarMap[dir.path][0].items.push({
      text: file.name,
      link: formatFileInfos(file).link,
    })
  }
}

export default function genNav(option: Option = { baseurl: './blog' }): {
  nav: DefaultTheme.NavItem[]
  sidebar: DefaultTheme.Sidebar
} {
  let filesMap: { [key: string]: FileInfo } = {}
  const files = getFiles(option.baseurl, 1, filesMap)

  let nav: DefaultTheme.NavItem[] = []
  const sidebarMap: DefaultTheme.Sidebar = {}
  const sidebar: DefaultTheme.Sidebar = {}
  const rootDirs = files.filter((file: FileInfo) => file.isDirectory && file.level == 1)

  for (const dir of rootDirs) {
    dir.items = []
    for (const file of files) {
      if (file.parentPath === dir.path) {
        addSidebarItem(sidebarMap, dir, file)
      }
    }
  }


  for (const key of Object.keys(sidebarMap)) {
    const val = sidebarMap[key]
    for (const file of files) {
      if (file.path.includes(key) && !file.isDirectory) {
        const index = val.findIndex((item) => file.path.includes(item.text))
        if (index === -1) continue
        val[index].items.push(formatFileInfos(file))
      }
    }
  }

  for (const [key, value] of Object.entries(sidebarMap)) {
    const sidebarItem = value.filter((item) => item.items.length > 0)
    if(sidebarItem.length === 0) continue
    sidebar[key] = sidebarItem
    nav.push({
      text: filesMap[key].name,
      items: value.reduce<DefaultTheme.NavItemWithLink[]>((pre, cur) => {
        let first = cur.items[0]
        if (!first) return pre
        pre.push({ text: cur.text === 'other' ? first.text : cur.text, link: first.link })
        return pre
      }, []),
    })
  }

  return {
    nav,
    sidebar,
  }
}
