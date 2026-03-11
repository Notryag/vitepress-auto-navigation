import type { FileInfo } from "./types";
export declare function toPosixPath(filePath: string): string;
export declare function normalizeRouteBase(routeBase: string): string;
export declare function normalizeExtensions(extensions?: string[]): string[];
export declare function normalizeIgnore(ignore?: string[]): string[];
export declare function stripKnownExtension(fileName: string, extensions: string[]): string;
export declare function createDirectoryRoute(routeBase: string, relativePath: string): string;
export declare function createFileRoute(routeBase: string, relativePath: string, extensions: string[]): string;
export declare const formatFileInfos: (fileInfos: Pick<FileInfo, "name" | "routePath">) => {
    text: string;
    link: string;
};
export declare const formatFileName: (fileName: string, extensions?: string[]) => string;
export declare const isContentFile: (fileName: string, extensions?: string[]) => boolean;
export declare const shouldIgnoreEntry: (entryName: string, ignore?: string[]) => boolean;
