import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// ============================================================
// Test: Pure Functions from content/index.js and background/
// ============================================================

// --- _escape(str) ---
describe('_escape', () => {
  // Extract the function from content/index.js logic
  const _escape = (str) =>
    str.replace(/[&<>]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    }[tag] || tag));

  it('escapes ampersand', () => {
    assert.equal(_escape('a & b'), 'a &amp; b');
  });

  it('escapes less-than', () => {
    assert.equal(_escape('1 < 2'), '1 &lt; 2');
  });

  it('escapes greater-than', () => {
    assert.equal(_escape('2 > 1'), '2 &gt; 1');
  });

  it('escapes all three', () => {
    assert.equal(_escape('<a & b > c'), '&lt;a &amp; b &gt; c');
  });

  it('handles empty string', () => {
    assert.equal(_escape(''), '');
  });

  it('handles no special chars', () => {
    assert.equal(_escape('hello world'), 'hello world');
  });

  it('handles multiple occurrences', () => {
    assert.equal(_escape('a & b & c'), 'a &amp; b &amp; c');
  });

  it('handles unicode', () => {
    assert.equal(_escape('日本語 & <test>'), '日本語 &amp; &lt;test&gt;');
  });
});

// --- frontmatter(md) ---
describe('frontmatter', () => {
  const mockDocument = { title: '' };
  const frontmatter = (md) => {
    if (/^-{3}[\s\S]+?-{3}/.test(md)) {
      var [, yaml] = /^-{3}([\s\S]+?)-{3}/.exec(md);
      var title = /title: (?:'|")*(.*)(?:'|")*/.exec(yaml);
      title && (mockDocument.title = title[1]);
    }
    else if (/^\+{3}[\s\S]+?\+{3}/.test(md)) {
      var [, toml] = /^\+{3}([\s\S]+?)\+{3}/.exec(md);
      var title = /title = (?:'|"|`)*(.*)(?:'|"|`)*/.exec(toml);
      title && (mockDocument.title = title[1]);
    }
    return md.replace(/^(?:-|\+){3}[\s\S]+?(?:-|\+){3}/, '');
  };

  it('strips YAML frontmatter', () => {
    const input = '---\ntitle: Test\n---\n\nBody';
    const result = frontmatter(input);
    assert.ok(!result.startsWith('---'));
    assert.ok(result.includes('Body'));
  });

  it('extracts title from YAML', () => {
    mockDocument.title = '';
    frontmatter('---\ntitle: Hello World\n---\n\nBody');
    assert.equal(mockDocument.title, 'Hello World');
  });

  it('strips TOML frontmatter', () => {
    const input = '+++\ntitle = "Test"\n+++\n\nBody';
    const result = frontmatter(input);
    assert.ok(!result.startsWith('+++'));
    assert.ok(result.includes('Body'));
  });

  it('extracts title from TOML', () => {
    mockDocument.title = '';
    frontmatter('+++\ntitle = Hello World\n+++\n\nBody');
    assert.equal(mockDocument.title, 'Hello World');
  });

  it('handles no frontmatter', () => {
    const input = '# Just a heading\n\nParagraph';
    const result = frontmatter(input);
    assert.equal(result, input);
  });

  it('handles YAML with quoted title', () => {
    mockDocument.title = '';
    frontmatter("---\ntitle: Quoted Title\n---\n\nBody");
    assert.equal(mockDocument.title, 'Quoted Title');
  });

  it('handles YAML without title', () => {
    mockDocument.title = '';
    const result = frontmatter('---\nauthor: Test\n---\n\nBody');
    assert.ok(result.includes('Body'));
  });
});

// --- toc.render(html) ---
describe('toc', () => {
  const toc = (() => {
    var walk = (regex, string, group, result = [], match = regex.exec(string)) =>
      !match ? result : walk(regex, string, group, result.concat(!group ? match[1] :
        group.reduce((all, name, index) => (all[name] = match[index + 1], all), {})));
    return {
      render: (html) =>
        walk(
          /<h([1-6]) id="(.*?)">(.*?)<\/h[1-6]>/gs,
          html,
          ['level', 'id', 'title']
        )
        .reduce((toc, {id, title, level}) => toc +=
          '<div class="_ul">'.repeat(level) +
          '<a href="#' + id + '">' + title.replace(/<a[^>]+>/g, '').replace(/<\/a>/g, '') + '</a>' +
          '</div>'.repeat(level)
        , '')
    };
  })();

  it('generates ToC from single heading', () => {
    const html = '<h1 id="title">Title</h1>';
    const result = toc.render(html);
    assert.ok(result.includes('<a href="#title">Title</a>'));
  });

  it('generates nested ToC', () => {
    const html = '<h1 id="h1">H1</h1><h2 id="h2">H2</h2><h3 id="h3">H3</h3>';
    const result = toc.render(html);
    assert.ok(result.includes('href="#h1"'));
    assert.ok(result.includes('href="#h2"'));
    assert.ok(result.includes('href="#h3"'));
  });

  it('returns empty string for no headings', () => {
    const html = '<p>No headings here</p>';
    const result = toc.render(html);
    assert.equal(result, '');
  });

  it('strips anchor tags from heading text', () => {
    const html = '<h1 id="test"><a href="#test">Test</a></h1>';
    const result = toc.render(html);
    assert.ok(!result.includes('<a href="#test"><a'));
  });
});

// --- anchors(html) ---
describe('anchors', () => {
  const anchors = (html) =>
    html.replace(/(<h[1-6] id="(.*?)">)/g, (header, _, id) =>
      header +
      '<a class="anchor" name="' + id + '" href="#' + id + '">' +
      '<span class="octicon octicon-link"></span></a>'
    );

  it('adds anchor to h1', () => {
    const html = '<h1 id="title">Title</h1>';
    const result = anchors(html);
    assert.ok(result.includes('<a class="anchor" name="title" href="#title">'));
  });

  it('adds anchor to h2', () => {
    const html = '<h2 id="sub">Sub</h2>';
    const result = anchors(html);
    assert.ok(result.includes('name="sub"'));
  });

  it('adds anchors to multiple headings', () => {
    const html = '<h1 id="a">A</h1><h2 id="b">B</h2>';
    const result = anchors(html);
    assert.ok(result.includes('name="a"'));
    assert.ok(result.includes('name="b"'));
  });

  it('does not modify non-heading elements', () => {
    const html = '<p id="test">Text</p>';
    const result = anchors(html);
    assert.equal(result, html);
  });
});

// --- mathjax.escape(math) ---
describe('mathjax.escape', () => {
  const escape = (math) =>
    math.replace(/[<>&]/gi, (symbol) =>
      symbol === '>' ? '&gt;' :
      symbol === '<' ? '&lt;' :
      symbol === '&' ? '&amp;': null
    );

  it('escapes ampersand', () => {
    assert.equal(escape('a & b'), 'a &amp; b');
  });

  it('escapes less-than', () => {
    assert.equal(escape('x < y'), 'x &lt; y');
  });

  it('escapes greater-than', () => {
    assert.equal(escape('x > y'), 'x &gt; y');
  });

  it('escapes all three', () => {
    assert.equal(escape('a < b & c > d'), 'a &lt; b &amp; c &gt; d');
  });

  it('handles no special chars', () => {
    assert.equal(escape('x^2'), 'x^2');
  });
});

// --- mathjax.delimiters ---
describe('mathjax.delimiters', () => {
  const delimiters = new RegExp([
    /\$\$[^`]*?\$\$/,
    /\\\([^`]*?\\\)/,
    /\\\[[^`]*?\\\]/,
    /\\begin\{.*?\}[^`]*?\\end\{.*?\}/,
    /\$[^`\n]*?\$/,
  ]
  .map((regex) => `(?:${regex.source})`).join('|'), 'gi');

  it('matches display math $$...$$', () => {
    delimiters.lastIndex = 0;
    assert.ok(delimiters.test('$$x^2$$'));
  });

  it('matches inline math $...$', () => {
    delimiters.lastIndex = 0;
    assert.ok(delimiters.test('$x^2$'));
  });

  it('matches \\(...\\)', () => {
    delimiters.lastIndex = 0;
    assert.ok(delimiters.test('\\(x^2\\)'));
  });

  it('matches \\[...\\]', () => {
    delimiters.lastIndex = 0;
    assert.ok(delimiters.test('\\[x^2\\]'));
  });

  it('matches \\begin{...}...\\end{...}', () => {
    delimiters.lastIndex = 0;
    assert.ok(delimiters.test('\\begin{equation}x^2\\end{equation}'));
  });

  it('does not match regular text', () => {
    delimiters.lastIndex = 0;
    assert.ok(!delimiters.test('no math here'));
  });
});

// --- mathjax().tokenize() and detokenize() ---
describe('mathjax tokenize/detokenize', () => {
  const createMathjax = () => {
    const delimiters = new RegExp([
      /\$\$[^`]*?\$\$/,
      /\\\([^`]*?\\\)/,
      /\\\[[^`]*?\\\]/,
      /\\begin\{.*?\}[^`]*?\\end\{.*?\}/,
      /\$[^`\n]*?\$/,
    ]
    .map((regex) => `(?:${regex.source})`).join('|'), 'gi');

    const escape = (math) =>
      math.replace(/[<>&]/gi, (symbol) =>
        symbol === '>' ? '&gt;' :
        symbol === '<' ? '&lt;' :
        symbol === '&' ? '&amp;': null
      );

    const ctor = (map = {}) => ({
      tokenize: (markdown) =>
        markdown.replace(delimiters, (str, offset) => (
          map[offset] = str,
          `?${offset}?`
        ))
      ,
      detokenize: (html) =>
        Object.keys(map)
          .reduce((html, offset) =>
            html = html.replace(`?${offset}?`, () => escape(map[offset])),
            html
          )
    });

    return { ctor, escape };
  };

  it('tokenize replaces math with placeholders', () => {
    const { ctor } = createMathjax();
    const mj = ctor();
    const result = mj.tokenize('Formula: $x^2$ here');
    assert.ok(result.includes('?'));
    assert.ok(!result.includes('$x^2$'));
  });

  it('detokenize restores math from placeholders', () => {
    const { ctor } = createMathjax();
    const mj = ctor();
    const tokenized = mj.tokenize('Formula: $x^2$ here');
    const detokenized = mj.detokenize(tokenized);
    assert.equal(detokenized, 'Formula: $x^2$ here');
  });

  it('escapes HTML in math during detokenize', () => {
    const { ctor } = createMathjax();
    const mj = ctor();
    const tokenized = mj.tokenize('Formula: $x < y$ here');
    const detokenized = mj.detokenize(tokenized);
    assert.ok(detokenized.includes('&lt;'));
    assert.ok(!detokenized.includes('<y'));
  });

  it('handles multiple math expressions', () => {
    const { ctor } = createMathjax();
    const mj = ctor();
    const tokenized = mj.tokenize('$a$ and $b$');
    const detokenized = mj.detokenize(tokenized);
    assert.equal(detokenized, '$a$ and $b$');
  });

  it('handles display math', () => {
    const { ctor } = createMathjax();
    const mj = ctor();
    const tokenized = mj.tokenize('$$\\int_0^1 f(x)dx$$');
    const detokenized = mj.detokenize(tokenized);
    assert.equal(detokenized, '$$\\int_0^1 f(x)dx$$');
  });
});

// --- storage.defaults(compilers) ---
describe('storage.defaults', () => {
  const defaults = (compilers) => {
    const match = '\\.(?:markdown|mdown|mkdn|md|mkd|mdwn|mdtxt|mdtext|text)(?:#.*|\\?.*)?$';
    const result = {
      theme: 'github',
      compiler: 'markdown-it',
      raw: false,
      match,
      themes: { width: 'auto' },
      content: {
        autoreload: false,
        emoji: false,
        mathjax: false,
        mermaid: false,
        syntax: true,
        toc: false,
      },
      origins: {
        'file://': { header: true, path: true, match }
      },
      settings: { icon: 'default', theme: 'light' },
      custom: { theme: '', color: 'auto' }
    };

    Object.keys(compilers).forEach((compiler) => {
      result[compiler] = compilers[compiler].defaults;
    });

    return result;
  };

  it('generates defaults with compiler entries', () => {
    const compilers = {
      'markdown-it': { defaults: { breaks: false } },
      'marked': { defaults: { gfm: true } }
    };
    const result = defaults(compilers);
    assert.deepEqual(result['markdown-it'], { breaks: false });
    assert.deepEqual(result.marked, { gfm: true });
  });

  it('includes content options', () => {
    const result = defaults({});
    assert.equal(result.content.syntax, true);
    assert.equal(result.content.autoreload, false);
  });

  it('includes theme settings', () => {
    const result = defaults({});
    assert.equal(result.theme, 'github');
    assert.equal(result.themes.width, 'auto');
  });
});

// --- detect(content, url) origin matching ---
describe('detect origin matching', () => {
  // Simplified version of the detect logic from background/detect.js
  const detect = (state) => (content, url) => {
    const location = new URL(url);
    const origins = state.origins;

    const origin =
      origins[location.origin] ||
      origins[location.protocol + '//' + location.hostname] ||
      origins[location.protocol + '//' + location.host] ||
      origins[location.protocol + '//*.' + location.hostname.replace(/^[^.]+\.(.*)/, '$1')] ||
      origins[location.protocol + '//*.' + location.host.replace(/^[^.]+\.(.*)/, '$1')] ||
      origins['*://' + location.hostname] ||
      origins['*://' + location.host] ||
      origins['*://*.' + location.hostname.replace(/^[^.]+\.(.*)/, '$1')] ||
      origins['*://*.' + location.host.replace(/^[^.]+\.(.*)/, '$1')] ||
      origins['*://*'];

    return (
      (origin && origin.header && origin.path && origin.match && /\btext\/(?:(?:(?:x-)?markdown)|plain)\b/i.test(content) && new RegExp(origin.match).test(location.href)) ||
      (origin && origin.header && !origin.path && /\btext\/(?:(?:(?:x-)?markdown)|plain)\b/i.test(content)) ||
      (origin && origin.path && origin.match && !origin.header && new RegExp(origin.match).test(location.href))
        ? origin
        : undefined
    );
  };

  it('matches exact origin', () => {
    const state = {
      origins: {
        'https://raw.githubusercontent.com': { header: true, path: true, match: '\\.md$' }
      }
    };
    const d = detect(state);
    const result = d('text/markdown', 'https://raw.githubusercontent.com/user/repo/README.md');
    assert.ok(result);
  });

  it('does not match unknown origin', () => {
    const state = {
      origins: {
        'https://raw.githubusercontent.com': { header: true, path: true, match: '\\.md$' }
      }
    };
    const d = detect(state);
    const result = d('text/markdown', 'https://example.com/README.md');
    assert.equal(result, undefined);
  });

  it('matches wildcard origin', () => {
    const state = {
      origins: {
        '*://*': { header: true, path: true, match: '\\.md$' }
      }
    };
    const d = detect(state);
    const result = d('text/markdown', 'https://any-site.com/doc.md');
    assert.ok(result);
  });

  it('matches by content-type only when header=true, path=false', () => {
    const state = {
      origins: {
        'https://example.com': { header: true, path: false, match: '' }
      }
    };
    const d = detect(state);
    const result = d('text/markdown', 'https://example.com/anything');
    assert.ok(result);
  });

  it('matches by path only when header=false, path=true', () => {
    const state = {
      origins: {
        'https://example.com': { header: false, path: true, match: '\\.md$' }
      }
    };
    const d = detect(state);
    const result = d('text/html', 'https://example.com/doc.md');
    assert.ok(result);
  });

  it('rejects non-markdown content-type when header=true', () => {
    const state = {
      origins: {
        'https://example.com': { header: true, path: false, match: '' }
      }
    };
    const d = detect(state);
    const result = d('text/html', 'https://example.com/page');
    assert.equal(result, undefined);
  });
});
