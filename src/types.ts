export type FileInfo = {
  name: string
  path: string
  level: number
  isDirectory: boolean
  parentPath: string
  items?: FileInfo[]
}

export type Option = {
  baseurl?: string
}
