import * as path from "path"

/**
 * 格式化文件信息，返回文件名和路径
 * @param {object} fileInfos 文件信息对象
 * @returns {object} 格式化后的文件对象
 */
export const formatFileInfos = (fileInfos: { name: string; path: string }): { text: string; link: string } => ({
  text: formatFileName(fileInfos.name),
  link: path.normalize(fileInfos.path).replace(/\\/g, "/"),
})

/**
 * 格式化文件名，去掉后缀名
 * @param {string} fileName 文件名
 * @returns {string} 格式化后的文件名
 */
export const formatFileName = (fileName: string): string => fileName.replace(/\.[^/.]+$/, "")

/**
 * 判断文件是否为Markdown文件
 * @param {string} fileName 文件名
 * @returns {boolean} 是否为Markdown文件
 */
export const isMarkDown = (fileName: string): boolean => fileName.endsWith(".md")
