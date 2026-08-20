# GFM Spec — Section 2: Preliminaries

> **Navigation:** [← 00-overview.md](00-overview.md) | [INDEX](INDEX.md) | [02-blocks-and-inlines.md →](02-blocks-and-inlines.md)

---

# 2Preliminaries

## [](#TOC)2.1Characters and lines

Any sequence of [characters](#character) is a valid CommonMark document.

A [character](#character) is a Unicode code point. Although some code points (for example, combining accents) do not correspond to characters in an intuitive sense, all code points count as characters for purposes of this spec.

This spec does not specify an encoding; it thinks of lines as composed of [characters](#character) rather than bytes. A conforming parser may be limited to a certain encoding.

A [line](#line) is a sequence of zero or more [characters](#character) other than newline (`U+000A`) or carriage return (`U+000D`), followed by a [line ending](#line-ending) or by the end of file.

A [line ending](#line-ending) is a newline (`U+000A`), a carriage return (`U+000D`) not followed by a newline, or a carriage return and a following newline.

A line containing no characters, or a line containing only spaces (`U+0020`) or tabs (`U+0009`), is called a [blank line](#blank-line).

The following definitions of character classes will be used in this spec:

A [whitespace character](#whitespace-character) is a space (`U+0020`), tab (`U+0009`), newline (`U+000A`), line tabulation (`U+000B`), form feed (`U+000C`), or carriage return (`U+000D`).

[Whitespace](#whitespace) is a sequence of one or more [whitespace characters](#whitespace-character).

A [Unicode whitespace character](#unicode-whitespace-character) is any code point in the Unicode `Zs` general category, or a tab (`U+0009`), carriage return (`U+000D`), newline (`U+000A`), or form feed (`U+000C`).

[Unicode whitespace](#unicode-whitespace) is a sequence of one or more [Unicode whitespace characters](#unicode-whitespace-character).

A [space](#space) is `U+0020`.

A [non-whitespace character](#non-whitespace-character) is any character that is not a [whitespace character](#whitespace-character).

An [ASCII punctuation character](#ascii-punctuation-character) is `!`, `"`, `#`, `$`, `%`, `&`, `'`, `(`, `)`, `*`, `+`, `,`, `-`, `.`, `/` (U+0021–2F), `:`, `;`, `<`, `=`, `>`, `?`, `@` (U+003A–0040), `[`, `\`, `]`, `^`, `_`, `` ` `` (U+005B–0060), `{`, `|`, `}`, or `~` (U+007B–007E).

A [punctuation character](#punctuation-character) is an [ASCII punctuation character](#ascii-punctuation-character) or anything in the general Unicode categories `Pc`, `Pd`, `Pe`, `Pf`, `Pi`, `Po`, or `Ps`.

## [](#TOC)2.2Tabs

Tabs in lines are not expanded to [spaces](#space). However, in contexts where whitespace helps to define block structure, tabs behave as if they were replaced by spaces with a tab stop of 4 characters.

Thus, for example, a tab can be used instead of four spaces in an indented code block. (Note, however, that internal tabs are passed through as literal tabs, not expanded to spaces.)

[Example 1](#example-1)

```markdown
→foo→baz→→bim
```

```html
<pre><code>foo→baz→→bim
</code></pre>
```

[Example 2](#example-2)

```markdown
  →foo→baz→→bim
```

```html
<pre><code>foo→baz→→bim
</code></pre>
```

[Example 3](#example-3)

```markdown
    a→a
    ὐ→a
```

```html
<pre><code>a→a
ὐ→a
</code></pre>
```

In the following example, a continuation paragraph of a list item is indented with a tab; this has exactly the same effect as indentation with four spaces would:

[Example 4](#example-4)

```markdown
  - foo

→bar
```

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
```

[Example 5](#example-5)

```markdown
- foo

→→bar
```

```html
<ul>
<li>
<p>foo</p>
<pre><code>  bar
</code></pre>
</li>
</ul>
```

Normally the `>` that begins a block quote may be followed optionally by a space, which is not considered part of the content. In the following case `>` is followed by a tab, which is treated as if it were expanded into three spaces. Since one of these spaces is considered part of the delimiter, `foo` is considered to be indented six spaces inside the block quote context, so we get an indented code block starting with two spaces.

[Example 6](#example-6)

```markdown
>→→foo
```

```html
<blockquote>
<pre><code>  foo
</code></pre>
</blockquote>
```

[Example 7](#example-7)

```markdown
-→→foo
```

```html
<ul>
<li>
<pre><code>  foo
</code></pre>
</li>
</ul>
```

[Example 8](#example-8)

```markdown
    foo
→bar
```

```html
<pre><code>foo
bar
</code></pre>
```

[Example 9](#example-9)

```markdown
 - foo
   - bar
→ - baz
```

```html
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>baz</li>
</ul>
</li>
</ul>
</li>
</ul>
```

[Example 10](#example-10)

```markdown
#→Foo
```

```html
<h1>Foo</h1>
```

[Example 11](#example-11)

```markdown
*→*→*→
```

```html
<hr />
```

## [](#TOC)2.3Insecure characters

For security reasons, the Unicode character `U+0000` must be replaced with the REPLACEMENT CHARACTER (`U+FFFD`).

---

> **Navigation:** [← 00-overview.md](00-overview.md) | [INDEX](INDEX.md) | [02-blocks-and-inlines.md →](02-blocks-and-inlines.md)
