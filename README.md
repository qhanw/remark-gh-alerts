# remark-gh-alerts

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Fork from [markdown-it-github-alerts](https://github.com/markdown-it/markdown-it)

Support [GitHub-style alerts](https://github.com/orgs/community/discussions/16925) for [remark](https://github.com/remarkjs/remark).

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

```
> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.
```

## Usage

```bash
npm i remark-gh-alerts
```

```js
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGhAlerts from 'remark-gh-alerts'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(remarkParse)
  .use(remarkGhAlerts)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(await fs.readFile('./input.md'))
```

For the options available, please refer to [the jsdoc](./src/index.ts).

## Functionality

This plugin transforms the following markdown:

```markdown
> [!NOTE]
> Highlights information that users should take into account, even when skimming.
```

to the following HTML:

```html
<div class="markdown-alert markdown-alert-note">
  <p class="markdown-alert-title" dir="auto"><span style="--mga-icon: url([data uri])"></span>Note</p><p>
  Highlights information that users should take into account, even when skimming.</p>
</div>
```

[data uri] 为对svg图片进行处理后的，可供css使用的图片数据

Which is different with the GitHub's output.

### Styling

You can write your custom styles for your alerts.

We also provide some CSS extracted from GitHub's styles for you to use.

```js
import 'remark-gh-alerts/styles/github-colors-light.css'
import 'remark-gh-alerts/styles/github-colors-dark-media.css'
import 'remark-gh-alerts/styles/github-base.css'
```

You might change `github-colors-dark-media.css` to `github-colors-dark-class.css` if you are using class-based (`.dark`) dark mode.

Refer to the [source code](./styles) for more details.

## License

[MIT](./LICENSE) License © 2023-PRESENT [Qhan W](https://github.com/qhanw)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/remark-gh-alerts?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/remark-gh-alerts
[npm-downloads-src]: https://img.shields.io/npm/dm/remark-gh-alerts?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/remark-gh-alerts
[bundle-src]: https://img.shields.io/bundlephobia/minzip/remark-gh-alerts?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=remark-gh-alerts
[license-src]: https://img.shields.io/github/license/qhanw/remark-gh-alerts.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/qhanw/remark-gh-alerts/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/remark-gh-alerts
