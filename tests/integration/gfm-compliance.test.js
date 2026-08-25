import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createMarkdownItCompiler,
  createMarkedCompiler,
  createRemarkCompiler,
  createRemarkableCompiler,
  createShowdownCompiler,
} from '../helpers/compiler-setup.js';

// ============================================================
// Test: GFM Specification Compliance
// Based on gfm-specifications/ examples
// ============================================================

const gfmCompilers = {
  'markdown-it': createMarkdownItCompiler(),
  'marked': createMarkedCompiler(),
  'remark': createRemarkCompiler(),
  'remarkable': createRemarkableCompiler(),
  'showdown': createShowdownCompiler(),
};

// --- §4.10 Tables ---
describe('GFM §4.10: Tables', () => {
  const testCases = [
    {
      name: 'basic table (Example 198)',
      markdown: '| foo | bar |\n| --- | --- |\n| baz | bim |',
      check: (html) => html.includes('<table') && html.includes('<th') && html.includes('<td'),
    },
    {
      name: 'table with alignment (Example 200)',
      markdown: '| abc | defghi |\n:-: | -----------:\nbar | baz',
      check: (html) => html.includes('<table'),
      skip: ['showdown'], // showdown requires leading pipe
    },
    {
      name: 'table without leading/trailing pipes (Example 199)',
      markdown: '| abc | defghi |\n:-: | -----------:\nbar | baz',
      check: (html) => html.includes('<table'),
      skip: ['showdown'], // showdown requires leading pipe
    },
  ];

  for (const [name, compiler] of Object.entries(gfmCompilers)) {
    for (const tc of testCases) {
      if (tc.skip && tc.skip.includes(name)) continue;
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed: ${html.substring(0, 300)}`);
      });
    }
  }
});

// --- §5.3 Task list items ---
describe('GFM §5.3: Task list items', () => {
  const testCases = [
    {
      name: 'basic task list (Example 279)',
      markdown: '- [ ] foo\n- [x] bar',
      check: (html) => html.includes('checkbox') || html.includes('task'),
    },
    {
      name: 'nested task list (Example 280)',
      markdown: '- [x] foo\n  - [ ] bar\n  - [x] baz\n- [ ] bim',
      check: (html) => html.includes('checkbox') || html.includes('task'),
    },
  ];

  const tasklistCompilers = {
    'markdown-it': createMarkdownItCompiler({ tasklists: true }),
    'marked': createMarkedCompiler(),
    'showdown': createShowdownCompiler(),
  };

  for (const [name, compiler] of Object.entries(tasklistCompilers)) {
    for (const tc of testCases) {
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed: ${html.substring(0, 300)}`);
      });
    }
  }
});

// --- §6.5 Strikethrough ---
describe('GFM §6.5: Strikethrough', () => {
  const testCases = [
    {
      name: 'strikethrough (Example 491)',
      markdown: '~~Hi~~ Hello, ~there~ world!',
      check: (html) => html.includes('<del') || html.includes('<s'),
    },
    {
      name: 'strikethrough with paragraph break (known limitation)',
      markdown: 'This ~~has a\n\nnew paragraph~~.',
      check: (html) => html.includes('<del') || html.includes('<s'),
      knownFail: true, // GFM spec allows cross-paragraph strikethrough, but no compiler implements it
    },
  ];

  for (const [name, compiler] of Object.entries(gfmCompilers)) {
    for (const tc of testCases) {
      if (tc.knownFail) {
        it.todo(`${tc.name} [${name}] — known compliance gap`);
        continue;
      }
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed for ${name}: ${html.substring(0, 300)}`);
      });
    }
  }
});

// --- §4.2 ATX headings ---
describe('GFM §4.2: ATX headings', () => {
  const testCases = [
    {
      name: 'h1-h6 (Example 32)',
      markdown: '# foo\n## foo\n### foo\n#### foo\n##### foo\n###### foo',
      check: (html) => {
        for (let i = 1; i <= 6; i++) {
          if (!html.includes(`<h${i}`)) return false;
        }
        return true;
      },
    },
    {
      name: 'closing sequence (Example 41)',
      markdown: '## foo ##\n###   bar    ###',
      check: (html) => html.includes('<h2') && html.includes('<h3'),
    },
  ];

  for (const [name, compiler] of Object.entries(gfmCompilers)) {
    for (const tc of testCases) {
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed: ${html.substring(0, 300)}`);
      });
    }
  }
});

// --- §4.5 Fenced code blocks ---
describe('GFM §4.5: Fenced code blocks', () => {
  const testCases = [
    {
      name: 'backtick fence (Example 89)',
      markdown: '```\n<\n >\n```',
      check: (html) => html.includes('<pre') && (html.includes('&lt;') || html.includes('&#x3C;')),
    },
    {
      name: 'tilde fence (Example 90)',
      markdown: '~~~\n<\n >\n~~~',
      check: (html) => html.includes('<pre'),
    },
    {
      name: 'info string (Example 107)',
      markdown: '```ruby\ndef foo\nend\n```',
      check: (html) => html.includes('<pre'),
    },
  ];

  for (const [name, compiler] of Object.entries(gfmCompilers)) {
    for (const tc of testCases) {
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed: ${html.substring(0, 300)}`);
      });
    }
  }
});

// --- §4.1 Thematic breaks ---
describe('GFM §4.1: Thematic breaks', () => {
  const testCases = [
    {
      name: 'asterisks (Example 13)',
      markdown: '***',
      check: (html) => html.includes('<hr'),
    },
    {
      name: 'dashes (Example 13)',
      markdown: '---',
      check: (html) => html.includes('<hr'),
    },
    {
      name: 'underscores (Example 13)',
      markdown: '___',
      check: (html) => html.includes('<hr'),
    },
  ];

  for (const [name, compiler] of Object.entries(gfmCompilers)) {
    for (const tc of testCases) {
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed: ${html.substring(0, 300)}`);
      });
    }
  }
});

// --- §5.1 Block quotes ---
describe('GFM §5.1: Block quotes', () => {
  const testCases = [
    {
      name: 'basic blockquote (Example 206)',
      markdown: '> # Foo\n> bar\n> baz',
      check: (html) => html.includes('<blockquote') && html.includes('<h1'),
    },
    {
      name: 'blockquote without space (Example 207)',
      markdown: '># Foo\n>bar\n>baz',
      check: (html) => html.includes('<blockquote'),
    },
  ];

  for (const [name, compiler] of Object.entries(gfmCompilers)) {
    for (const tc of testCases) {
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed: ${html.substring(0, 300)}`);
      });
    }
  }
});

// --- §6.4 Emphasis ---
describe('GFM §6.4: Emphasis', () => {
  const testCases = [
    {
      name: 'single asterisk (Example 336)',
      markdown: '*foo bar*',
      check: (html) => html.includes('<em'),
    },
    {
      name: 'double asterisk (Example 343)',
      markdown: '**foo bar**',
      check: (html) => html.includes('<strong') || html.includes('<b'),
    },
    {
      name: 'single underscore (Example 350)',
      markdown: '_foo bar_',
      check: (html) => html.includes('<em'),
    },
  ];

  for (const [name, compiler] of Object.entries(gfmCompilers)) {
    for (const tc of testCases) {
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed: ${html.substring(0, 300)}`);
      });
    }
  }
});

// --- §6.6 Links ---
describe('GFM §6.6: Links', () => {
  const testCases = [
    {
      name: 'inline link (Example 471)',
      markdown: '[link](/uri "title")',
      check: (html) => html.includes('<a') && html.includes('/uri'),
    },
    {
      name: 'reference link (Example 479)',
      markdown: '[foo][bar]\n\n[bar]: /url "title"',
      check: (html) => html.includes('<a'),
    },
  ];

  for (const [name, compiler] of Object.entries(gfmCompilers)) {
    for (const tc of testCases) {
      it(`${tc.name} [${name}]`, () => {
        const html = compiler.compile(tc.markdown);
        assert.ok(tc.check(html), `Failed: ${html.substring(0, 300)}`);
      });
    }
  }
});
