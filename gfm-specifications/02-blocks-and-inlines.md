# GFM Spec — Section 3: Blocks and Inlines

> **Navigation:** [← 01-preliminaries.md](01-preliminaries.md) | [INDEX](INDEX.md) | [03-leaf-blocks.md →](03-leaf-blocks.md)

---

# 3Blocks and inlines

We can think of a document as a sequence of [blocks](#blocks)—structural elements like paragraphs, block quotations, lists, headings, rules, and code blocks. Some blocks (like block quotes and list items) contain other blocks; others (like headings and paragraphs) contain [inline](#inline) content—text, links, emphasized text, images, code spans, and so on.

## [](#TOC)3.1Precedence

Indicators of block structure always take precedence over indicators of inline structure. So, for example, the following is a list with two items, not a list with one item containing a code span:

[Example 12](#example-12)

```markdown
- `one
- two`
```

```html
<ul>
<li>`one</li>
<li>two`</li>
</ul>
```

This means that parsing can proceed in two steps: first, the block structure of the document can be discerned; second, text lines inside paragraphs, headings, and other block constructs can be parsed for inline structure. The second step requires information about link reference definitions that will be available only at the end of the first step. Note that the first step requires processing lines in sequence, but the second can be parallelized, since the inline parsing of one block element does not affect the inline parsing of any other.

## [](#TOC)3.2Container blocks and leaf blocks

We can divide blocks into two types: [container blocks](#container-blocks), which can contain other blocks, and [leaf blocks](#leaf-blocks), which cannot.

---

> **Navigation:** [← 01-preliminaries.md](01-preliminaries.md) | [INDEX](INDEX.md) | [03-leaf-blocks.md →](03-leaf-blocks.md)
