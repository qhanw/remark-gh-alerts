import { visit } from 'unist-util-visit'

import type { Paragraph, Root } from 'mdast'
import type { Plugin } from 'unified'

import { encodeSvg } from './encodeSvg'
import { DEFAULT_GITHUB_ICONS } from './icons'

export interface RemarkGitHubAlertsOptions {
  /**
   * List of markers to match.
   * @default ['TIP', 'NOTE', 'IMPORTANT', 'WARNING', 'CAUTION']
   */
  markers?: string[] | '*'

  /**
   * If markers case sensitively on matching.
   * @default true
   */
  matchCaseSensitive?: boolean

  /**
   * Custom icons for each marker. The key is the marker name, and the value is the html script represent the icon.
   * The key is always lowercase.
   *
   * @default inline svg icons from GitHub
   */
  icons?: Record<string, string>

  /**
   * Custom titles for each marker. The key is the marker name, and the value is the title.
   * The key is always lowercase.
   *
   * When the title is not specified, the default title is the capitalized marker name.
   */
  titles?: Record<string, string>

  /**
   * Prefix for the class names.
   *
   * @default 'markdown-alert'
   */
  classPrefix?: string

  // ^ options from MarkdownItGitHubAlertsOptions

  /**
   * Whether to ignore the square brackets in the marker.
   *
   * @default false
   */
  ignoreSquareBracket?: boolean
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const remarkGithubAlerts: Plugin<RemarkGitHubAlertsOptions[], Root> = (
  options = {},
) => {
  const {
    markers = ['TIP', 'NOTE', 'IMPORTANT', 'WARNING', 'CAUTION'],
    icons = DEFAULT_GITHUB_ICONS,
    matchCaseSensitive = true,
    titles = {},
    classPrefix = 'markdown-alert',
    ignoreSquareBracket = false,
  } = options

  const markerNameRE = markers === '*' ? '\\w+' : markers.join('|')
  const RE = new RegExp(
    ignoreSquareBracket
      ? `^!(${markerNameRE})\\s?`
      : `^\\[\\!(${markerNameRE})\\]\\s`,
    matchCaseSensitive ? '' : 'i',
  )

  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      const children = node.children as Paragraph[]
      const firstParagraph = children[0]
      if (!firstParagraph)
        return
      let firstContent = firstParagraph.children[0]
      if (!firstContent)
        return
      if (
        !('value' in firstContent)
        && 'children' in firstContent
        && firstContent.children[0]
      )
        firstContent = firstContent.children[0]

      if (firstContent.type !== 'text')
        return
      const match = firstContent.value.match(RE)
      if (!match)
        return

      const type = match[1]?.toLowerCase() as keyof typeof icons
      const title = match[2]?.trim() || (titles[type] ?? capitalize(type))

      const iconDataUri = `data:image/svg+xml;utf8,${encodeSvg(icons[type])}`

      if (index === undefined || !parent)
        return

      firstContent.value = firstContent.value.slice(match[0].length).trimStart()

      node.data = {
        hName: 'blockquote',
        hProperties: {
          class: `${classPrefix} ${classPrefix}-${type}`,
        },
      }

      node.children = [
        {
          type: 'paragraph',
          data: {
            hName: 'p',
            hProperties: {
              class: `${classPrefix}-title`,
            },
          },
          children: [
            {
              type: 'span' as any,
              data: {
                hName: 'span',
                hProperties: {
                  class: `octicon octicon-${type}`,
                  style: `--oct-icon: url("${iconDataUri}")`,
                },
              },
              // 替换为 CSS 方式以兼容 mdx， 不用再安装额外的 rehype-raw 插件
              // value: icon
            },
            { type: 'text', value: title },
          ],
        },
        ...node.children,
      ]
    })

    return tree
  }
}

export default remarkGithubAlerts
