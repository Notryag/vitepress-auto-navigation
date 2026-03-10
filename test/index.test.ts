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

function toFixturePath(rootDir: string, relativePath: string): string {
  return path.join(rootDir, relativePath).replace(/\\/g, '/')
}

describe('genNav', () => {
  it('generates nav and sidebar from first-level directories', () => {
    const rootDir = createFixture({
      'intro.md': '# ignored at root',
      'guide/getting-started.md': '# getting started',
      'guide/config/basic.md': '# basic',
      'guide/config/advanced/deep-dive.md': '# deep dive',
      'api/reference.md': '# reference',
    })

    const { nav, sidebar } = genNav({ baseurl: rootDir })

    expect(nav).toEqual([
      {
        text: 'api',
        items: [
          {
            text: 'reference',
            link: toFixturePath(rootDir, 'api/reference.md'),
          },
        ],
      },
      {
        text: 'guide',
        items: [
          {
            text: 'getting-started',
            link: toFixturePath(rootDir, 'guide/getting-started.md'),
          },
          {
            text: 'config',
            link: toFixturePath(rootDir, 'guide/config/basic.md'),
          },
        ],
      },
    ])

    expect(sidebar).toEqual({
      [toFixturePath(rootDir, 'api')]: [
        {
          text: 'other',
          items: [
            {
              text: 'reference',
              link: toFixturePath(rootDir, 'api/reference.md'),
            },
          ],
        },
      ],
      [toFixturePath(rootDir, 'guide')]: [
        {
          text: 'other',
          items: [
            {
              text: 'getting-started',
              link: toFixturePath(rootDir, 'guide/getting-started.md'),
            },
          ],
        },
        {
          text: 'config',
          items: [
            {
              text: 'basic',
              link: toFixturePath(rootDir, 'guide/config/basic.md'),
            },
            {
              text: 'deep-dive',
              link: toFixturePath(rootDir, 'guide/config/advanced/deep-dive.md'),
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

    const { nav, sidebar } = genNav({ baseurl: rootDir })

    expect(nav).toEqual([
      {
        text: 'guide',
        items: [
          {
            text: 'api',
            link: toFixturePath(rootDir, 'guide/api/overview.md'),
          },
          {
            text: 'api-client',
            link: toFixturePath(rootDir, 'guide/api-client/setup.md'),
          },
        ],
      },
    ])

    expect(sidebar).toEqual({
      [toFixturePath(rootDir, 'guide')]: [
        {
          text: 'api',
          items: [
            {
              text: 'overview',
              link: toFixturePath(rootDir, 'guide/api/overview.md'),
            },
          ],
        },
        {
          text: 'api-client',
          items: [
            {
              text: 'setup',
              link: toFixturePath(rootDir, 'guide/api-client/setup.md'),
            },
            {
              text: 'troubleshooting',
              link: toFixturePath(rootDir, 'guide/api-client/nested/troubleshooting.md'),
            },
          ],
        },
      ],
    })
  })

  it('skips empty directories that have no markdown descendants', () => {
    const rootDir = createFixture({
      'guide/filled/page.md': '# page',
      'guide/empty/.gitkeep': '',
      'empty-root/assets/image.png': 'png',
    })

    const { nav, sidebar } = genNav({ baseurl: rootDir })

    expect(nav).toEqual([
      {
        text: 'guide',
        items: [
          {
            text: 'filled',
            link: toFixturePath(rootDir, 'guide/filled/page.md'),
          },
        ],
      },
    ])

    expect(sidebar).toEqual({
      [toFixturePath(rootDir, 'guide')]: [
        {
          text: 'filled',
          items: [
            {
              text: 'page',
              link: toFixturePath(rootDir, 'guide/filled/page.md'),
            },
          ],
        },
      ],
    })
  })
})
