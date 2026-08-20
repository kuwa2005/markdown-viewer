# GFM Spec — Section 4: Leaf Blocks (4.1–4.9)

> **Navigation:** [← 02-blocks-and-inlines.md](02-blocks-and-inlines.md) | [INDEX](INDEX.md) | [04-tables-extension.md →](04-tables-extension.md)

---

# 4Leaf blocks

This section describes the different kinds of leaf block that make up a Markdown document.

## [](#TOC)4.1Thematic breaks

A line consisting of 0-3 spaces of indentation, followed by a sequence of three or more matching `-`, `_`, or `*` characters, each followed optionally by any number of spaces or tabs, forms a [thematic break](#thematic-break).

[Example 13](#example-13)

```markdown
***
---
___
```

```html
<hr />
<hr />
<hr />
```

Wrong characters:

[Example 14](#example-14)

```markdown
+++
```

```html
<p>+++</p>
```

[Example 15](#example-15)

```markdown
===
```

```html
<p>===</p>
```

Not enough characters:

[Example 16](#example-16)

```markdown
--
**
__
```

```html
<p>--
**
__</p>
```

One to three spaces indent are allowed:

[Example 17](#example-17)

```markdown
 ***
  ***
   ***
```

```html
<hr />
<hr />
<hr />
```

Four spaces is too many:

[Example 18](#example-18)

```markdown
    ***
```

```html
<pre><code>***
</code></pre>
```

[Example 19](#example-19)

```markdown
Foo
    ***
```

```html
<p>Foo
***</p>
```

More than three characters may be used:

[Example 20](#example-20)

```markdown
_____________________________________
```

```html
<hr />
```

Spaces are allowed between the characters:

[Example 21](#example-21)

```markdown
 - - -
```

```html
<hr />
```

[Example 22](#example-22)

```markdown
 **  * ** * ** * **
```

```html
<hr />
```

[Example 23](#example-23)

```markdown
-     -      -      -
```

```html
<hr />
```

Spaces are allowed at the end:

[Example 24](#example-24)

```markdown
- - - -    
```

```html
<hr />
```

However, no other characters may occur in the line:

[Example 25](#example-25)

```markdown
_ _ _ _ a

a------

---a---
```

```html
<p>_ _ _ _ a</p>
<p>a------</p>
<p>---a---</p>
```

It is required that all of the [non-whitespace characters](#non-whitespace-character) be the same. So, this is not a thematic break:

[Example 26](#example-26)

```markdown
 *-*
```

```html
<p><em>-</em></p>
```

Thematic breaks do not need blank lines before or after:

[Example 27](#example-27)

```markdown
- foo
***
- bar
```

```html
<ul>
<li>foo</li>
</ul>
<hr />
<ul>
<li>bar</li>
</ul>
```

Thematic breaks can interrupt a paragraph:

[Example 28](#example-28)

```markdown
Foo
***
bar
```

```html
<p>Foo</p>
<hr />
<p>bar</p>
```

If a line of dashes that meets the above conditions for being a thematic break could also be interpreted as the underline of a [setext heading](#setext-heading), the interpretation as a [setext heading](#setext-heading) takes precedence. Thus, for example, this is a setext heading, not a paragraph followed by a thematic break:

[Example 29](#example-29)

```markdown
Foo
---
bar
```

```html
<h2>Foo</h2>
<p>bar</p>
```

When both a thematic break and a list item are possible interpretations of a line, the thematic break takes precedence:

[Example 30](#example-30)

```markdown
* Foo
* * *
* Bar
```

```html
<ul>
<li>Foo</li>
</ul>
<hr />
<ul>
<li>Bar</li>
</ul>
```

If you want a thematic break in a list item, use a different bullet:

[Example 31](#example-31)

```markdown
- Foo
- * * *
```

```html
<ul>
<li>Foo</li>
<li>
<hr />
</li>
</ul>
```

## [](#TOC)4.2ATX headings

An [ATX heading](#atx-heading) consists of a string of characters, parsed as inline content, between an opening sequence of 1–6 unescaped `#` characters and an optional closing sequence of any number of unescaped `#` characters. The opening sequence of `#` characters must be followed by a [space](#space) or by the end of line. The optional closing sequence of `#`s must be preceded by a [space](#space) and may be followed by spaces only. The opening `#` character may be indented 0-3 spaces. The raw contents of the heading are stripped of leading and trailing spaces before being parsed as inline content. The heading level is equal to the number of `#` characters in the opening sequence.

Simple headings:

[Example 32](#example-32)

```markdown
# foo
## foo
### foo
#### foo
##### foo
###### foo
```

```html
<h1>foo</h1>
<h2>foo</h2>
<h3>foo</h3>
<h4>foo</h4>
<h5>foo</h5>
<h6>foo</h6>
```

More than six `#` characters is not a heading:

[Example 33](#example-33)

```markdown
####### foo
```

```html
<p>####### foo</p>
```

At least one space is required between the `#` characters and the heading’s contents, unless the heading is empty. Note that many implementations currently do not require the space. However, the space was required by the [original ATX implementation](http://www.aaronsw.com/2002/atx/atx.py), and it helps prevent things like the following from being parsed as headings:

[Example 34](#example-34)

```markdown
#5 bolt

#hashtag
```

```html
<p>#5 bolt</p>
<p>#hashtag</p>
```

This is not a heading, because the first `#` is escaped:

[Example 35](#example-35)

```markdown
\## foo
```

```html
<p>## foo</p>
```

Contents are parsed as inlines:

[Example 36](#example-36)

```markdown
# foo *bar* \*baz\*
```

```html
<h1>foo <em>bar</em> *baz*</h1>
```

Leading and trailing [whitespace](#whitespace) is ignored in parsing inline content:

[Example 37](#example-37)

```markdown
#                  foo                     
```

```html
<h1>foo</h1>
```

One to three spaces indentation are allowed:

[Example 38](#example-38)

```markdown
 ### foo
  ## foo
   # foo
```

```html
<h3>foo</h3>
<h2>foo</h2>
<h1>foo</h1>
```

Four spaces are too much:

[Example 39](#example-39)

```markdown
    # foo
```

```html
<pre><code># foo
</code></pre>
```

[Example 40](#example-40)

```markdown
foo
    # bar
```

```html
<p>foo
# bar</p>
```

A closing sequence of `#` characters is optional:

[Example 41](#example-41)

```markdown
## foo ##
  ###   bar    ###
```

```html
<h2>foo</h2>
<h3>bar</h3>
```

It need not be the same length as the opening sequence:

[Example 42](#example-42)

```markdown
# foo ##################################
##### foo ##
```

```html
<h1>foo</h1>
<h5>foo</h5>
```

Spaces are allowed after the closing sequence:

[Example 43](#example-43)

```markdown
### foo ###     
```

```html
<h3>foo</h3>
```

A sequence of `#` characters with anything but [spaces](#space) following it is not a closing sequence, but counts as part of the contents of the heading:

[Example 44](#example-44)

```markdown
### foo ### b
```

```html
<h3>foo ### b</h3>
```

The closing sequence must be preceded by a space:

[Example 45](#example-45)

```markdown
# foo#
```

```html
<h1>foo#</h1>
```

Backslash-escaped `#` characters do not count as part of the closing sequence:

[Example 46](#example-46)

```markdown
### foo \###
## foo #\##
# foo \#
```

```html
<h3>foo ###</h3>
<h2>foo ###</h2>
<h1>foo #</h1>
```

ATX headings need not be separated from surrounding content by blank lines, and they can interrupt paragraphs:

[Example 47](#example-47)

```markdown
****
## foo
****
```

```html
<hr />
<h2>foo</h2>
<hr />
```

[Example 48](#example-48)

```markdown
Foo bar
# baz
Bar foo
```

```html
<p>Foo bar</p>
<h1>baz</h1>
<p>Bar foo</p>
```

ATX headings can be empty:

[Example 49](#example-49)

```markdown
## 
#
### ###
```

```html
<h2></h2>
<h1></h1>
<h3></h3>
```

## [](#TOC)4.3Setext headings

A [setext heading](#setext-heading) consists of one or more lines of text, each containing at least one [non-whitespace character](#non-whitespace-character), with no more than 3 spaces indentation, followed by a [setext heading underline](#setext-heading-underline). The lines of text must be such that, were they not followed by the setext heading underline, they would be interpreted as a paragraph: they cannot be interpretable as a [code fence](#code-fence), [ATX heading](#atx-headings), [block quote](#block-quotes), [thematic break](#thematic-break), [list item](#list-items), or [HTML block](#html-blocks).

A [setext heading underline](#setext-heading-underline) is a sequence of `=` characters or a sequence of `-` characters, with no more than 3 spaces indentation and any number of trailing spaces. If a line containing a single `-` can be interpreted as an empty [list items](#list-items), it should be interpreted this way and not as a [setext heading underline](#setext-heading-underline).

The heading is a level 1 heading if `=` characters are used in the [setext heading underline](#setext-heading-underline), and a level 2 heading if `-` characters are used. The contents of the heading are the result of parsing the preceding lines of text as CommonMark inline content.

In general, a setext heading need not be preceded or followed by a blank line. However, it cannot interrupt a paragraph, so when a setext heading comes after a paragraph, a blank line is needed between them.

Simple examples:

[Example 50](#example-50)

```markdown
Foo *bar*
=========

Foo *bar*
---------
```

```html
<h1>Foo <em>bar</em></h1>
<h2>Foo <em>bar</em></h2>
```

The content of the header may span more than one line:

[Example 51](#example-51)

```markdown
Foo *bar
baz*
====
```

```html
<h1>Foo <em>bar
baz</em></h1>
```

The contents are the result of parsing the headings’s raw content as inlines. The heading’s raw content is formed by concatenating the lines and removing initial and final [whitespace](#whitespace).

[Example 52](#example-52)

```markdown
  Foo *bar
baz*→
====
```

```html
<h1>Foo <em>bar
baz</em></h1>
```

The underlining can be any length:

[Example 53](#example-53)

```markdown
Foo
-------------------------

Foo
=
```

```html
<h2>Foo</h2>
<h1>Foo</h1>
```

The heading content can be indented up to three spaces, and need not line up with the underlining:

[Example 54](#example-54)

```markdown
   Foo
---

  Foo
-----

  Foo
  ===
```

```html
<h2>Foo</h2>
<h2>Foo</h2>
<h1>Foo</h1>
```

Four spaces indent is too much:

[Example 55](#example-55)

```markdown
    Foo
    ---

    Foo
---
```

```html
<pre><code>Foo
---

Foo
</code></pre>
<hr />
```

The setext heading underline can be indented up to three spaces, and may have trailing spaces:

[Example 56](#example-56)

```markdown
Foo
   ----      
```

```html
<h2>Foo</h2>
```

Four spaces is too much:

[Example 57](#example-57)

```markdown
Foo
    ---
```

```html
<p>Foo
---</p>
```

The setext heading underline cannot contain internal spaces:

[Example 58](#example-58)

```markdown
Foo
= =

Foo
--- -
```

```html
<p>Foo
= =</p>
<p>Foo</p>
<hr />
```

Trailing spaces in the content line do not cause a line break:

[Example 59](#example-59)

```markdown
Foo  
-----
```

```html
<h2>Foo</h2>
```

Nor does a backslash at the end:

[Example 60](#example-60)

```markdown
Foo\
----
```

```html
<h2>Foo\</h2>
```

Since indicators of block structure take precedence over indicators of inline structure, the following are setext headings:

[Example 61](#example-61)

```markdown
`Foo
----
`

<a title="a lot
---
of dashes"/>
```

```html
<h2>`Foo</h2>
<p>`</p>
<h2>&lt;a title=&quot;a lot</h2>
<p>of dashes&quot;/&gt;</p>
```

The setext heading underline cannot be a [lazy continuation line](#lazy-continuation-line) in a list item or block quote:

[Example 62](#example-62)

```markdown
> Foo
---
```

```html
<blockquote>
<p>Foo</p>
</blockquote>
<hr />
```

[Example 63](#example-63)

```markdown
> foo
bar
===
```

```html
<blockquote>
<p>foo
bar
===</p>
</blockquote>
```

[Example 64](#example-64)

```markdown
- Foo
---
```

```html
<ul>
<li>Foo</li>
</ul>
<hr />
```

A blank line is needed between a paragraph and a following setext heading, since otherwise the paragraph becomes part of the heading’s content:

[Example 65](#example-65)

```markdown
Foo
Bar
---
```

```html
<h2>Foo
Bar</h2>
```

But in general a blank line is not required before or after setext headings:

[Example 66](#example-66)

```markdown
---
Foo
---
Bar
---
Baz
```

```html
<hr />
<h2>Foo</h2>
<h2>Bar</h2>
<p>Baz</p>
```

Setext headings cannot be empty:

[Example 67](#example-67)

```markdown

====
```

```html
<p>====</p>
```

Setext heading text lines must not be interpretable as block constructs other than paragraphs. So, the line of dashes in these examples gets interpreted as a thematic break:

[Example 68](#example-68)

```markdown
---
---
```

```html
<hr />
<hr />
```

[Example 69](#example-69)

```markdown
- foo
-----
```

```html
<ul>
<li>foo</li>
</ul>
<hr />
```

[Example 70](#example-70)

```markdown
    foo
---
```

```html
<pre><code>foo
</code></pre>
<hr />
```

[Example 71](#example-71)

```markdown
> foo
-----
```

```html
<blockquote>
<p>foo</p>
</blockquote>
<hr />
```

If you want a heading with `> foo` as its literal text, you can use backslash escapes:

[Example 72](#example-72)

```markdown
\> foo
------
```

```html
<h2>&gt; foo</h2>
```

**Compatibility note:** Most existing Markdown implementations do not allow the text of setext headings to span multiple lines. But there is no consensus about how to interpret

```markdown
Foo
bar
---
baz
```

One can find four different interpretations:

1.  paragraph “Foo”, heading “bar”, paragraph “baz”
2.  paragraph “Foo bar”, thematic break, paragraph “baz”
3.  paragraph “Foo bar — baz”
4.  heading “Foo bar”, paragraph “baz”

We find interpretation 4 most natural, and interpretation 4 increases the expressive power of CommonMark, by allowing multiline headings. Authors who want interpretation 1 can put a blank line after the first paragraph:

[Example 73](#example-73)

```markdown
Foo

bar
---
baz
```

```html
<p>Foo</p>
<h2>bar</h2>
<p>baz</p>
```

Authors who want interpretation 2 can put blank lines around the thematic break,

[Example 74](#example-74)

```markdown
Foo
bar

---

baz
```

```html
<p>Foo
bar</p>
<hr />
<p>baz</p>
```

or use a thematic break that cannot count as a [setext heading underline](#setext-heading-underline), such as

[Example 75](#example-75)

```markdown
Foo
bar
* * *
baz
```

```html
<p>Foo
bar</p>
<hr />
<p>baz</p>
```

Authors who want interpretation 3 can use backslash escapes:

[Example 76](#example-76)

```markdown
Foo
bar
\---
baz
```

```html
<p>Foo
bar
---
baz</p>
```

## [](#TOC)4.4Indented code blocks

An [indented code block](#indented-code-block) is composed of one or more [indented chunks](#indented-chunk) separated by blank lines. An [indented chunk](#indented-chunk) is a sequence of non-blank lines, each indented four or more spaces. The contents of the code block are the literal contents of the lines, including trailing [line endings](#line-ending), minus four spaces of indentation. An indented code block has no [info string](#info-string).

An indented code block cannot interrupt a paragraph, so there must be a blank line between a paragraph and a following indented code block. (A blank line is not needed, however, between a code block and a following paragraph.)

[Example 77](#example-77)

```markdown
    a simple
      indented code block
```

```html
<pre><code>a simple
  indented code block
</code></pre>
```

If there is any ambiguity between an interpretation of indentation as a code block and as indicating that material belongs to a [list item](#list-items), the list item interpretation takes precedence:

[Example 78](#example-78)

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

[Example 79](#example-79)

```markdown
1.  foo

    - bar
```

```html
<ol>
<li>
<p>foo</p>
<ul>
<li>bar</li>
</ul>
</li>
</ol>
```

The contents of a code block are literal text, and do not get parsed as Markdown:

[Example 80](#example-80)

```markdown
    <a/>
    *hi*

    - one
```

```html
<pre><code>&lt;a/&gt;
*hi*

- one
</code></pre>
```

Here we have three chunks separated by blank lines:

[Example 81](#example-81)

```markdown
    chunk1

    chunk2
  
 
 
    chunk3
```

```html
<pre><code>chunk1

chunk2



chunk3
</code></pre>
```

Any initial spaces beyond four will be included in the content, even in interior blank lines:

[Example 82](#example-82)

```markdown
    chunk1
      
      chunk2
```

```html
<pre><code>chunk1
  
  chunk2
</code></pre>
```

An indented code block cannot interrupt a paragraph. (This allows hanging indents and the like.)

[Example 83](#example-83)

```markdown
Foo
    bar
```

```html
<p>Foo
bar</p>
```

However, any non-blank line with fewer than four leading spaces ends the code block immediately. So a paragraph may occur immediately after indented code:

[Example 84](#example-84)

```markdown
    foo
bar
```

```html
<pre><code>foo
</code></pre>
<p>bar</p>
```

And indented code can occur immediately before and after other kinds of blocks:

[Example 85](#example-85)

```markdown
# Heading
    foo
Heading
------
    foo
----
```

```html
<h1>Heading</h1>
<pre><code>foo
</code></pre>
<h2>Heading</h2>
<pre><code>foo
</code></pre>
<hr />
```

The first line can be indented more than four spaces:

[Example 86](#example-86)

```markdown
        foo
    bar
```

```html
<pre><code>    foo
bar
</code></pre>
```

Blank lines preceding or following an indented code block are not included in it:

[Example 87](#example-87)

```markdown

    
    foo
    
```

```html
<pre><code>foo
</code></pre>
```

Trailing spaces are included in the code block’s content:

[Example 88](#example-88)

```markdown
    foo  
```

```html
<pre><code>foo  
</code></pre>
```

## [](#TOC)4.5Fenced code blocks

A [code fence](#code-fence) is a sequence of at least three consecutive backtick characters (`` ` ``) or tildes (`~`). (Tildes and backticks cannot be mixed.) A [fenced code block](#fenced-code-block) begins with a code fence, indented no more than three spaces.

The line with the opening code fence may optionally contain some text following the code fence; this is trimmed of leading and trailing whitespace and called the [info string](#info-string). If the [info string](#info-string) comes after a backtick fence, it may not contain any backtick characters. (The reason for this restriction is that otherwise some inline code would be incorrectly interpreted as the beginning of a fenced code block.)

The content of the code block consists of all subsequent lines, until a closing [code fence](#code-fence) of the same type as the code block began with (backticks or tildes), and with at least as many backticks or tildes as the opening code fence. If the leading code fence is indented N spaces, then up to N spaces of indentation are removed from each line of the content (if present). (If a content line is not indented, it is preserved unchanged. If it is indented less than N spaces, all of the indentation is removed.)

The closing code fence may be indented up to three spaces, and may be followed only by spaces, which are ignored. If the end of the containing block (or document) is reached and no closing code fence has been found, the code block contains all of the lines after the opening code fence until the end of the containing block (or document). (An alternative spec would require backtracking in the event that a closing code fence is not found. But this makes parsing much less efficient, and there seems to be no real down side to the behavior described here.)

A fenced code block may interrupt a paragraph, and does not require a blank line either before or after.

The content of a code fence is treated as literal text, not parsed as inlines. The first word of the [info string](#info-string) is typically used to specify the language of the code sample, and rendered in the `class` attribute of the `code` tag. However, this spec does not mandate any particular treatment of the [info string](#info-string).

Here is a simple example with backticks:

[Example 89](#example-89)

````markdown
```
<
 >
```
````

```html
<pre><code>&lt;
 &gt;
</code></pre>
```

With tildes:

[Example 90](#example-90)

```markdown
~~~
<
 >
~~~
```

```html
<pre><code>&lt;
 &gt;
</code></pre>
```

Fewer than three backticks is not enough:

[Example 91](#example-91)

```markdown
``
foo
``
```

```html
<p><code>foo</code></p>
```

The closing code fence must use the same character as the opening fence:

[Example 92](#example-92)

````markdown
```
aaa
~~~
```
````

```html
<pre><code>aaa
~~~
</code></pre>
```

[Example 93](#example-93)

````markdown
~~~
aaa
```
~~~
````

````html
<pre><code>aaa
```
</code></pre>
````

The closing code fence must be at least as long as the opening fence:

[Example 94](#example-94)

```````markdown
````
aaa
```
``````
```````

````html
<pre><code>aaa
```
</code></pre>
````

[Example 95](#example-95)

```markdown
~~~~
aaa
~~~
~~~~
```

```html
<pre><code>aaa
~~~
</code></pre>
```

Unclosed code blocks are closed by the end of the document (or the enclosing [block quote](#block-quotes) or [list item](#list-items)):

[Example 96](#example-96)

````markdown
```
````

```html
<pre><code></code></pre>
```

[Example 97](#example-97)

``````markdown
`````

```
aaa
``````

````html
<pre><code>
```
aaa
</code></pre>
````

[Example 98](#example-98)

```markdown
> ```
> aaa

bbb
```

```html
<blockquote>
<pre><code>aaa
</code></pre>
</blockquote>
<p>bbb</p>
```

A code block can have all empty lines as its content:

[Example 99](#example-99)

````markdown
```

  
```
````

```html
<pre><code>
  
</code></pre>
```

A code block can be empty:

[Example 100](#example-100)

````markdown
```
```
````

```html
<pre><code></code></pre>
```

Fences can be indented. If the opening fence is indented, content lines will have equivalent opening indentation removed, if present:

[Example 101](#example-101)

````markdown
 ```
 aaa
aaa
```
````

```html
<pre><code>aaa
aaa
</code></pre>
```

[Example 102](#example-102)

```markdown
  ```
aaa
  aaa
aaa
  ```
```

```html
<pre><code>aaa
aaa
aaa
</code></pre>
```

[Example 103](#example-103)

```markdown
   ```
   aaa
    aaa
  aaa
   ```
```

```html
<pre><code>aaa
 aaa
aaa
</code></pre>
```

Four spaces indentation produces an indented code block:

[Example 104](#example-104)

```markdown
    ```
    aaa
    ```
```

````html
<pre><code>```
aaa
```
</code></pre>
````

Closing fences may be indented by 0-3 spaces, and their indentation need not match that of the opening fence:

[Example 105](#example-105)

````markdown
```
aaa
  ```
````

```html
<pre><code>aaa
</code></pre>
```

[Example 106](#example-106)

```markdown
   ```
aaa
  ```
```

```html
<pre><code>aaa
</code></pre>
```

This is not a closing fence, because it is indented 4 spaces:

[Example 107](#example-107)

````markdown
```
aaa
    ```
````

```html
<pre><code>aaa
    ```
</code></pre>
```

Code fences (opening and closing) cannot contain internal spaces:

[Example 108](#example-108)

````markdown
``` ```
aaa
````

```html
<p><code> </code>
aaa</p>
```

[Example 109](#example-109)

```markdown
~~~~~~
aaa
~~~ ~~
```

```html
<pre><code>aaa
~~~ ~~
</code></pre>
```

Fenced code blocks can interrupt paragraphs, and can be followed directly by paragraphs, without a blank line between:

[Example 110](#example-110)

````markdown
foo
```
bar
```
baz
````

```html
<p>foo</p>
<pre><code>bar
</code></pre>
<p>baz</p>
```

Other blocks can also occur before and after fenced code blocks without an intervening blank line:

[Example 111](#example-111)

```markdown
foo
---
~~~
bar
~~~
# baz
```

```html
<h2>foo</h2>
<pre><code>bar
</code></pre>
<h1>baz</h1>
```

An [info string](#info-string) can be provided after the opening code fence. Although this spec doesn’t mandate any particular treatment of the info string, the first word is typically used to specify the language of the code block. In HTML output, the language is normally indicated by adding a class to the `code` element consisting of `language-` followed by the language name.

[Example 112](#example-112)

````markdown
```ruby
def foo(x)
  return 3
end
```
````

```html
<pre><code class="language-ruby">def foo(x)
  return 3
end
</code></pre>
```

[Example 113](#example-113)

```markdown
~~~~    ruby startline=3 $%@#$
def foo(x)
  return 3
end
~~~~~~~
```

```html
<pre><code class="language-ruby">def foo(x)
  return 3
end
</code></pre>
```

[Example 114](#example-114)

`````markdown
````;
````
`````

```html
<pre><code class="language-;"></code></pre>
```

[Info strings](#info-string) for backtick code blocks cannot contain backticks:

[Example 115](#example-115)

````markdown
``` aa ```
foo
````

```html
<p><code>aa</code>
foo</p>
```

[Info strings](#info-string) for tilde code blocks can contain backticks and tildes:

[Example 116](#example-116)

```markdown
~~~ aa ``` ~~~
foo
~~~
```

```html
<pre><code class="language-aa">foo
</code></pre>
```

Closing code fences cannot have [info strings](#info-string):

[Example 117](#example-117)

````markdown
```
``` aaa
```
````

```html
<pre><code>``` aaa
</code></pre>
```

## [](#TOC)4.6HTML blocks

An [HTML block](#html-block) is a group of lines that is treated as raw HTML (and will not be escaped in HTML output).

There are seven kinds of [HTML block](#html-block), which can be defined by their start and end conditions. The block begins with a line that meets a [start condition](#start-condition) (after up to three spaces optional indentation). It ends with the first subsequent line that meets a matching [end condition](#end-condition), or the last line of the document, or the last line of the [container block](#container-blocks) containing the current HTML block, if no line is encountered that meets the [end condition](#end-condition). If the first line meets both the [start condition](#start-condition) and the [end condition](#end-condition), the block will contain just that line.

1.  **Start condition:** line begins with the string `<script`, `<pre`, or `<style` (case-insensitive), followed by whitespace, the string `>`, or the end of the line.  
    **End condition:** line contains an end tag `</script>`, `</pre>`, or `</style>` (case-insensitive; it need not match the start tag).
    
2.  **Start condition:** line begins with the string `<!--`.  
    **End condition:** line contains the string `-->`.
    
3.  **Start condition:** line begins with the string `<?`.  
    **End condition:** line contains the string `?>`.
    
4.  **Start condition:** line begins with the string `<!` followed by an uppercase ASCII letter.  
    **End condition:** line contains the character `>`.
    
5.  **Start condition:** line begins with the string `<![CDATA[`.  
    **End condition:** line contains the string `]]>`.
    
6.  **Start condition:** line begins the string `<` or `</` followed by one of the strings (case-insensitive) `address`, `article`, `aside`, `base`, `basefont`, `blockquote`, `body`, `caption`, `center`, `col`, `colgroup`, `dd`, `details`, `dialog`, `dir`, `div`, `dl`, `dt`, `fieldset`, `figcaption`, `figure`, `footer`, `form`, `frame`, `frameset`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `head`, `header`, `hr`, `html`, `iframe`, `legend`, `li`, `link`, `main`, `menu`, `menuitem`, `nav`, `noframes`, `ol`, `optgroup`, `option`, `p`, `param`, `section`, `source`, `summary`, `table`, `tbody`, `td`, `tfoot`, `th`, `thead`, `title`, `tr`, `track`, `ul`, followed by [whitespace](#whitespace), the end of the line, the string `>`, or the string `/>`.  
    **End condition:** line is followed by a [blank line](#blank-line).
    
7.  **Start condition:** line begins with a complete [open tag](#open-tag) (with any [tag name](#tag-name) other than `script`, `style`, or `pre`) or a complete [closing tag](#closing-tag), followed only by [whitespace](#whitespace) or the end of the line.  
    **End condition:** line is followed by a [blank line](#blank-line).
    

HTML blocks continue until they are closed by their appropriate [end condition](#end-condition), or the last line of the document or other [container block](#container-blocks). This means any HTML **within an HTML block** that might otherwise be recognised as a start condition will be ignored by the parser and passed through as-is, without changing the parser’s state.

For instance, `<pre>` within a HTML block started by `<table>` will not affect the parser state; as the HTML block was started in by start condition 6, it will end at any blank line. This can be surprising:

[Example 118](#example-118)

```markdown
<table><tr><td>
<pre>
**Hello**,

_world_.
</pre>
</td></tr></table>
```

```html
<table><tr><td>
<pre>
**Hello**,
<p><em>world</em>.
</pre></p>
</td></tr></table>
```

In this case, the HTML block is terminated by the newline — the `**Hello**` text remains verbatim — and regular parsing resumes, with a paragraph, emphasised `world` and inline and block HTML following.

All types of [HTML blocks](#html-blocks) except type 7 may interrupt a paragraph. Blocks of type 7 may not interrupt a paragraph. (This restriction is intended to prevent unwanted interpretation of long tags inside a wrapped paragraph as starting HTML blocks.)

Some simple examples follow. Here are some basic HTML blocks of type 6:

[Example 119](#example-119)

```markdown
<table>
  <tr>
    <td>
           hi
    </td>
  </tr>
</table>

okay.
```

```html
<table>
  <tr>
    <td>
           hi
    </td>
  </tr>
</table>
<p>okay.</p>
```

[Example 120](#example-120)

```markdown
 <div>
  *hello*
         <foo><a>
```

```html
 <div>
  *hello*
         <foo><a>
```

A block can also start with a closing tag:

[Example 121](#example-121)

```markdown
</div>
*foo*
```

```html
</div>
*foo*
```

Here we have two HTML blocks with a Markdown paragraph between them:

[Example 122](#example-122)

```markdown
<DIV CLASS="foo">

*Markdown*

</DIV>
```

```html
<DIV CLASS="foo">
<p><em>Markdown</em></p>
</DIV>
```

The tag on the first line can be partial, as long as it is split where there would be whitespace:

[Example 123](#example-123)

```markdown
<div id="foo"
  class="bar">
</div>
```

```html
<div id="foo"
  class="bar">
</div>
```

[Example 124](#example-124)

```markdown
<div id="foo" class="bar
  baz">
</div>
```

```html
<div id="foo" class="bar
  baz">
</div>
```

An open tag need not be closed:

[Example 125](#example-125)

```markdown
<div>
*foo*

*bar*
```

```html
<div>
*foo*
<p><em>bar</em></p>
```

A partial tag need not even be completed (garbage in, garbage out):

[Example 126](#example-126)

```markdown
<div id="foo"
*hi*
```

```html
<div id="foo"
*hi*
```

[Example 127](#example-127)

```markdown
<div class
foo
```

```html
<div class
foo
```

The initial tag doesn’t even need to be a valid tag, as long as it starts like one:

[Example 128](#example-128)

```markdown
<div *???-&&&-<---
*foo*
```

```html
<div *???-&&&-<---
*foo*
```

In type 6 blocks, the initial tag need not be on a line by itself:

[Example 129](#example-129)

```markdown
<div><a href="bar">*foo*</a></div>
```

```html
<div><a href="bar">*foo*</a></div>
```

[Example 130](#example-130)

```markdown
<table><tr><td>
foo
</td></tr></table>
```

```html
<table><tr><td>
foo
</td></tr></table>
```

Everything until the next blank line or end of document gets included in the HTML block. So, in the following example, what looks like a Markdown code block is actually part of the HTML block, which continues until a blank line or the end of the document is reached:

[Example 131](#example-131)

````markdown
<div></div>
``` c
int x = 33;
```
````

````html
<div></div>
``` c
int x = 33;
```
````

To start an [HTML block](#html-block) with a tag that is *not* in the list of block-level tags in (6), you must put the tag by itself on the first line (and it must be complete):

[Example 132](#example-132)

```markdown
<a href="foo">
*bar*
</a>
```

```html
<a href="foo">
*bar*
</a>
```

In type 7 blocks, the [tag name](#tag-name) can be anything:

[Example 133](#example-133)

```markdown
<Warning>
*bar*
</Warning>
```

```html
<Warning>
*bar*
</Warning>
```

[Example 134](#example-134)

```markdown
<i class="foo">
*bar*
</i>
```

```html
<i class="foo">
*bar*
</i>
```

[Example 135](#example-135)

```markdown
</ins>
*bar*
```

```html
</ins>
*bar*
```

These rules are designed to allow us to work with tags that can function as either block-level or inline-level tags. The `<del>` tag is a nice example. We can surround content with `<del>` tags in three different ways. In this case, we get a raw HTML block, because the `<del>` tag is on a line by itself:

[Example 136](#example-136)

```markdown
<del>
*foo*
</del>
```

```html
<del>
*foo*
</del>
```

In this case, we get a raw HTML block that just includes the `<del>` tag (because it ends with the following blank line). So the contents get interpreted as CommonMark:

[Example 137](#example-137)

```markdown
<del>

*foo*

</del>
```

```html
<del>
<p><em>foo</em></p>
</del>
```

Finally, in this case, the `<del>` tags are interpreted as [raw HTML](#raw-html) *inside* the CommonMark paragraph. (Because the tag is not on a line by itself, we get inline HTML rather than an [HTML block](#html-block).)

[Example 138](#example-138)

```markdown
<del>*foo*</del>
```

```html
<p><del><em>foo</em></del></p>
```

HTML tags designed to contain literal content (`script`, `style`, `pre`), comments, processing instructions, and declarations are treated somewhat differently. Instead of ending at the first blank line, these blocks end at the first line containing a corresponding end tag. As a result, these blocks can contain blank lines:

A pre tag (type 1):

[Example 139](#example-139)

```markdown
<pre language="haskell"><code>
import Text.HTML.TagSoup

main :: IO ()
main = print $ parseTags tags
</code></pre>
okay
```

```html
<pre language="haskell"><code>
import Text.HTML.TagSoup

main :: IO ()
main = print $ parseTags tags
</code></pre>
<p>okay</p>
```

A script tag (type 1):

[Example 140](#example-140)

```markdown
<script type="text/javascript">
// JavaScript example

document.getElementById("demo").innerHTML = "Hello JavaScript!";
</script>
okay
```

```html
<script type="text/javascript">
// JavaScript example

document.getElementById("demo").innerHTML = "Hello JavaScript!";
</script>
<p>okay</p>
```

A style tag (type 1):

[Example 141](#example-141)

```markdown
<style
  type="text/css">
h1 {color:red;}

p {color:blue;}
</style>
okay
```

```html
<style
  type="text/css">
h1 {color:red;}

p {color:blue;}
</style>
<p>okay</p>
```

If there is no matching end tag, the block will end at the end of the document (or the enclosing [block quote](#block-quotes) or [list item](#list-items)):

[Example 142](#example-142)

```markdown
<style
  type="text/css">

foo
```

```html
<style
  type="text/css">

foo
```

[Example 143](#example-143)

```markdown
> <div>
> foo

bar
```

```html
<blockquote>
<div>
foo
</blockquote>
<p>bar</p>
```

[Example 144](#example-144)

```markdown
- <div>
- foo
```

```html
<ul>
<li>
<div>
</li>
<li>foo</li>
</ul>
```

The end tag can occur on the same line as the start tag:

[Example 145](#example-145)

```markdown
<style>p{color:red;}</style>
*foo*
```

```html
<style>p{color:red;}</style>
<p><em>foo</em></p>
```

[Example 146](#example-146)

```markdown
<!-- foo -->*bar*
*baz*
```

```html
<!-- foo -->*bar*
<p><em>baz</em></p>
```

Note that anything on the last line after the end tag will be included in the [HTML block](#html-block):

[Example 147](#example-147)

```markdown
<script>
foo
</script>1. *bar*
```

```html
<script>
foo
</script>1. *bar*
```

A comment (type 2):

[Example 148](#example-148)

```markdown
<!-- Foo

bar
   baz -->
okay
```

```html
<!-- Foo

bar
   baz -->
<p>okay</p>
```

A processing instruction (type 3):

[Example 149](#example-149)

```markdown
<?php

  echo '>';

?>
okay
```

```html
<?php

  echo '>';

?>
<p>okay</p>
```

A declaration (type 4):

[Example 150](#example-150)

```markdown
<!DOCTYPE html>
```

```html
<!DOCTYPE html>
```

CDATA (type 5):

[Example 151](#example-151)

```markdown
<![CDATA[
function matchwo(a,b)
{
  if (a < b && a < 0) then {
    return 1;

  } else {

    return 0;
  }
}
]]>
okay
```

```html
<![CDATA[
function matchwo(a,b)
{
  if (a < b && a < 0) then {
    return 1;

  } else {

    return 0;
  }
}
]]>
<p>okay</p>
```

The opening tag can be indented 1-3 spaces, but not 4:

[Example 152](#example-152)

```markdown
  <!-- foo -->

    <!-- foo -->
```

```html
  <!-- foo -->
<pre><code>&lt;!-- foo --&gt;
</code></pre>
```

[Example 153](#example-153)

```markdown
  <div>

    <div>
```

```html
  <div>
<pre><code>&lt;div&gt;
</code></pre>
```

An HTML block of types 1–6 can interrupt a paragraph, and need not be preceded by a blank line.

[Example 154](#example-154)

```markdown
Foo
<div>
bar
</div>
```

```html
<p>Foo</p>
<div>
bar
</div>
```

However, a following blank line is needed, except at the end of a document, and except for blocks of types 1–5, [above](#html-block):

[Example 155](#example-155)

```markdown
<div>
bar
</div>
*foo*
```

```html
<div>
bar
</div>
*foo*
```

HTML blocks of type 7 cannot interrupt a paragraph:

[Example 156](#example-156)

```markdown
Foo
<a href="bar">
baz
```

```html
<p>Foo
<a href="bar">
baz</p>
```

This rule differs from John Gruber’s original Markdown syntax specification, which says:

> The only restrictions are that block-level HTML elements — e.g. `<div>`, `<table>`, `<pre>`, `<p>`, etc. — must be separated from surrounding content by blank lines, and the start and end tags of the block should not be indented with tabs or spaces.

In some ways Gruber’s rule is more restrictive than the one given here:

-   It requires that an HTML block be preceded by a blank line.
-   It does not allow the start tag to be indented.
-   It requires a matching end tag, which it also does not allow to be indented.

Most Markdown implementations (including some of Gruber’s own) do not respect all of these restrictions.

There is one respect, however, in which Gruber’s rule is more liberal than the one given here, since it allows blank lines to occur inside an HTML block. There are two reasons for disallowing them here. First, it removes the need to parse balanced tags, which is expensive and can require backtracking from the end of the document if no matching end tag is found. Second, it provides a very simple and flexible way of including Markdown content inside HTML tags: simply separate the Markdown from the HTML using blank lines:

Compare:

[Example 157](#example-157)

```markdown
<div>

*Emphasized* text.

</div>
```

```html
<div>
<p><em>Emphasized</em> text.</p>
</div>
```

[Example 158](#example-158)

```markdown
<div>
*Emphasized* text.
</div>
```

```html
<div>
*Emphasized* text.
</div>
```

Some Markdown implementations have adopted a convention of interpreting content inside tags as text if the open tag has the attribute `markdown=1`. The rule given above seems a simpler and more elegant way of achieving the same expressive power, which is also much simpler to parse.

The main potential drawback is that one can no longer paste HTML blocks into Markdown documents with 100% reliability. However, *in most cases* this will work fine, because the blank lines in HTML are usually followed by HTML block tags. For example:

[Example 159](#example-159)

```markdown
<table>

<tr>

<td>
Hi
</td>

</tr>

</table>
```

```html
<table>
<tr>
<td>
Hi
</td>
</tr>
</table>
```

There are problems, however, if the inner tags are indented *and* separated by spaces, as then they will be interpreted as an indented code block:

[Example 160](#example-160)

```markdown
<table>

  <tr>

    <td>
      Hi
    </td>

  </tr>

</table>
```

```html
<table>
  <tr>
<pre><code>&lt;td&gt;
  Hi
&lt;/td&gt;
</code></pre>
  </tr>
</table>
```

Fortunately, blank lines are usually not necessary and can be deleted. The exception is inside `<pre>` tags, but as described [above](#html-blocks), raw HTML blocks starting with `<pre>` *can* contain blank lines.

## [](#TOC)4.7Link reference definitions

A [link reference definition](#link-reference-definition) consists of a [link label](#link-label), indented up to three spaces, followed by a colon (`:`), optional [whitespace](#whitespace) (including up to one [line ending](#line-ending)), a [link destination](#link-destination), optional [whitespace](#whitespace) (including up to one [line ending](#line-ending)), and an optional [link title](#link-title), which if it is present must be separated from the [link destination](#link-destination) by [whitespace](#whitespace). No further [non-whitespace characters](#non-whitespace-character) may occur on the line.

A [link reference definition](#link-reference-definition) does not correspond to a structural element of a document. Instead, it defines a label which can be used in [reference links](#reference-link) and reference-style [images](#images) elsewhere in the document. [Link reference definitions](#link-reference-definitions) can come either before or after the links that use them.

[Example 161](#example-161)

```markdown
[foo]: /url "title"

[foo]
```

```html
<p><a href="/url" title="title">foo</a></p>
```

[Example 162](#example-162)

```markdown
   [foo]: 
      /url  
           'the title'  

[foo]
```

```html
<p><a href="/url" title="the title">foo</a></p>
```

[Example 163](#example-163)

```markdown
[Foo*bar\]]:my_(url) 'title (with parens)'

[Foo*bar\]]
```

```html
<p><a href="my_(url)" title="title (with parens)">Foo*bar]</a></p>
```

[Example 164](#example-164)

```markdown
[Foo bar]:
<my url>
'title'

[Foo bar]
```

```html
<p><a href="my%20url" title="title">Foo bar</a></p>
```

The title may extend over multiple lines:

[Example 165](#example-165)

```markdown
[foo]: /url '
title
line1
line2
'

[foo]
```

```html
<p><a href="/url" title="
title
line1
line2
">foo</a></p>
```

However, it may not contain a [blank line](#blank-line):

[Example 166](#example-166)

```markdown
[foo]: /url 'title

with blank line'

[foo]
```

```html
<p>[foo]: /url 'title</p>
<p>with blank line'</p>
<p>[foo]</p>
```

The title may be omitted:

[Example 167](#example-167)

```markdown
[foo]:
/url

[foo]
```

```html
<p><a href="/url">foo</a></p>
```

The link destination may not be omitted:

[Example 168](#example-168)

```markdown
[foo]:

[foo]
```

```html
<p>[foo]:</p>
<p>[foo]</p>
```

However, an empty link destination may be specified using angle brackets:

[Example 169](#example-169)

```markdown
[foo]: <>

[foo]
```

```html
<p><a href="">foo</a></p>
```

The title must be separated from the link destination by whitespace:

[Example 170](#example-170)

```markdown
[foo]: <bar>(baz)

[foo]
```

```html
<p>[foo]: <bar>(baz)</p>
<p>[foo]</p>
```

Both title and destination can contain backslash escapes and literal backslashes:

[Example 171](#example-171)

```markdown
[foo]: /url\bar\*baz "foo\"bar\baz"

[foo]
```

```html
<p><a href="/url%5Cbar*baz" title="foo&quot;bar\baz">foo</a></p>
```

A link can come before its corresponding definition:

[Example 172](#example-172)

```markdown
[foo]

[foo]: url
```

```html
<p><a href="url">foo</a></p>
```

If there are several matching definitions, the first one takes precedence:

[Example 173](#example-173)

```markdown
[foo]

[foo]: first
[foo]: second
```

```html
<p><a href="first">foo</a></p>
```

As noted in the section on [Links](#links), matching of labels is case-insensitive (see [matches](#matches)).

[Example 174](#example-174)

```markdown
[FOO]: /url

[Foo]
```

```html
<p><a href="/url">Foo</a></p>
```

[Example 175](#example-175)

```markdown
[ΑΓΩ]: /φου

[αγω]
```

```html
<p><a href="/%CF%86%CE%BF%CF%85">αγω</a></p>
```

Here is a link reference definition with no corresponding link. It contributes nothing to the document.

[Example 176](#example-176)

```markdown
[foo]: /url
```

Here is another one:

[Example 177](#example-177)

```markdown
[
foo
]: /url
bar
```

```html
<p>bar</p>
```

This is not a link reference definition, because there are [non-whitespace characters](#non-whitespace-character) after the title:

[Example 178](#example-178)

```markdown
[foo]: /url "title" ok
```

```html
<p>[foo]: /url &quot;title&quot; ok</p>
```

This is a link reference definition, but it has no title:

[Example 179](#example-179)

```markdown
[foo]: /url
"title" ok
```

```html
<p>&quot;title&quot; ok</p>
```

This is not a link reference definition, because it is indented four spaces:

[Example 180](#example-180)

```markdown
    [foo]: /url "title"

[foo]
```

```html
<pre><code>[foo]: /url &quot;title&quot;
</code></pre>
<p>[foo]</p>
```

This is not a link reference definition, because it occurs inside a code block:

[Example 181](#example-181)

````markdown
```
[foo]: /url
```

[foo]
````

```html
<pre><code>[foo]: /url
</code></pre>
<p>[foo]</p>
```

A [link reference definition](#link-reference-definition) cannot interrupt a paragraph.

[Example 182](#example-182)

```markdown
Foo
[bar]: /baz

[bar]
```

```html
<p>Foo
[bar]: /baz</p>
<p>[bar]</p>
```

However, it can directly follow other block elements, such as headings and thematic breaks, and it need not be followed by a blank line.

[Example 183](#example-183)

```markdown
# [Foo]
[foo]: /url
> bar
```

```html
<h1><a href="/url">Foo</a></h1>
<blockquote>
<p>bar</p>
</blockquote>
```

[Example 184](#example-184)

```markdown
[foo]: /url
bar
===
[foo]
```

```html
<h1>bar</h1>
<p><a href="/url">foo</a></p>
```

[Example 185](#example-185)

```markdown
[foo]: /url
===
[foo]
```

```html
<p>===
<a href="/url">foo</a></p>
```

Several [link reference definitions](#link-reference-definitions) can occur one after another, without intervening blank lines.

[Example 186](#example-186)

```markdown
[foo]: /foo-url "foo"
[bar]: /bar-url
  "bar"
[baz]: /baz-url

[foo],
[bar],
[baz]
```

```html
<p><a href="/foo-url" title="foo">foo</a>,
<a href="/bar-url" title="bar">bar</a>,
<a href="/baz-url">baz</a></p>
```

[Link reference definitions](#link-reference-definitions) can occur inside block containers, like lists and block quotations. They affect the entire document, not just the container in which they are defined:

[Example 187](#example-187)

```markdown
[foo]

> [foo]: /url
```

```html
<p><a href="/url">foo</a></p>
<blockquote>
</blockquote>
```

Whether something is a [link reference definition](#link-reference-definition) is independent of whether the link reference it defines is used in the document. Thus, for example, the following document contains just a link reference definition, and no visible content:

[Example 188](#example-188)

```markdown
[foo]: /url
```

## [](#TOC)4.8Paragraphs

A sequence of non-blank lines that cannot be interpreted as other kinds of blocks forms a [paragraph](#paragraph). The contents of the paragraph are the result of parsing the paragraph’s raw content as inlines. The paragraph’s raw content is formed by concatenating the lines and removing initial and final [whitespace](#whitespace).

A simple example with two paragraphs:

[Example 189](#example-189)

```markdown
aaa

bbb
```

```html
<p>aaa</p>
<p>bbb</p>
```

Paragraphs can contain multiple lines, but no blank lines:

[Example 190](#example-190)

```markdown
aaa
bbb

ccc
ddd
```

```html
<p>aaa
bbb</p>
<p>ccc
ddd</p>
```

Multiple blank lines between paragraph have no effect:

[Example 191](#example-191)

```markdown
aaa


bbb
```

```html
<p>aaa</p>
<p>bbb</p>
```

Leading spaces are skipped:

[Example 192](#example-192)

```markdown
  aaa
 bbb
```

```html
<p>aaa
bbb</p>
```

Lines after the first may be indented any amount, since indented code blocks cannot interrupt paragraphs.

[Example 193](#example-193)

```markdown
aaa
             bbb
                                       ccc
```

```html
<p>aaa
bbb
ccc</p>
```

However, the first line may be indented at most three spaces, or an indented code block will be triggered:

[Example 194](#example-194)

```markdown
   aaa
bbb
```

```html
<p>aaa
bbb</p>
```

[Example 195](#example-195)

```markdown
    aaa
bbb
```

```html
<pre><code>aaa
</code></pre>
<p>bbb</p>
```

Final spaces are stripped before inline parsing, so a paragraph that ends with two or more spaces will not end with a [hard line break](#hard-line-break):

[Example 196](#example-196)

```markdown
aaa     
bbb     
```

```html
<p>aaa<br />
bbb</p>
```

## [](#TOC)4.9Blank lines

[Blank lines](#blank-line) between block-level elements are ignored, except for the role they play in determining whether a [list](#list) is [tight](#tight) or [loose](#loose).

Blank lines at the beginning and end of the document are also ignored.

[Example 197](#example-197)

```markdown
  

aaa
  

# aaa

  
```

```html
<p>aaa</p>
<h1>aaa</h1>
```

---

> **Navigation:** [← 02-blocks-and-inlines.md](02-blocks-and-inlines.md) | [INDEX](INDEX.md) | [04-tables-extension.md →](04-tables-extension.md)
