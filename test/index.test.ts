import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import genNav from '../src/index'
import { afterEach, describe, expect, it } from 'vitest'

const tempDirs: string[] = []

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true })
    }
  }
})

function createFixture(structure: Record<string, string>): string {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vitepress-auto-navigation-'))
  tempDirs.push(rootDir)

  for (const [relativePath, content] of Object.entries(structure)) {
    const filePath = path.join(rootDir, relativePath)
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, content)
  }

  return rootDir
}

describe('genNav', () => {
  it('generates nav and sidebar from first-level directories using routeBase', () => {
    const rootDir = createFixture({
      'intro.md': '# ignored at root',
      'guide/getting-started.md': '# getting started',
      'guide/config/basic.md': '# basic',
      'guide/config/advanced/deep-dive.md': '# deep dive',
      'api/reference.md': '# reference',
    })

    const { nav, sidebar } = genNav({ sourceDir: rootDir, routeBase: '/docs' })

    expect(nav).toEqual([
      {
        text: 'api',
        items: [
          {
            text: 'reference',
            link: '/docs/api/reference',
          },
        ],
      },
      {
        text: 'guide',
        items: [
          {
            text: 'getting-started',
            link: '/docs/guide/getting-started',
          },
          {
            text: 'config',
            link: '/docs/guide/config/basic',
          },
        ],
      },
    ])

    expect(sidebar).toEqual({
      '/docs/api/': [
        {
          text: 'other',
          items: [
            {
              text: 'reference',
              link: '/docs/api/reference',
            },
          ],
        },
      ],
      '/docs/guide/': [
        {
          text: 'other',
          items: [
            {
              text: 'getting-started',
              link: '/docs/guide/getting-started',
            },
          ],
        },
        {
          text: 'config',
          items: [
            {
              text: 'basic',
              link: '/docs/guide/config/basic',
            },
            {
              text: 'deep-dive',
              link: '/docs/guide/config/advanced/deep-dive',
            },
          ],
        },
      ],
    })
  })

  it('defaults to root-based routes when sourceDir is absolute', () => {
    const rootDir = createFixture({
      'guide/api/overview.md': '# api overview',
      'guide/api-client/setup.md': '# api client setup',
    })

    const { nav, sidebar } = genNav({ sourceDir: rootDir })

    expect(nav).toEqual([
      {
        text: 'guide',
        items: [
          {
            text: 'api',
            link: '/guide/api/overview',
          },
          {
            text: 'api-client',
            link: '/guide/api-client/setup',
          },
        ],
      },
    ])

    expect(sidebar).toEqual({
      '/guide/': [
        {
          text: 'api',
          items: [
            {
              text: 'overview',
              link: '/guide/api/overview',
            },
          ],
        },
        {
          text: 'api-client',
          items: [
            {
              text: 'setup',
              link: '/guide/api-client/setup',
            },
          ],
        },
      ],
    })
  })

  it('separates similarly named directories by real parent path', () => {
    const rootDir = createFixture({
      'guide/api/overview.md': '# api overview',
      'guide/api-client/setup.md': '# api client setup',
      'guide/api-client/nested/troubleshooting.md': '# troubleshooting',
    })

    const { nav, sidebar } = genNav({ sourceDir: rootDir, routeBase: '/docs' })

    expect(nav).toEqual([
      {
        text: 'guide',
        items: [
          {
            text: 'api',
            link: '/docs/guide/api/overview',
          },
          {
            text: 'api-client',
            link: '/docs/guide/api-client/setup',
          },
        ],
      },
    ])

    expect(sidebar).toEqual({
      '/docs/guide/': [
        {
          text: 'api',
          items: [
            {
              text: 'overview',
              link: '/docs/guide/api/overview',
            },
          ],
        },
        {
          text: 'api-client',
          items: [
            {
              text: 'setup',
              link: '/docs/guide/api-client/setup',
            },
            {
              text: 'troubleshooting',
              link: '/docs/guide/api-client/nested/troubleshooting',
            },
          ],
        },
      ],
    })
  })

  it('skips ignored directories and maps README files to section roots', () => {
    const rootDir = createFixture({
      'guide/README.md': '# guide home',
      'guide/filled/page.md': '# page',
      'guide/node_modules/ignored.md': '# ignored',
      'empty-root/assets/image.png': 'png',
    })

    const { nav, sidebar } = genNav({
      sourceDir: rootDir,
      routeBase: '/docs',
      groupLabel: 'overview',
    })

    expect(nav).toEqual([
      {
        text: 'guide',
        items: [
          {
            text: 'README',
            link: '/docs/guide/',
          },
          {
            text: 'filled',
            link: '/docs/guide/filled/page',
          },
        ],
      },
    ])

    expect(sidebar).toEqual({
      '/docs/guide/': [
        {
          text: 'overview',
          items: [
            {
              text: 'README',
              link: '/docs/guide/',
            },
          ],
        },
        {
          text: 'filled',
          items: [
            {
              text: 'page',
              link: '/docs/guide/filled/page',
            },
          ],
        },
      ],
    })
  })

  it('supports custom text and links for non-markdown assets', () => {
    const rootDir = createFixture({
      'guide/intro.md': '# intro',
      'guide/snippets/demo.js': 'console.log("demo")',
      'guide/snippets/helper.ts': 'export const helper = true',
    })

    const { nav, sidebar } = genNav({
      sourceDir: rootDir,
      routeBase: '/docs',
      extensions: ['.md', '.js', '.ts'],
      resolveText: (file) => {
        if (file.relativePath.endsWith('.js') || file.relativePath.endsWith('.ts')) {
          return `code:${file.name}`
        }

        return file.name
      },
      resolveLink: (file) => {
        if (file.relativePath.endsWith('.js') || file.relativePath.endsWith('.ts')) {
          return `/snippets/${file.relativePath.replace(/\.(js|ts)$/, '')}`
        }

        return file.routePath
      },
    })

    expect(nav).toEqual([
      {
        text: 'guide',
        items: [
          {
            text: 'intro',
            link: '/docs/guide/intro',
          },
          {
            text: 'snippets',
            link: '/snippets/guide/snippets/demo',
          },
        ],
      },
    ])

    expect(sidebar).toEqual({
      '/docs/guide/': [
        {
          text: 'other',
          items: [
            {
              text: 'intro',
              link: '/docs/guide/intro',
            },
          ],
        },
        {
          text: 'snippets',
          items: [
            {
              text: 'code:demo',
              link: '/snippets/guide/snippets/demo',
            },
            {
              text: 'code:helper',
              link: '/snippets/guide/snippets/helper',
            },
          ],
        },
      ],
    })
  })
})
