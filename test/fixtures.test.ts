/// <reference types="vite/client" />

import process from 'node:process'
import { describe, expect, it } from 'vitest'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import cssBase from '../styles/github-base.css?raw'
import cssColorsLight from '../styles/github-colors-light.css?raw'
import cssColorsDark from '../styles/github-colors-dark-media.css?raw'
import remarkGitHubAlerts from '../src'

const CSS = `
* { box-sizing: border-box; }
html { font-family: sans-serif; }

${cssColorsLight}
${cssColorsDark}
${cssBase}
`

describe('fixtures', () => {
  const files = import.meta.glob('./input/*.md', { as: 'raw', eager: true })
  const filter = process.env.FILTER
  Object.entries(files)
    .forEach(([path, content]) => {
      const run = !filter || path.includes(filter)
        ? it
        : it.skip

      run(`render ${path}`, async () => {
        const html = await unified()
          .use(remarkParse)
          .use(remarkGitHubAlerts)
          .use(remarkHtml, { sanitize: false })
          .process(content)

        const rendered = [html, `<style>${CSS}</style>`].join('\n').trim().replace(/\r\n/g, '\n')

        expect(rendered)
          .toMatchFileSnapshot(path.replace('input', 'output').replace('.md', '.html'))
      })
    })
})
