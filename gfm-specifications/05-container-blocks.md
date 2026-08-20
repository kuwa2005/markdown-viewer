# GFM Spec — Section 5: Container Blocks

> **Navigation:** [← 04-tables-extension.md](04-tables-extension.md) | [INDEX](INDEX.md) | [06-inlines.md →](06-inlines.md)

---

# 5Container blocks

A [container block](#container-blocks) is a block that has other blocks as its contents. There are two basic kinds of container blocks: [block quotes](#block-quotes) and [list items](#list-items). [Lists](#list) are meta-containers for [list items](#list-items).

We define the syntax for container blocks recursively. The general form of the definition is:

> If X is a sequence of blocks, then the result of transforming X in such-and-such a way is a container of type Y with these blocks as its content.

So, we explain what counts as a block quote or list item by explaining how these can be *generated* from their contents. This should suffice to define the syntax, although it does not give a recipe for *parsing* these constructions. (A recipe is provided below in the section entitled [A parsing strategy](#appendix-a-parsing-strategy).)

## [](#TOC)5.1Block quotes

A [block quote marker](#block-quote-marker) consists of 0-3 spaces of initial indent, plus (a) the character `>` together with a following space, or (b) a single character `>` not followed by a space.

The following rules define [block quotes](#block-quotes):

1.  **Basic case.** If a string of lines *Ls* constitute a sequence of blocks *Bs*, then the result of prepending a [block quote marker](#block-quote-marker) to the beginning of each line in *Ls* is a [block quote](#block-quotes) containing *Bs*.
    
2.  **Laziness.** If a string of lines *Ls* constitute a [block quote](#block-quotes) with contents *Bs*, then the result of deleting the initial [block quote marker](#block-quote-marker) from one or more lines in which the next [non-whitespace character](#non-whitespace-character) after the [block quote marker](#block-quote-marker) is [paragraph continuation text](#paragraph-continuation-text) is a block quote with *Bs* as its content. [Paragraph continuation text](#paragraph-continuation-text) is text that will be parsed as part of the content of a paragraph, but does not occur at the beginning of the paragraph.
    
3.  **Consecutiveness.** A document cannot contain two [block quotes](#block-quotes) in a row unless there is a [blank line](#blank-line) between them.
    

Nothing else counts as a [block quote](#block-quotes).

Here is a simple example:

[Example 206](#example-206)

```markdown
> # Foo
> bar
> baz
```

```html
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
```

The spaces after the `>` characters can be omitted:

[Example 207](#example-207)

```markdown
># Foo
>bar
> baz
```

```html
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
```

The `>` characters can be indented 1-3 spaces:

[Example 208](#example-208)

```markdown
   > # Foo
   > bar
 > baz
```

```html
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
```

Four spaces gives us a code block:

[Example 209](#example-209)

```markdown
    > # Foo
    > bar
    > baz
```

```html
<pre><code>&gt; # Foo
&gt; bar
&gt; baz
</code></pre>
```

The Laziness clause allows us to omit the `>` before [paragraph continuation text](#paragraph-continuation-text):

[Example 210](#example-210)

```markdown
> # Foo
> bar
baz
```

```html
<blockquote>
<h1>Foo</h1>
<p>bar
baz</p>
</blockquote>
```

A block quote can contain some lazy and some non-lazy continuation lines:

[Example 211](#example-211)

```markdown
> bar
baz
> foo
```

```html
<blockquote>
<p>bar
baz
foo</p>
</blockquote>
```

Laziness only applies to lines that would have been continuations of paragraphs had they been prepended with [block quote markers](#block-quote-marker). For example, the `>` cannot be omitted in the second line of

```markdown
> foo
> ---
```

without changing the meaning:

[Example 212](#example-212)

```markdown
> foo
---
```

```html
<blockquote>
<p>foo</p>
</blockquote>
<hr />
```

Similarly, if we omit the `>` in the second line of

```markdown
> - foo
> - bar
```

then the block quote ends after the first line:

[Example 213](#example-213)

```markdown
> - foo
- bar
```

```html
<blockquote>
<ul>
<li>foo</li>
</ul>
</blockquote>
<ul>
<li>bar</li>
</ul>
```

For the same reason, we can’t omit the `>` in front of subsequent lines of an indented or fenced code block:

[Example 214](#example-214)

```markdown
>     foo
    bar
```

```html
<blockquote>
<pre><code>foo
</code></pre>
</blockquote>
<pre><code>bar
</code></pre>
```

[Example 215](#example-215)

````markdown
> ```
foo
```
````

```html
<blockquote>
<pre><code></code></pre>
</blockquote>
<p>foo</p>
<pre><code></code></pre>
```

Note that in the following case, we have a [lazy continuation line](#lazy-continuation-line):

[Example 216](#example-216)

```markdown
> foo
    - bar
```

```html
<blockquote>
<p>foo
- bar</p>
</blockquote>
```

To see why, note that in

```markdown
> foo
>     - bar
```

the `- bar` is indented too far to start a list, and can’t be an indented code block because indented code blocks cannot interrupt paragraphs, so it is [paragraph continuation text](#paragraph-continuation-text).

A block quote can be empty:

[Example 217](#example-217)

```markdown
>
```

```html
<blockquote>
</blockquote>
```

[Example 218](#example-218)

```markdown
>
>  
> 
```

```html
<blockquote>
</blockquote>
```

A block quote can have initial or final blank lines:

[Example 219](#example-219)

```markdown
>
> foo
>  
```

```html
<blockquote>
<p>foo</p>
</blockquote>
```

A blank line always separates block quotes:

[Example 220](#example-220)

```markdown
> foo

> bar
```

```html
<blockquote>
<p>foo</p>
</blockquote>
<blockquote>
<p>bar</p>
</blockquote>
```

(Most current Markdown implementations, including John Gruber’s original `Markdown.pl`, will parse this example as a single block quote with two paragraphs. But it seems better to allow the author to decide whether two block quotes or one are wanted.)

Consecutiveness means that if we put these block quotes together, we get a single block quote:

[Example 221](#example-221)

```markdown
> foo
> bar
```

```html
<blockquote>
<p>foo
bar</p>
</blockquote>
```

To get a block quote with two paragraphs, use:

[Example 222](#example-222)

```markdown
> foo
>
> bar
```

```html
<blockquote>
<p>foo</p>
<p>bar</p>
</blockquote>
```

Block quotes can interrupt paragraphs:

[Example 223](#example-223)

```markdown
foo
> bar
```

```html
<p>foo</p>
<blockquote>
<p>bar</p>
</blockquote>
```

In general, blank lines are not needed before or after block quotes:

[Example 224](#example-224)

```markdown
> aaa
***
> bbb
```

```html
<blockquote>
<p>aaa</p>
</blockquote>
<hr />
<blockquote>
<p>bbb</p>
</blockquote>
```

However, because of laziness, a blank line is needed between a block quote and a following paragraph:

[Example 225](#example-225)

```markdown
> bar
baz
```

```html
<blockquote>
<p>bar
baz</p>
</blockquote>
```

[Example 226](#example-226)

```markdown
> bar

baz
```

```html
<blockquote>
<p>bar</p>
</blockquote>
<p>baz</p>
```

[Example 227](#example-227)

```markdown
> bar
>
baz
```

```html
<blockquote>
<p>bar</p>
</blockquote>
<p>baz</p>
```

It is a consequence of the Laziness rule that any number of initial `>`s may be omitted on a continuation line of a nested block quote:

[Example 228](#example-228)

```markdown
> > > foo
bar
```

```html
<blockquote>
<blockquote>
<blockquote>
<p>foo
bar</p>
</blockquote>
</blockquote>
</blockquote>
```

[Example 229](#example-229)

```markdown
>>> foo
> bar
>>baz
```

```html
<blockquote>
<blockquote>
<blockquote>
<p>foo
bar
baz</p>
</blockquote>
</blockquote>
</blockquote>
```

When including an indented code block in a block quote, remember that the [block quote marker](#block-quote-marker) includes both the `>` and a following space. So *five spaces* are needed after the `>`:

[Example 230](#example-230)

```markdown
>     code

>    not code
```

```html
<blockquote>
<pre><code>code
</code></pre>
</blockquote>
<blockquote>
<p>not code</p>
</blockquote>
```

## [](#TOC)5.2List items

A [list marker](#list-marker) is a [bullet list marker](#bullet-list-marker) or an [ordered list marker](#ordered-list-marker).

A [bullet list marker](#bullet-list-marker) is a `-`, `+`, or `*` character.

An [ordered list marker](#ordered-list-marker) is a sequence of 1–9 arabic digits (`0-9`), followed by either a `.` character or a `)` character. (The reason for the length limit is that with 10 digits we start seeing integer overflows in some browsers.)

The following rules define [list items](#list-items):

1.  **Basic case.** If a sequence of lines *Ls* constitute a sequence of blocks *Bs* starting with a [non-whitespace character](#non-whitespace-character), and *M* is a list marker of width *W* followed by 1 ≤ *N* ≤ 4 spaces, then the result of prepending *M* and the following spaces to the first line of *Ls*, and indenting subsequent lines of *Ls* by *W + N* spaces, is a list item with *Bs* as its contents. The type of the list item (bullet or ordered) is determined by the type of its list marker. If the list item is ordered, then it is also assigned a start number, based on the ordered list marker.
    
    Exceptions:
    
    1.  When the first list item in a [list](#list) interrupts a paragraph—that is, when it starts on a line that would otherwise count as [paragraph continuation text](#paragraph-continuation-text)—then (a) the lines *Ls* must not begin with a blank line, and (b) if the list item is ordered, the start number must be 1.
    2.  If any line is a [thematic break](#thematic-break) then that line is not a list item.

For example, let *Ls* be the lines

[Example 231](#example-231)

```markdown
A paragraph
with two lines.

    indented code

> A block quote.
```

```html
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
```

And let *M* be the marker `1.`, and *N* = 2. Then rule #1 says that the following is an ordered list item with start number 1, and the same contents as *Ls*:

[Example 232](#example-232)

```markdown
1.  A paragraph
    with two lines.

        indented code

    > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

The most important thing to notice is that the position of the text after the list marker determines how much indentation is needed in subsequent blocks in the list item. If the list marker takes up two spaces, and there are three spaces between the list marker and the next [non-whitespace character](#non-whitespace-character), then blocks must be indented five spaces in order to fall under the list item.

Here are some examples showing how far content must be indented to be put under the list item:

[Example 233](#example-233)

```markdown
- one

 two
```

```html
<ul>
<li>one</li>
</ul>
<p>two</p>
```

[Example 234](#example-234)

```markdown
- one

  two
```

```html
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
```

[Example 235](#example-235)

```markdown
 -    one

     two
```

```html
<ul>
<li>one</li>
</ul>
<pre><code> two
</code></pre>
```

[Example 236](#example-236)

```markdown
 -    one

      two
```

```html
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
```

It is tempting to think of this in terms of columns: the continuation blocks must be indented at least to the column of the first [non-whitespace character](#non-whitespace-character) after the list marker. However, that is not quite right. The spaces after the list marker determine how much relative indentation is needed. Which column this indentation reaches will depend on how the list item is embedded in other constructions, as shown by this example:

[Example 237](#example-237)

```markdown
   > > 1.  one
>>
>>     two
```

```html
<blockquote>
<blockquote>
<ol>
<li>
<p>one</p>
<p>two</p>
</li>
</ol>
</blockquote>
</blockquote>
```

Here `two` occurs in the same column as the list marker `1.`, but is actually contained in the list item, because there is sufficient indentation after the last containing blockquote marker.

The converse is also possible. In the following example, the word `two` occurs far to the right of the initial text of the list item, `one`, but it is not considered part of the list item, because it is not indented far enough past the blockquote marker:

[Example 238](#example-238)

```markdown
>>- one
>>
  >  > two
```

```html
<blockquote>
<blockquote>
<ul>
<li>one</li>
</ul>
<p>two</p>
</blockquote>
</blockquote>
```

Note that at least one space is needed between the list marker and any following content, so these are not list items:

[Example 239](#example-239)

```markdown
-one

2.two
```

```html
<p>-one</p>
<p>2.two</p>
```

A list item may contain blocks that are separated by more than one blank line.

[Example 240](#example-240)

```markdown
- foo


  bar
```

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
```

A list item may contain any kind of block:

[Example 241](#example-241)

```markdown
1.  foo

    ```
    bar
    ```

    baz

    > bam
```

```html
<ol>
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
<p>baz</p>
<blockquote>
<p>bam</p>
</blockquote>
</li>
</ol>
```

A list item that contains an indented code block will preserve empty lines within the code block verbatim.

[Example 242](#example-242)

```markdown
- Foo

      bar


      baz
```

```html
<ul>
<li>
<p>Foo</p>
<pre><code>bar


baz
</code></pre>
</li>
</ul>
```

Note that ordered list start numbers must be nine digits or less:

[Example 243](#example-243)

```markdown
123456789. ok
```

```html
<ol start="123456789">
<li>ok</li>
</ol>
```

[Example 244](#example-244)

```markdown
1234567890. not ok
```

```html
<p>1234567890. not ok</p>
```

A start number may begin with 0s:

[Example 245](#example-245)

```markdown
0. ok
```

```html
<ol start="0">
<li>ok</li>
</ol>
```

[Example 246](#example-246)

```markdown
003. ok
```

```html
<ol start="3">
<li>ok</li>
</ol>
```

A start number may not be negative:

[Example 247](#example-247)

```markdown
-1. not ok
```

```html
<p>-1. not ok</p>
```

2.  **Item starting with indented code.** If a sequence of lines *Ls* constitute a sequence of blocks *Bs* starting with an indented code block, and *M* is a list marker of width *W* followed by one space, then the result of prepending *M* and the following space to the first line of *Ls*, and indenting subsequent lines of *Ls* by *W + 1* spaces, is a list item with *Bs* as its contents. If a line is empty, then it need not be indented. The type of the list item (bullet or ordered) is determined by the type of its list marker. If the list item is ordered, then it is also assigned a start number, based on the ordered list marker.

An indented code block will have to be indented four spaces beyond the edge of the region where text will be included in the list item. In the following case that is 6 spaces:

[Example 248](#example-248)

```markdown
- foo

      bar
```

```html
<ul>
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
</li>
</ul>
```

And in this case it is 11 spaces:

[Example 249](#example-249)

```markdown
  10.  foo

           bar
```

```html
<ol start="10">
<li>
<p>foo</p>
<pre><code>bar
</code></pre>
</li>
</ol>
```

If the *first* block in the list item is an indented code block, then by rule #2, the contents must be indented *one* space after the list marker:

[Example 250](#example-250)

```markdown
    indented code

paragraph

    more code
```

```html
<pre><code>indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
```

[Example 251](#example-251)

```markdown
1.     indented code

   paragraph

       more code
```

```html
<ol>
<li>
<pre><code>indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
</li>
</ol>
```

Note that an additional space indent is interpreted as space inside the code block:

[Example 252](#example-252)

```markdown
1.      indented code

   paragraph

       more code
```

```html
<ol>
<li>
<pre><code> indented code
</code></pre>
<p>paragraph</p>
<pre><code>more code
</code></pre>
</li>
</ol>
```

Note that rules #1 and #2 only apply to two cases: (a) cases in which the lines to be included in a list item begin with a [non-whitespace character](#non-whitespace-character), and (b) cases in which they begin with an indented code block. In a case like the following, where the first block begins with a three-space indent, the rules do not allow us to form a list item by indenting the whole thing and prepending a list marker:

[Example 253](#example-253)

```markdown
   foo

bar
```

```html
<p>foo</p>
<p>bar</p>
```

[Example 254](#example-254)

```markdown
-    foo

  bar
```

```html
<ul>
<li>foo</li>
</ul>
<p>bar</p>
```

This is not a significant restriction, because when a block begins with 1-3 spaces indent, the indentation can always be removed without a change in interpretation, allowing rule #1 to be applied. So, in the above case:

[Example 255](#example-255)

```markdown
-  foo

   bar
```

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
</li>
</ul>
```

3.  **Item starting with a blank line.** If a sequence of lines *Ls* starting with a single [blank line](#blank-line) constitute a (possibly empty) sequence of blocks *Bs*, not separated from each other by more than one blank line, and *M* is a list marker of width *W*, then the result of prepending *M* to the first line of *Ls*, and indenting subsequent lines of *Ls* by *W + 1* spaces, is a list item with *Bs* as its contents. If a line is empty, then it need not be indented. The type of the list item (bullet or ordered) is determined by the type of its list marker. If the list item is ordered, then it is also assigned a start number, based on the ordered list marker.

Here are some list items that start with a blank line but are not empty:

[Example 256](#example-256)

```markdown
-
  foo
-
  ```
  bar
  ```
-
      baz
```

```html
<ul>
<li>foo</li>
<li>
<pre><code>bar
</code></pre>
</li>
<li>
<pre><code>baz
</code></pre>
</li>
</ul>
```

When the list item starts with a blank line, the number of spaces following the list marker doesn’t change the required indentation:

[Example 257](#example-257)

```markdown
-   
  foo
```

```html
<ul>
<li>foo</li>
</ul>
```

A list item can begin with at most one blank line. In the following example, `foo` is not part of the list item:

[Example 258](#example-258)

```markdown
-

  foo
```

```html
<ul>
<li></li>
</ul>
<p>foo</p>
```

Here is an empty bullet list item:

[Example 259](#example-259)

```markdown
- foo
-
- bar
```

```html
<ul>
<li>foo</li>
<li></li>
<li>bar</li>
</ul>
```

It does not matter whether there are spaces following the [list marker](#list-marker):

[Example 260](#example-260)

```markdown
- foo
-   
- bar
```

```html
<ul>
<li>foo</li>
<li></li>
<li>bar</li>
</ul>
```

Here is an empty ordered list item:

[Example 261](#example-261)

```markdown
1. foo
2.
3. bar
```

```html
<ol>
<li>foo</li>
<li></li>
<li>bar</li>
</ol>
```

A list may start or end with an empty list item:

[Example 262](#example-262)

```markdown
*
```

```html
<ul>
<li></li>
</ul>
```

However, an empty list item cannot interrupt a paragraph:

[Example 263](#example-263)

```markdown
foo
*

foo
1.
```

```html
<p>foo
*</p>
<p>foo
1.</p>
```

4.  **Indentation.** If a sequence of lines *Ls* constitutes a list item according to rule #1, #2, or #3, then the result of indenting each line of *Ls* by 1-3 spaces (the same for each line) also constitutes a list item with the same contents and attributes. If a line is empty, then it need not be indented.

Indented one space:

[Example 264](#example-264)

```markdown
 1.  A paragraph
     with two lines.

         indented code

     > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

Indented two spaces:

[Example 265](#example-265)

```markdown
  1.  A paragraph
      with two lines.

          indented code

      > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

Indented three spaces:

[Example 266](#example-266)

```markdown
   1.  A paragraph
       with two lines.

           indented code

       > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

Four spaces indent gives a code block:

[Example 267](#example-267)

```markdown
    1.  A paragraph
        with two lines.

            indented code

        > A block quote.
```

```html
<pre><code>1.  A paragraph
    with two lines.

        indented code

    &gt; A block quote.
</code></pre>
```

5.  **Laziness.** If a string of lines *Ls* constitute a [list item](#list-items) with contents *Bs*, then the result of deleting some or all of the indentation from one or more lines in which the next [non-whitespace character](#non-whitespace-character) after the indentation is [paragraph continuation text](#paragraph-continuation-text) is a list item with the same contents and attributes. The unindented lines are called [lazy continuation line](#lazy-continuation-line)s.

Here is an example with [lazy continuation lines](#lazy-continuation-line):

[Example 268](#example-268)

```markdown
  1.  A paragraph
with two lines.

          indented code

      > A block quote.
```

```html
<ol>
<li>
<p>A paragraph
with two lines.</p>
<pre><code>indented code
</code></pre>
<blockquote>
<p>A block quote.</p>
</blockquote>
</li>
</ol>
```

Indentation can be partially deleted:

[Example 269](#example-269)

```markdown
  1.  A paragraph
    with two lines.
```

```html
<ol>
<li>A paragraph
with two lines.</li>
</ol>
```

These examples show how laziness can work in nested structures:

[Example 270](#example-270)

```markdown
> 1. > Blockquote
continued here.
```

```html
<blockquote>
<ol>
<li>
<blockquote>
<p>Blockquote
continued here.</p>
</blockquote>
</li>
</ol>
</blockquote>
```

[Example 271](#example-271)

```markdown
> 1. > Blockquote
> continued here.
```

```html
<blockquote>
<ol>
<li>
<blockquote>
<p>Blockquote
continued here.</p>
</blockquote>
</li>
</ol>
</blockquote>
```

6.  **That’s all.** Nothing that is not counted as a list item by rules #1–5 counts as a [list item](#list-items).

The rules for sublists follow from the general rules [above](#list-items). A sublist must be indented the same number of spaces a paragraph would need to be in order to be included in the list item.

So, in this case we need two spaces indent:

[Example 272](#example-272)

```markdown
- foo
  - bar
    - baz
      - boo
```

```html
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>baz
<ul>
<li>boo</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
```

One is not enough:

[Example 273](#example-273)

```markdown
- foo
 - bar
  - baz
   - boo
```

```html
<ul>
<li>foo</li>
<li>bar</li>
<li>baz</li>
<li>boo</li>
</ul>
```

Here we need four, because the list marker is wider:

[Example 274](#example-274)

```markdown
10) foo
    - bar
```

```html
<ol start="10">
<li>foo
<ul>
<li>bar</li>
</ul>
</li>
</ol>
```

Three is not enough:

[Example 275](#example-275)

```markdown
10) foo
   - bar
```

```html
<ol start="10">
<li>foo</li>
</ol>
<ul>
<li>bar</li>
</ul>
```

A list may be the first block in a list item:

[Example 276](#example-276)

```markdown
- - foo
```

```html
<ul>
<li>
<ul>
<li>foo</li>
</ul>
</li>
</ul>
```

[Example 277](#example-277)

```markdown
1. - 2. foo
```

```html
<ol>
<li>
<ul>
<li>
<ol start="2">
<li>foo</li>
</ol>
</li>
</ul>
</li>
</ol>
```

A list item can contain a heading:

[Example 278](#example-278)

```markdown
- # Foo
- Bar
  ---
  baz
```

```html
<ul>
<li>
<h1>Foo</h1>
</li>
<li>
<h2>Bar</h2>
baz</li>
</ul>
```

### 5.2.1Motivation

John Gruber’s Markdown spec says the following about list items:

1.  “List markers typically start at the left margin, but may be indented by up to three spaces. List markers must be followed by one or more spaces or a tab.”
    
2.  “To make lists look nice, you can wrap items with hanging indents…. But if you don’t want to, you don’t have to.”
    
3.  “List items may consist of multiple paragraphs. Each subsequent paragraph in a list item must be indented by either 4 spaces or one tab.”
    
4.  “It looks nice if you indent every line of the subsequent paragraphs, but here again, Markdown will allow you to be lazy.”
    
5.  “To put a blockquote within a list item, the blockquote’s `>` delimiters need to be indented.”
    
6.  “To put a code block within a list item, the code block needs to be indented twice — 8 spaces or two tabs.”
    

These rules specify that a paragraph under a list item must be indented four spaces (presumably, from the left margin, rather than the start of the list marker, but this is not said), and that code under a list item must be indented eight spaces instead of the usual four. They also say that a block quote must be indented, but not by how much; however, the example given has four spaces indentation. Although nothing is said about other kinds of block-level content, it is certainly reasonable to infer that *all* block elements under a list item, including other lists, must be indented four spaces. This principle has been called the *four-space rule*.

The four-space rule is clear and principled, and if the reference implementation `Markdown.pl` had followed it, it probably would have become the standard. However, `Markdown.pl` allowed paragraphs and sublists to start with only two spaces indentation, at least on the outer level. Worse, its behavior was inconsistent: a sublist of an outer-level list needed two spaces indentation, but a sublist of this sublist needed three spaces. It is not surprising, then, that different implementations of Markdown have developed very different rules for determining what comes under a list item. (Pandoc and python-Markdown, for example, stuck with Gruber’s syntax description and the four-space rule, while discount, redcarpet, marked, PHP Markdown, and others followed `Markdown.pl`’s behavior more closely.)

Unfortunately, given the divergences between implementations, there is no way to give a spec for list items that will be guaranteed not to break any existing documents. However, the spec given here should correctly handle lists formatted with either the four-space rule or the more forgiving `Markdown.pl` behavior, provided they are laid out in a way that is natural for a human to read.

The strategy here is to let the width and indentation of the list marker determine the indentation necessary for blocks to fall under the list item, rather than having a fixed and arbitrary number. The writer can think of the body of the list item as a unit which gets indented to the right enough to fit the list marker (and any indentation on the list marker). (The laziness rule, #5, then allows continuation lines to be unindented if needed.)

This rule is superior, we claim, to any rule requiring a fixed level of indentation from the margin. The four-space rule is clear but unnatural. It is quite unintuitive that

```markdown
- foo

  bar

  - baz
```

should be parsed as two lists with an intervening paragraph,

```html
<ul>
<li>foo</li>
</ul>
<p>bar</p>
<ul>
<li>baz</li>
</ul>
```

as the four-space rule demands, rather than a single list,

```html
<ul>
<li>
<p>foo</p>
<p>bar</p>
<ul>
<li>baz</li>
</ul>
</li>
</ul>
```

The choice of four spaces is arbitrary. It can be learned, but it is not likely to be guessed, and it trips up beginners regularly.

Would it help to adopt a two-space rule? The problem is that such a rule, together with the rule allowing 1–3 spaces indentation of the initial list marker, allows text that is indented *less than* the original list marker to be included in the list item. For example, `Markdown.pl` parses

```markdown
   - one

  two
```

as a single list item, with `two` a continuation paragraph:

```html
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
```

and similarly

```markdown
>   - one
>
>  two
```

as

```html
<blockquote>
<ul>
<li>
<p>one</p>
<p>two</p>
</li>
</ul>
</blockquote>
```

This is extremely unintuitive.

Rather than requiring a fixed indent from the margin, we could require a fixed indent (say, two spaces, or even one space) from the list marker (which may itself be indented). This proposal would remove the last anomaly discussed. Unlike the spec presented above, it would count the following as a list item with a subparagraph, even though the paragraph `bar` is not indented as far as the first paragraph `foo`:

```markdown
 10. foo

   bar  
```

Arguably this text does read like a list item with `bar` as a subparagraph, which may count in favor of the proposal. However, on this proposal indented code would have to be indented six spaces after the list marker. And this would break a lot of existing Markdown, which has the pattern:

```markdown
1.  foo

        indented code
```

where the code is indented eight spaces. The spec above, by contrast, will parse this text as expected, since the code block’s indentation is measured from the beginning of `foo`.

The one case that needs special treatment is a list item that *starts* with indented code. How much indentation is required in that case, since we don’t have a “first paragraph” to measure from? Rule #2 simply stipulates that in such cases, we require one space indentation from the list marker (and then the normal four spaces for the indented code). This will match the four-space rule in cases where the list marker plus its initial indentation takes four spaces (a common case), but diverge in other cases.

## [](#TOC)5.3Task list items (extension)

GFM enables the `tasklist` extension, where an additional processing step is performed on [list items](#list-items).

A [task list item](#task-list-item) is a [list item](#list-items) where the first block in it is a paragraph which begins with a [task list item marker](#task-list-item-marker) and at least one whitespace character before any other content.

A [task list item marker](#task-list-item-marker) consists of an optional number of spaces, a left bracket (`[`), either a whitespace character or the letter `x` in either lowercase or uppercase, and then a right bracket (`]`).

When rendered, the [task list item marker](#task-list-item-marker) is replaced with a semantic checkbox element; in an HTML output, this would be an `<input type="checkbox">` element.

If the character between the brackets is a whitespace character, the checkbox is unchecked. Otherwise, the checkbox is checked.

This spec does not define how the checkbox elements are interacted with: in practice, implementors are free to render the checkboxes as disabled or inmutable elements, or they may dynamically handle dynamic interactions (i.e. checking, unchecking) in the final rendered document.

[Example 279](#example-279)

```markdown
- [ ] foo
- [x] bar
```

```html
<ul>
<li><input disabled="" type="checkbox"> foo</li>
<li><input checked="" disabled="" type="checkbox"> bar</li>
</ul>
```

Task lists can be arbitrarily nested:

[Example 280](#example-280)

```markdown
- [x] foo
  - [ ] bar
  - [x] baz
- [ ] bim
```

```html
<ul>
<li><input checked="" disabled="" type="checkbox"> foo
<ul>
<li><input disabled="" type="checkbox"> bar</li>
<li><input checked="" disabled="" type="checkbox"> baz</li>
</ul>
</li>
<li><input disabled="" type="checkbox"> bim</li>
</ul>
```

## [](#TOC)5.4Lists

A [list](#list) is a sequence of one or more list items [of the same type](#of-the-same-type). The list items may be separated by any number of blank lines.

Two list items are [of the same type](#of-the-same-type) if they begin with a [list marker](#list-marker) of the same type. Two list markers are of the same type if (a) they are bullet list markers using the same character (`-`, `+`, or `*`) or (b) they are ordered list numbers with the same delimiter (either `.` or `)`).

A list is an [ordered list](#ordered-list) if its constituent list items begin with [ordered list markers](#ordered-list-marker), and a [bullet list](#bullet-list) if its constituent list items begin with [bullet list markers](#bullet-list-marker).

The [start number](#start-number) of an [ordered list](#ordered-list) is determined by the list number of its initial list item. The numbers of subsequent list items are disregarded.

A list is [loose](#loose) if any of its constituent list items are separated by blank lines, or if any of its constituent list items directly contain two block-level elements with a blank line between them. Otherwise a list is [tight](#tight). (The difference in HTML output is that paragraphs in a loose list are wrapped in `<p>` tags, while paragraphs in a tight list are not.)

Changing the bullet or ordered list delimiter starts a new list:

[Example 281](#example-281)

```markdown
- foo
- bar
+ baz
```

```html
<ul>
<li>foo</li>
<li>bar</li>
</ul>
<ul>
<li>baz</li>
</ul>
```

[Example 282](#example-282)

```markdown
1. foo
2. bar
3) baz
```

```html
<ol>
<li>foo</li>
<li>bar</li>
</ol>
<ol start="3">
<li>baz</li>
</ol>
```

In CommonMark, a list can interrupt a paragraph. That is, no blank line is needed to separate a paragraph from a following list:

[Example 283](#example-283)

```markdown
Foo
- bar
- baz
```

```html
<p>Foo</p>
<ul>
<li>bar</li>
<li>baz</li>
</ul>
```

`Markdown.pl` does not allow this, through fear of triggering a list via a numeral in a hard-wrapped line:

```markdown
The number of windows in my house is
14.  The number of doors is 6.
```

Oddly, though, `Markdown.pl` *does* allow a blockquote to interrupt a paragraph, even though the same considerations might apply.

In CommonMark, we do allow lists to interrupt paragraphs, for two reasons. First, it is natural and not uncommon for people to start lists without blank lines:

```markdown
I need to buy
- new shoes
- a coat
- a plane ticket
```

Second, we are attracted to a

> [principle of uniformity](#principle-of-uniformity): if a chunk of text has a certain meaning, it will continue to have the same meaning when put into a container block (such as a list item or blockquote).

(Indeed, the spec for [list items](#list-items) and [block quotes](#block-quotes) presupposes this principle.) This principle implies that if

```markdown
  * I need to buy
    - new shoes
    - a coat
    - a plane ticket
```

is a list item containing a paragraph followed by a nested sublist, as all Markdown implementations agree it is (though the paragraph may be rendered without `<p>` tags, since the list is “tight”), then

```markdown
I need to buy
- new shoes
- a coat
- a plane ticket
```

by itself should be a paragraph followed by a nested sublist.

Since it is well established Markdown practice to allow lists to interrupt paragraphs inside list items, the [principle of uniformity](#principle-of-uniformity) requires us to allow this outside list items as well. ([reStructuredText](http://docutils.sourceforge.net/rst.html) takes a different approach, requiring blank lines before lists even inside other list items.)

In order to solve of unwanted lists in paragraphs with hard-wrapped numerals, we allow only lists starting with `1` to interrupt paragraphs. Thus,

[Example 284](#example-284)

```markdown
The number of windows in my house is
14.  The number of doors is 6.
```

```html
<p>The number of windows in my house is
14.  The number of doors is 6.</p>
```

We may still get an unintended result in cases like

[Example 285](#example-285)

```markdown
The number of windows in my house is
1.  The number of doors is 6.
```

```html
<p>The number of windows in my house is</p>
<ol>
<li>The number of doors is 6.</li>
</ol>
```

but this rule should prevent most spurious list captures.

There can be any number of blank lines between items:

[Example 286](#example-286)

```markdown
- foo

- bar


- baz
```

```html
<ul>
<li>
<p>foo</p>
</li>
<li>
<p>bar</p>
</li>
<li>
<p>baz</p>
</li>
</ul>
```

[Example 287](#example-287)

```markdown
- foo
  - bar
    - baz


      bim
```

```html
<ul>
<li>foo
<ul>
<li>bar
<ul>
<li>
<p>baz</p>
<p>bim</p>
</li>
</ul>
</li>
</ul>
</li>
</ul>
```

To separate consecutive lists of the same type, or to separate a list from an indented code block that would otherwise be parsed as a subparagraph of the final list item, you can insert a blank HTML comment:

[Example 288](#example-288)

```markdown
- foo
- bar

<!-- -->

- baz
- bim
```

```html
<ul>
<li>foo</li>
<li>bar</li>
</ul>
<!-- -->
<ul>
<li>baz</li>
<li>bim</li>
</ul>
```

[Example 289](#example-289)

```markdown
-   foo

    notcode

-   foo

<!-- -->

    code
```

```html
<ul>
<li>
<p>foo</p>
<p>notcode</p>
</li>
<li>
<p>foo</p>
</li>
</ul>
<!-- -->
<pre><code>code
</code></pre>
```

List items need not be indented to the same level. The following list items will be treated as items at the same list level, since none is indented enough to belong to the previous list item:

[Example 290](#example-290)

```markdown
- a
 - b
  - c
   - d
  - e
 - f
- g
```

```html
<ul>
<li>a</li>
<li>b</li>
<li>c</li>
<li>d</li>
<li>e</li>
<li>f</li>
<li>g</li>
</ul>
```

[Example 291](#example-291)

```markdown
1. a

  2. b

   3. c
```

```html
<ol>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>c</p>
</li>
</ol>
```

Note, however, that list items may not be indented more than three spaces. Here `- e` is treated as a paragraph continuation line, because it is indented more than three spaces:

[Example 292](#example-292)

```markdown
- a
 - b
  - c
   - d
    - e
```

```html
<ul>
<li>a</li>
<li>b</li>
<li>c</li>
<li>d
- e</li>
</ul>
```

And here, `3. c` is treated as in indented code block, because it is indented four spaces and preceded by a blank line.

[Example 293](#example-293)

```markdown
1. a

  2. b

    3. c
```

```html
<ol>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
</ol>
<pre><code>3. c
</code></pre>
```

This is a loose list, because there is a blank line between two of the list items:

[Example 294](#example-294)

```markdown
- a
- b

- c
```

```html
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>c</p>
</li>
</ul>
```

So is this, with a empty second item:

[Example 295](#example-295)

```markdown
* a
*

* c
```

```html
<ul>
<li>
<p>a</p>
</li>
<li></li>
<li>
<p>c</p>
</li>
</ul>
```

These are loose lists, even though there is no space between the items, because one of the items directly contains two block-level elements with a blank line between them:

[Example 296](#example-296)

```markdown
- a
- b

  c
- d
```

```html
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
<p>c</p>
</li>
<li>
<p>d</p>
</li>
</ul>
```

[Example 297](#example-297)

```markdown
- a
- b

  [ref]: /url
- d
```

```html
<ul>
<li>
<p>a</p>
</li>
<li>
<p>b</p>
</li>
<li>
<p>d</p>
</li>
</ul>
```

This is a tight list, because the blank lines are in a code block:

[Example 298](#example-298)

```markdown
- a
- ```
  b


  ```
- c
```

```html
<ul>
<li>a</li>
<li>
<pre><code>b


</code></pre>
</li>
<li>c</li>
</ul>
```

This is a tight list, because the blank line is between two paragraphs of a sublist. So the sublist is loose while the outer list is tight:

[Example 299](#example-299)

```markdown
- a
  - b

    c
- d
```

```html
<ul>
<li>a
<ul>
<li>
<p>b</p>
<p>c</p>
</li>
</ul>
</li>
<li>d</li>
</ul>
```

This is a tight list, because the blank line is inside the block quote:

[Example 300](#example-300)

```markdown
* a
  > b
  >
* c
```

```html
<ul>
<li>a
<blockquote>
<p>b</p>
</blockquote>
</li>
<li>c</li>
</ul>
```

This list is tight, because the consecutive block elements are not separated by blank lines:

[Example 301](#example-301)

```markdown
- a
  > b
  ```
  c
  ```
- d
```

```html
<ul>
<li>a
<blockquote>
<p>b</p>
</blockquote>
<pre><code>c
</code></pre>
</li>
<li>d</li>
</ul>
```

A single-paragraph list is tight:

[Example 302](#example-302)

```markdown
- a
```

```html
<ul>
<li>a</li>
</ul>
```

[Example 303](#example-303)

```markdown
- a
  - b
```

```html
<ul>
<li>a
<ul>
<li>b</li>
</ul>
</li>
</ul>
```

This list is loose, because of the blank line between the two block elements in the list item:

[Example 304](#example-304)

```markdown
1. ```
   foo
   ```

   bar
```

```html
<ol>
<li>
<pre><code>foo
</code></pre>
<p>bar</p>
</li>
</ol>
```

Here the outer list is loose, the inner list tight:

[Example 305](#example-305)

```markdown
* foo
  * bar

  baz
```

```html
<ul>
<li>
<p>foo</p>
<ul>
<li>bar</li>
</ul>
<p>baz</p>
</li>
</ul>
```

[Example 306](#example-306)

```markdown
- a
  - b
  - c

- d
  - e
  - f
```

```html
<ul>
<li>
<p>a</p>
<ul>
<li>b</li>
<li>c</li>
</ul>
</li>
<li>
<p>d</p>
<ul>
<li>e</li>
<li>f</li>
</ul>
</li>
</ul>
```

---

> **Navigation:** [← 04-tables-extension.md](04-tables-extension.md) | [INDEX](INDEX.md) | [06-inlines.md →](06-inlines.md)
