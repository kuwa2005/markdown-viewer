// Common test data for all tests

export const basicMarkdown = {
  heading: '# Hello World',
  headingH3: '### Level 3',
  paragraph: 'This is a paragraph.',
  bold: '**bold text**',
  italic: '*italic text*',
  link: '[link text](https://example.com)',
  image: '![alt text](https://example.com/img.png)',
  codeInline: '`inline code`',
  codeBlock: '```js\nconst x = 1;\n```',
  unorderedList: '- item 1\n- item 2\n- item 3',
  orderedList: '1. first\n2. second\n3. third',
  blockquote: '> This is a quote',
  hr: '---',
  mixed: '# Title\n\nParagraph with **bold** and *italic*.\n\n- list item\n- another item\n\n```js\ncode\n```\n\n> quote',
};

export const gfmMarkdown = {
  table: '| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |',
  tableAlignment: '| Left | Center | Right |\n|:-----|:------:|------:|\n| a    | b      | c     |',
  strikethrough: '~~deleted text~~',
  strikethroughDouble: '~~also deleted~~',
  taskList: '- [ ] unchecked\n- [x] checked',
  taskListNested: '- [x] item 1\n  - [ ] sub item\n- [ ] item 2',
  autolink: 'Visit www.example.com for more.',
  emailAutolink: 'Contact user@example.com',
};

export const edgeCases = {
  empty: '',
  onlyWhitespace: '   \n  \n   ',
  onlyNewlines: '\n\n\n',
  specialChars: '<script>alert("xss")</script>',
  ampersand: 'a & b',
  angleBrackets: '1 < 2 > 0',
  unicode: '日本語テスト 🎉 émojis',
  longLine: 'x'.repeat(10000),
  nestedFormatting: '**bold *bold-italic* bold**',
  multipleLinks: '[a](http://a.com) and [b](http://b.com)',
};

export const frontmatterData = {
  yaml: '---\ntitle: My Document\nauthor: Test\n---\n\n# Content here',
  toml: '+++\ntitle = "My Document"\nauthor = "Test"\n+++\n\n# Content here',
  yamlWithTitle: '---\ntitle: "Hello World"\n---\n\nBody',
  tomlWithTitle: '+++\ntitle = "Hello World"\n+++\n\nBody',
  noFrontmatter: '# Just a heading\n\nParagraph',
  yamlNoTitle: '---\nauthor: Test\n---\n\nBody',
};

export const mathjaxData = {
  inline: 'Formula: $x^2$ here',
  display: 'Block: $$\\int_0^1 f(x)dx$$ here',
  paren: 'Inline: \\(x^2\\) here',
  bracket: 'Block: \\[\\int_0^1 f(x)dx\\] here',
  multiple: '$a$ and $b$ and $$c$$',
  noMath: 'No math here',
  escapedDollar: 'Price is \\$5',
};
