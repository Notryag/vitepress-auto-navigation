import * as path from "node:path"
import type { FileInfo } from "./types"

const DEFAULT_EXTENSIONS = [".md"]
const DEFAULT_IGNORES = [
  ".git",
  ".github",
  ".vitepress",
  "node_modules",
  "dist",
  "build",
]

export function toPosixPath(filePath: string): string {
  return filePath.replace(/\\/g, "/")
}

export function normalizeRouteBase(routeBase: string): string {
  const normalized = toPosixPath(routeBase).trim().replace(/\/+$/, "")

  if (normalized === "" || normalized === ".") {
    return ""
  }

  if (normalized.startsWith("./")) {
    return normalizeRouteBase(normalized.slice(2))
  }

  if (normalized.startsWith("/")) {
    return normalized
  }

  return `/${normalized}`
}

export function normalizeExtensions(extensions: string[] = DEFAULT_EXTENSIONS): string[] {
  return [...new Set(extensions.map((extension) => {
    const normalized = extension.toLowerCase()
    return normalized.startsWith(".") ? normalized : `.${normalized}`
  }))]
}

export function normalizeIgnore(ignore: string[] = []): string[] {
  return [...new Set([...DEFAULT_IGNORES, ...ignore])]
}

export function stripKnownExtension(fileName: string, extensions: string[]): string {
  const lowerCaseFileName = fileName.toLowerCase()
  const matchedExtension = extensions.find((extension) =>
    lowerCaseFileName.endsWith(extension),
  )

  if (!matchedExtension) {
    return fileName
  }

  return fileName.slice(0, -matchedExtension.length)
}

export function createDirectoryRoute(routeBase: string, relativePath: string): string {
  const normalizedRelativePath = toPosixPath(relativePath)
  const joined = path.posix.join("/", routeBase, normalizedRelativePath)
  return joined.endsWith("/") ? joined : `${joined}/`
}

export function createFileRoute(
  routeBase: string,
  relativePath: string,
  extensions: string[],
): string {
  const normalizedRelativePath = toPosixPath(relativePath)
  const extensionlessPath = stripKnownExtension(normalizedRelativePath, extensions)
  const fileName = path.posix.basename(extensionlessPath).toLowerCase()
  const parentPath = path.posix.dirname(extensionlessPath)

  if (fileName === "readme" || fileName === "index") {
    return createDirectoryRoute(routeBase, parentPath === "." ? "" : parentPath)
  }

  return path.posix.join("/", routeBase, extensionlessPath)
}

export const formatFileInfos = (fileInfos: Pick<FileInfo, "name" | "routePath">): { text: string; link: string } => ({
  text: fileInfos.name,
  link: fileInfos.routePath,
})

export const formatFileName = (
  fileName: string,
  extensions: string[] = DEFAULT_EXTENSIONS,
): string => stripKnownExtension(fileName, normalizeExtensions(extensions))

export const isContentFile = (
  fileName: string,
  extensions: string[] = DEFAULT_EXTENSIONS,
): boolean => {
  const normalizedExtensions = normalizeExtensions(extensions)
  const lowerCaseFileName = fileName.toLowerCase()
  return normalizedExtensions.some((extension) => lowerCaseFileName.endsWith(extension))
}

export const shouldIgnoreEntry = (entryName: string, ignore: string[] = []): boolean =>
  entryName.startsWith(".") || normalizeIgnore(ignore).includes(entryName)
