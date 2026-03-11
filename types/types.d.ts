export type FileInfo = {
    name: string;
    path: string;
    relativePath: string;
    routePath: string;
    level: number;
    isDirectory: boolean;
    parentPath: string;
};
export type ResolveText = (file: FileInfo) => string;
export type ResolveLink = (file: FileInfo) => string;
export type Option = {
    sourceDir?: string;
    baseurl?: string;
    routeBase?: string;
    extensions?: string[];
    ignore?: string[];
    groupLabel?: string;
    resolveText?: ResolveText;
    resolveLink?: ResolveLink;
};
