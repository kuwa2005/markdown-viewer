// Compiler setup for Node.js testing
// Wraps browser-extension compiler adapters for Node.js usage

import markdownit from 'markdown-it';
import markdownitAnchor from 'markdown-it-anchor';
import markdownitAbbr from 'markdown-it-abbr';
import markdownitAttrs from 'markdown-it-attrs';
import markdownitCjk from 'markdown-it-cjk-breaks';
import markdownitDeflist from 'markdown-it-deflist';
import markdownitFootnote from 'markdown-it-footnote';
import markdownitIns from 'markdown-it-ins';
import markdownitMark from 'markdown-it-mark';
import markdownitSub from 'markdown-it-sub';
import markdownitSup from 'markdown-it-sup';
import markdownitTasklists from 'markdown-it-task-lists';
import { marked, Marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import markedLinkifyIt from 'marked-linkify-it';
import { remark } from 'remark';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import remarkSlug from 'remark-slug';
import * as commonmark from 'commonmark';
import { Remarkable } from 'remarkable';
import showdown from 'showdown';
import remarkParse from 'remark-parse';

// markdown-it compiler adapter
export function createMarkdownItCompiler(state = {}) {
  const defaults = {
    breaks: false,
    html: true,
    linkify: true,
    typographer: false,
    xhtmlOut: false,
    langPrefix: 'language-',
    quotes: '\u201c\u201d\u2018\u2019',
    abbr: false,
    attrs: false,
    cjk: false,
    deflist: false,
    footnote: false,
    ins: false,
    mark: false,
    sub: false,
    sup: false,
    tasklists: false,
    tables: true,
    strikethrough: true,
    ...state
  };

  return {
    defaults,
    compile: (markdown) =>
      markdownit(defaults)
        .use(markdownitAnchor, {
          slugify: (s) => s.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')
        })
        .use(defaults.abbr ? markdownitAbbr : () => {})
        .use(defaults.attrs ? markdownitAttrs : () => {})
        .use(defaults.cjk ? markdownitCjk : () => {})
        .use(defaults.deflist ? markdownitDeflist : () => {})
        .use(defaults.footnote ? markdownitFootnote : () => {})
        .use(defaults.ins ? markdownitIns : () => {})
        .use(defaults.mark ? markdownitMark : () => {})
        .use(defaults.sub ? markdownitSub : () => {})
        .use(defaults.sup ? markdownitSup : () => {})
        .use(defaults.tasklists ? markdownitTasklists : () => {})
        .render(markdown)
  };
}

// marked compiler adapter
export function createMarkedCompiler(state = {}) {
  const defaults = {
    breaks: false,
    gfm: true,
    pedantic: false,
    linkify: true,
    smartypants: false,
    extendedAutolink: true,
    ...state
  };

  return {
    defaults,
    compile: (markdown) => {
      const instance = new Marked(
        gfmHeadingId(),
        defaults.linkify ? markedLinkifyIt() : () => {}
      );
      return instance.parse(markdown);
    }
  };
}

// remark compiler adapter
export function createRemarkCompiler(state = {}) {
  const defaults = {
    breaks: false,
    gfm: true,
    sanitize: false,
    ...state
  };

  return {
    defaults,
    compile: (markdown) =>
      remark()
        .use(remarkParse)
        .use(defaults.gfm ? remarkGfm : undefined)
        .use(defaults.breaks ? remarkBreaks : undefined)
        .use(remarkHtml, defaults)
        .use(remarkSlug)
        .processSync(markdown)
        .value
  };
}

// commonmark compiler adapter
export function createCommonmarkCompiler(state = {}) {
  const defaults = {
    safe: false,
    smart: false,
    ...state
  };

  return {
    defaults,
    compile: (markdown) => {
      const reader = new commonmark.Parser();
      const writer = new commonmark.HtmlRenderer(defaults);
      return writer.render(reader.parse(markdown));
    }
  };
}

// remarkable compiler adapter
export function createRemarkableCompiler(state = {}) {
  const defaults = {
    breaks: false,
    html: true,
    linkify: true,
    typographer: false,
    xhtmlOut: false,
    langPrefix: 'language-',
    quotes: '\u201c\u201d\u2018\u2019',
    ...state
  };

  return {
    defaults,
    compile: (markdown) =>
      new Remarkable('full', defaults).render(markdown)
  };
}

// showdown compiler adapter
export function createShowdownCompiler(state = {}) {
  const flavor = showdown.getFlavorOptions('github');
  const defaults = { ...flavor, ...state };

  return {
    defaults,
    compile: (markdown) => {
      const converter = new showdown.Converter(defaults);
      return converter.makeHtml(markdown);
    }
  };
}

// Get all compilers
export function getAllCompilers(stateOverrides = {}) {
  return {
    'markdown-it': createMarkdownItCompiler(stateOverrides['markdown-it'] || {}),
    'marked': createMarkedCompiler(stateOverrides.marked || {}),
    'remark': createRemarkCompiler(stateOverrides.remark || {}),
    'commonmark': createCommonmarkCompiler(stateOverrides.commonmark || {}),
    'remarkable': createRemarkableCompiler(stateOverrides.remarkable || {}),
    'showdown': createShowdownCompiler(stateOverrides.showdown || {}),
  };
}
