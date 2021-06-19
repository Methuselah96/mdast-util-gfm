import fs from 'fs'
import path from 'path'
import test from 'tape'
import Slugger from 'github-slugger'
import {toHast} from 'mdast-util-to-hast'
import {toHtml} from 'hast-util-to-html'
import fromMarkdown from 'mdast-util-from-markdown'
import toMarkdown from 'mdast-util-to-markdown'
import gfm from 'micromark-extension-gfm'
import {gfmFromMarkdown, gfmToMarkdown} from '../index.js'

const spec = JSON.parse(fs.readFileSync(path.join('test', 'spec.json')))

test('markdown -> mdast', function (t) {
  const files = spec.filter(
    (example) => !/disallowed raw html/i.test(example.category)
  )
  let index = -1

  while (++index < files.length) {
    const example = files[index]
    var category = Slugger.slug(example.category)
    var name = index + '-' + category
    var fixtureHtmlPath = path.join('test', name + '.html')
    var fixtureMarkdownPath = path.join('test', name + '.md')
    var fixtureHtml
    var fixtureMarkdown
    var mdast
    var html
    var md

    mdast = fromMarkdown(example.input, {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown]
    })

    html = toHtml(toHast(mdast, {allowDangerousHtml: true, commonmark: true}), {
      allowDangerousHtml: true,
      entities: {useNamedReferences: true},
      closeSelfClosing: true
    })

    try {
      fixtureHtml = String(fs.readFileSync(fixtureHtmlPath))
    } catch (_) {
      fixtureHtml = example.output.slice(0, -1)
    }

    md = toMarkdown(mdast, {extensions: [gfmToMarkdown()]})

    try {
      fixtureMarkdown = String(fs.readFileSync(fixtureMarkdownPath))
    } catch (_) {
      fixtureMarkdown = md
      fs.writeFileSync(fixtureMarkdownPath, fixtureMarkdown)
    }

    t.deepEqual(html, fixtureHtml, category + ' (' + index + ') -> html')
    t.equal(md, fixtureMarkdown, category + ' (' + index + ') -> md')
  }

  t.end()
})
