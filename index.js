import gfmAutolinkLiteralFromMarkdown from 'mdast-util-gfm-autolink-literal/from-markdown.js'
import gfmAutolinkLiteralToMarkdown from 'mdast-util-gfm-autolink-literal/to-markdown.js'
import gfmStrikethroughFromMarkdown from 'mdast-util-gfm-strikethrough/from-markdown.js'
import gfmStrikethroughToMarkdown from 'mdast-util-gfm-strikethrough/to-markdown.js'
import gfmTableFromMarkdown from 'mdast-util-gfm-table/from-markdown.js'
import gfmTableToMarkdown from 'mdast-util-gfm-table/to-markdown.js'
import gfmTaskListItemFromMarkdown from 'mdast-util-gfm-task-list-item/from-markdown.js'
import gfmTaskListItemToMarkdown from 'mdast-util-gfm-task-list-item/to-markdown.js'

const own = {}.hasOwnProperty

export const gfmFromMarkdown = configure([
  gfmAutolinkLiteralFromMarkdown,
  gfmStrikethroughFromMarkdown,
  gfmTableFromMarkdown,
  gfmTaskListItemFromMarkdown
])

export function gfmToMarkdown(options) {
  return {
    extensions: [
      gfmAutolinkLiteralToMarkdown,
      gfmStrikethroughToMarkdown,
      gfmTableToMarkdown(options),
      gfmTaskListItemToMarkdown
    ]
  }
}

function configure(extensions) {
  const config = {transforms: [], canContainEols: []}
  const length = extensions.length
  let index = -1

  while (++index < length) {
    extension(config, extensions[index])
  }

  return config
}

function extension(config, extension) {
  let key
  let left
  let right

  for (key in extension) {
    if (own.call(extension, key)) {
      left = own.call(config, key) ? config[key] : (config[key] = {})
      right = extension[key]

      if (key === 'canContainEols' || key === 'transforms') {
        config[key] = [].concat(left, right)
      } else {
        Object.assign(left, right)
      }
    }
  }
}
