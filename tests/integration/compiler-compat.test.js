import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createMarkdownItCompiler,
  createMarkedCompiler,
  createRemarkCompiler,
  createCommonmarkCompiler,
  createRemarkableCompiler,
  createShowdownCompiler,
} from '../helpers/compiler-setup.js';

// ============================================================
// Test: Compiler Cross-Compatibility
// ============================================================

const compilers = {
  'markdown-it': createMarkdownItCompiler(),
  'marked': createMarkedCompiler(),
  'remark': createRemarkCompiler(),
  'commonmark': createCommonmarkCompiler(),
  'remarkable': createRemarkableCompiler(),
  'showdown': createShowdownCompiler(),
};

// GFM-capable compilers (all except commonmark)
const gfmCompilers = {
  'markdown-it': compilers['markdown-it'],
  'marked': compilers.marked,
  'remark': compilers.remark,
  'remarkable': compilers.remarkable,
  'showdown': compilers.showdown,
};

describe('compiler cross-compatibility: basic HTML structure', () => {
  const testCases = [
    {
      name: 'heading',
      markdown: '# Hello World',
      check: (html) => html.includes('<h1') && html.includes('Hello World'),
    },
    {
      name: 'paragraph',
      markdown: 'Hello world',
      check: (html) => html.includes('<p') && html.includes('Hello world'),
    },
    {
      name: 'bold',
      markdown: '**bold**',
      check: (html) => html.includes('<strong') || html.includes('<b'),
    },
    {
      name: 'italic',
      markdown: '*italic*',
      check: (html) => html.includes('<em') || html.includes('<i'),
    },
    {
      name: 'link',
      markdown: '[text](https://example.com)',
      check: (html) => html.includes('<a') && html.includes('https://example.com'),
    },
    {
      name: 'image',
      markdown: '![alt](https://example.com/img.png)',
      check: (html) => html.includes('<img') && html.includes('https://example.com/img.png'),
    },
    {
      name: 'code block',
      markdown: '```\ncode\n```',
      check: (html) => html.includes('<pre') && html.includes('code'),
    },
    {
      name: 'unordered list',
      markdown: '- item 1\n- item 2',
      check: (html) => html.includes('<ul') && html.includes('<li'),
    },
    {
      name: 'ordered list',
      markdown: '1. first\n2. second',
      check: (html) => html.includes('<ol') && html.includes('<li'),
    },
    {
      name: 'blockquote',
      markdown: '> quote',
      check: (html) => html.includes('<blockquote'),
    },
    {
      name: 'thematic break',
      markdown: '---',
      check: (html) => html.includes('<hr'),
    },
    {
      name: 'h3',
      markdown: '### Level 3',
      check: (html) => html.includes('<h3'),
    },
  ];

  for (const testCase of testCases) {
    for (const [name, compiler] of Object.entries(compilers)) {
      it(`${testCase.name} [${name}]`, () => {
        const html = compiler.compile(testCase.markdown);
        assert.ok(testCase.check(html), `Failed for ${name}: ${html.substring(0, 200)}`);
      });
    }
  }
});

describe('compiler cross-compatibility: GFM extensions', () => {
  it('all GFM compilers produce table HTML', () => {
    const markdown = '| A | B |\n|---|---|\n| 1 | 2 |';
    for (const [name, compiler] of Object.entries(gfmCompilers)) {
      const html = compiler.compile(markdown);
      assert.ok(html.includes('<table'), `Table not found in ${name}`);
    }
  });

  it('all GFM compilers produce strikethrough HTML', () => {
    const markdown = '~~deleted~~';
    for (const [name, compiler] of Object.entries(gfmCompilers)) {
      const html = compiler.compile(markdown);
      assert.ok(html.includes('<del') || html.includes('<s'), `Strikethrough not found in ${name}`);
    }
  });

  it('commonmark does NOT produce table HTML', () => {
    const markdown = '| A | B |\n|---|---|\n| 1 | 2 |';
    const html = compilers.commonmark.compile(markdown);
    assert.ok(!html.includes('<table'), 'Table should not be in commonmark output');
  });

  it('commonmark does NOT produce strikethrough HTML', () => {
    const markdown = '~~deleted~~';
    const html = compilers.commonmark.compile(markdown);
    assert.ok(!html.includes('<del') && !html.includes('<s'), 'Strikethrough should not be in commonmark output');
  });
});

describe('compiler cross-compatibility: complex document', () => {
  const complexMarkdown = `# Title

Paragraph with **bold** and *italic*.

## Sub heading

- item 1
- item 2

\`\`\`js
const x = 1;
\`\`\`

> blockquote

| Col1 | Col2 |
|------|------|
| a    | b    |`;

  it('all compilers produce non-empty output for complex doc', () => {
    for (const [name, compiler] of Object.entries(compilers)) {
      const html = compiler.compile(complexMarkdown);
      assert.ok(html.length > 50, `${name} produced too short output`);
      assert.ok(html.includes('<h1') || html.includes('Title'), `${name} missing heading`);
    }
  });

  it('GFM compilers all produce table for complex doc', () => {
    for (const [name, compiler] of Object.entries(gfmCompilers)) {
      const html = compiler.compile(complexMarkdown);
      assert.ok(html.includes('<table'), `${name} missing table`);
    }
  });
});
