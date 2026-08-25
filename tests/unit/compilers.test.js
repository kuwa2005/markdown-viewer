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
// Test: Compiler Adapters
// ============================================================

const basicTests = (name, compiler) => {
  describe(`${name} compiler`, () => {
    it('converts heading', () => {
      const html = compiler.compile('# Hello');
      assert.ok(html.includes('<h1'));
      assert.ok(html.includes('Hello'));
    });

    it('converts paragraph', () => {
      const html = compiler.compile('Hello world');
      assert.ok(html.includes('<p'));
      assert.ok(html.includes('Hello world'));
    });

    it('converts bold', () => {
      const html = compiler.compile('**bold**');
      assert.ok(html.includes('<strong') || html.includes('<b'));
    });

    it('converts italic', () => {
      const html = compiler.compile('*italic*');
      assert.ok(html.includes('<em') || html.includes('<i'));
    });

    it('converts link', () => {
      const html = compiler.compile('[text](https://example.com)');
      assert.ok(html.includes('<a'));
      assert.ok(html.includes('https://example.com'));
    });

    it('converts image', () => {
      const html = compiler.compile('![alt](https://example.com/img.png)');
      assert.ok(html.includes('<img'));
      assert.ok(html.includes('https://example.com/img.png'));
    });

    it('converts code block', () => {
      const html = compiler.compile('```js\ncode\n```');
      assert.ok(html.includes('<pre'));
      assert.ok(html.includes('code'));
    });

    it('converts unordered list', () => {
      const html = compiler.compile('- item 1\n- item 2');
      assert.ok(html.includes('<ul'));
      assert.ok(html.includes('<li'));
    });

    it('converts ordered list', () => {
      const html = compiler.compile('1. first\n2. second');
      assert.ok(html.includes('<ol'));
      assert.ok(html.includes('<li'));
    });

    it('converts blockquote', () => {
      const html = compiler.compile('> quote');
      assert.ok(html.includes('<blockquote'));
    });

    it('converts thematic break', () => {
      const html = compiler.compile('---');
      assert.ok(html.includes('<hr'));
    });

    it('handles empty input', () => {
      const html = compiler.compile('');
      assert.equal(typeof html, 'string');
    });

    it('converts h3', () => {
      const html = compiler.compile('### Level 3');
      assert.ok(html.includes('<h3'));
    });
  });
};

// markdown-it
basicTests('markdown-it', createMarkdownItCompiler());

describe('markdown-it GFM extensions', () => {
  it('converts table', () => {
    const compiler = createMarkdownItCompiler();
    const html = compiler.compile('| A | B |\n|---|---|\n| 1 | 2 |');
    assert.ok(html.includes('<table'));
    assert.ok(html.includes('<th'));
    assert.ok(html.includes('<td'));
  });

  it('converts strikethrough', () => {
    const compiler = createMarkdownItCompiler();
    const html = compiler.compile('~~deleted~~');
    assert.ok(html.includes('<del') || html.includes('<s'), `No strikethrough tag in: ${html}`);
  });

  it('converts task list', () => {
    const compiler = createMarkdownItCompiler({ tasklists: true });
    const html = compiler.compile('- [ ] unchecked\n- [x] checked');
    assert.ok(html.includes('checkbox') || html.includes('task'));
  });
});

// marked
basicTests('marked', createMarkedCompiler());

describe('marked GFM extensions', () => {
  it('converts table', () => {
    const compiler = createMarkedCompiler();
    const html = compiler.compile('| A | B |\n|---|---|\n| 1 | 2 |');
    assert.ok(html.includes('<table'));
  });

  it('converts strikethrough', () => {
    const compiler = createMarkedCompiler();
    const html = compiler.compile('~~deleted~~');
    assert.ok(html.includes('<del') || html.includes('<s'), `No strikethrough tag in: ${html}`);
  });
});

// remark
basicTests('remark', createRemarkCompiler());

describe('remark GFM extensions', () => {
  it('converts table', () => {
    const compiler = createRemarkCompiler();
    const html = compiler.compile('| A | B |\n|---|---|\n| 1 | 2 |');
    assert.ok(html.includes('<table'));
  });

  it('converts strikethrough', () => {
    const compiler = createRemarkCompiler();
    const html = compiler.compile('~~deleted~~');
    assert.ok(html.includes('<del') || html.includes('<s'), `No strikethrough tag in: ${html}`);
  });
});

// commonmark
basicTests('commonmark', createCommonmarkCompiler());

// remarkable
basicTests('remarkable', createRemarkableCompiler());

describe('remarkable extensions', () => {
  it('converts table', () => {
    const compiler = createRemarkableCompiler();
    const html = compiler.compile('| A | B |\n|---|---|\n| 1 | 2 |');
    assert.ok(html.includes('<table'));
  });
});

// showdown
basicTests('showdown', createShowdownCompiler());

describe('showdown GFM extensions', () => {
  it('converts table', () => {
    const compiler = createShowdownCompiler();
    const html = compiler.compile('| A | B |\n|---|---|\n| 1 | 2 |');
    assert.ok(html.includes('<table'));
  });

  it('converts strikethrough', () => {
    const compiler = createShowdownCompiler();
    const html = compiler.compile('~~deleted~~');
    assert.ok(html.includes('<del') || html.includes('<s'), `No strikethrough tag in: ${html}`);
  });

  it('converts task list', () => {
    const compiler = createShowdownCompiler();
    const html = compiler.compile('- [ ] unchecked\n- [x] checked');
    assert.ok(html.includes('checkbox') || html.includes('task'));
  });
});

// Edge cases across all compilers
describe('edge cases', () => {
  const compilers = {
    'markdown-it': createMarkdownItCompiler(),
    'marked': createMarkedCompiler(),
    'remark': createRemarkCompiler(),
    'commonmark': createCommonmarkCompiler(),
    'remarkable': createRemarkableCompiler(),
    'showdown': createShowdownCompiler(),
  };

  for (const [name, compiler] of Object.entries(compilers)) {
    it(`${name}: handles empty input`, () => {
      const html = compiler.compile('');
      assert.equal(typeof html, 'string');
    });

    it(`${name}: handles whitespace only`, () => {
      const html = compiler.compile('   \n  \n   ');
      assert.equal(typeof html, 'string');
    });

    it(`${name}: handles special characters`, () => {
      const html = compiler.compile('a & b < c > d');
      assert.ok(html.includes('&amp;') || html.includes('&'));
    });

    it(`${name}: handles unicode`, () => {
      const html = compiler.compile('日本語テスト 🎉');
      assert.ok(html.includes('日本語テスト'));
    });
  }
});
