export type FileInfo = {
  name: string
  path: string
  level: number
  isDirectory: boolean
  parentPath: string
  items?: []
}

export type Option = {
  baseurl?: string
}