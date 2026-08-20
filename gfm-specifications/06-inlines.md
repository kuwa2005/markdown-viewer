# GFM Spec — Section 6: Inlines

> **Navigation:** [← 05-container-blocks.md](05-container-blocks.md) | [INDEX](INDEX.md) | [07-appendix-parsing-strategy.md →](07-appendix-parsing-strategy.md)

---

# 6Inlines

Inlines are parsed sequentially from the beginning of the character stream to the end (left to right, in left-to-right languages). Thus, for example, in

[Example 307](#example-307)

```markdown
`hi`lo`
```

```html
<p><code>hi</code>lo`</p>
```

`hi` is parsed as code, leaving the backtick at the end as a literal backtick.

## [](#TOC)6.1Backslash escapes

Any ASCII punctuation character may be backslash-escaped:

[Example 308](#example-308)

```markdown
\!\"\#\$\%\&\'\(\)\*\+\,\-\.\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~
```

```html
<p>!&quot;#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~</p>
```

Backslashes before other characters are treated as literal backslashes:

[Example 309](#example-309)

```markdown
\→\A\a\ \3\φ\«
```

```html
<p>\→\A\a\ \3\φ\«</p>
```

Escaped characters are treated as regular characters and do not have their usual Markdown meanings:

[Example 310](#example-310)

```markdown
\*not emphasized*
\<br/> not a tag
\[not a link](/foo)
\`not code`
1\. not a list
\* not a list
\# not a heading
\[foo]: /url "not a reference"
\&ouml; not a character entity
```

```html
<p>*not emphasized*
&lt;br/&gt; not a tag
[not a link](/foo)
`not code`
1. not a list
* not a list
# not a heading
[foo]: /url &quot;not a reference&quot;
&amp;ouml; not a character entity</p>
```

If a backslash is itself escaped, the following character is not:

[Example 311](#example-311)

```markdown
\\*emphasis*
```

```html
<p>\<em>emphasis</em></p>
```

A backslash at the end of the line is a [hard line break](#hard-line-break):

[Example 312](#example-312)

```markdown
foo\
bar
```

```html
<p>foo<br />
bar</p>
```

Backslash escapes do not work in code blocks, code spans, autolinks, or raw HTML:

[Example 313](#example-313)

```markdown
`` \[\` ``
```

```html
<p><code>\[\`</code></p>
```

[Example 314](#example-314)

```markdown
    \[\]
```

```html
<pre><code>\[\]
</code></pre>
```

[Example 315](#example-315)

```markdown
~~~
\[\]
~~~
```

```html
<pre><code>\[\]
</code></pre>
```

[Example 316](#example-316)

```markdown
<http://example.com?find=\*>
```

```html
<p><a href="http://example.com?find=%5C*">http://example.com?find=\*</a></p>
```

[Example 317](#example-317)

```markdown
<a href="/bar\/)">
```

```html
<a href="/bar\/)">
```

But they work in all other contexts, including URLs and link titles, link references, and [info strings](#info-string) in [fenced code blocks](#fenced-code-blocks):

[Example 318](#example-318)

```markdown
[foo](/bar\* "ti\*tle")
```

```html
<p><a href="/bar*" title="ti*tle">foo</a></p>
```

[Example 319](#example-319)

```markdown
[foo]

[foo]: /bar\* "ti\*tle"
```

```html
<p><a href="/bar*" title="ti*tle">foo</a></p>
```

[Example 320](#example-320)

````markdown
``` foo\+bar
foo
```
````

```html
<pre><code class="language-foo+bar">foo
</code></pre>
```

## [](#TOC)6.2Entity and numeric character references

Valid HTML entity references and numeric character references can be used in place of the corresponding Unicode character, with the following exceptions:

-   Entity and character references are not recognized in code blocks and code spans.
    
-   Entity and character references cannot stand in place of special characters that define structural elements in CommonMark. For example, although `&#42;` can be used in place of a literal `*` character, `&#42;` cannot replace `*` in emphasis delimiters, bullet list markers, or thematic breaks.
    

Conforming CommonMark parsers need not store information about whether a particular character was represented in the source using a Unicode character or an entity reference.

[Entity references](#entity-references) consist of `&` + any of the valid HTML5 entity names + `;`. The document [https://html.spec.whatwg.org/multipage/entities.json](https://html.spec.whatwg.org/multipage/entities.json) is used as an authoritative source for the valid entity references and their corresponding code points.

[Example 321](#example-321)

```markdown
&nbsp; &amp; &copy; &AElig; &Dcaron;
&frac34; &HilbertSpace; &DifferentialD;
&ClockwiseContourIntegral; &ngE;
```

```html
<p>  &amp; © Æ Ď
¾ ℋ ⅆ
∲ ≧̸</p>
```

[Decimal numeric character references](#decimal-numeric-character-references) consist of `&#` + a string of 1–7 arabic digits + `;`. A numeric character reference is parsed as the corresponding Unicode character. Invalid Unicode code points will be replaced by the REPLACEMENT CHARACTER (`U+FFFD`). For security reasons, the code point `U+0000` will also be replaced by `U+FFFD`.

[Example 322](#example-322)

```markdown
&#35; &#1234; &#992; &#0;
```

```html
<p># Ӓ Ϡ �</p>
```

[Hexadecimal numeric character references](#hexadecimal-numeric-character-references) consist of `&#` + either `X` or `x` + a string of 1-6 hexadecimal digits + `;`. They too are parsed as the corresponding Unicode character (this time specified with a hexadecimal numeral instead of decimal).

[Example 323](#example-323)

```markdown
&#X22; &#XD06; &#xcab;
```

```html
<p>&quot; ആ ಫ</p>
```

Here are some nonentities:

[Example 324](#example-324)

```markdown
&nbsp &x; &#; &#x;
&#87654321;
&#abcdef0;
&ThisIsNotDefined; &hi?;
```

```html
<p>&amp;nbsp &amp;x; &amp;#; &amp;#x;
&amp;#87654321;
&amp;#abcdef0;
&amp;ThisIsNotDefined; &amp;hi?;</p>
```

Although HTML5 does accept some entity references without a trailing semicolon (such as `&copy`), these are not recognized here, because it makes the grammar too ambiguous:

[Example 325](#example-325)

```markdown
&copy
```

```html
<p>&amp;copy</p>
```

Strings that are not on the list of HTML5 named entities are not recognized as entity references either:

[Example 326](#example-326)

```markdown
&MadeUpEntity;
```

```html
<p>&amp;MadeUpEntity;</p>
```

Entity and numeric character references are recognized in any context besides code spans or code blocks, including URLs, [link titles](#link-title), and [fenced code block](#fenced-code-block) [info strings](#info-string):

[Example 327](#example-327)

```markdown
<a href="&ouml;&ouml;.html">
```

```html
<a href="&ouml;&ouml;.html">
```

[Example 328](#example-328)

```markdown
[foo](/f&ouml;&ouml; "f&ouml;&ouml;")
```

```html
<p><a href="/f%C3%B6%C3%B6" title="föö">foo</a></p>
```

[Example 329](#example-329)

```markdown
[foo]

[foo]: /f&ouml;&ouml; "f&ouml;&ouml;"
```

```html
<p><a href="/f%C3%B6%C3%B6" title="föö">foo</a></p>
```

[Example 330](#example-330)

````markdown
``` f&ouml;&ouml;
foo
```
````

```html
<pre><code class="language-föö">foo
</code></pre>
```

Entity and numeric character references are treated as literal text in code spans and code blocks:

[Example 331](#example-331)

```markdown
`f&ouml;&ouml;`
```

```html
<p><code>f&amp;ouml;&amp;ouml;</code></p>
```

[Example 332](#example-332)

```markdown
    f&ouml;f&ouml;
```

```html
<pre><code>f&amp;ouml;f&amp;ouml;
</code></pre>
```

Entity and numeric character references cannot be used in place of symbols indicating structure in CommonMark documents.

[Example 333](#example-333)

```markdown
&#42;foo&#42;
*foo*
```

```html
<p>*foo*
<em>foo</em></p>
```

[Example 334](#example-334)

```markdown
&#42; foo

* foo
```

```html
<p>* foo</p>
<ul>
<li>foo</li>
</ul>
```

[Example 335](#example-335)

```markdown
foo&#10;&#10;bar
```

```html
<p>foo

bar</p>
```

[Example 336](#example-336)

```markdown
&#9;foo
```

```html
<p>→foo</p>
```

[Example 337](#example-337)

```markdown
[a](url &quot;tit&quot;)
```

```html
<p>[a](url &quot;tit&quot;)</p>
```

## [](#TOC)6.3Code spans

A [backtick string](#backtick-string) is a string of one or more backtick characters (`` ` ``) that is neither preceded nor followed by a backtick.

A [code span](#code-span) begins with a backtick string and ends with a backtick string of equal length. The contents of the code span are the characters between the two backtick strings, normalized in the following ways:

-   First, [line endings](#line-ending) are converted to [spaces](#space).
-   If the resulting string both begins *and* ends with a [space](#space) character, but does not consist entirely of [space](#space) characters, a single [space](#space) character is removed from the front and back. This allows you to include code that begins or ends with backtick characters, which must be separated by whitespace from the opening or closing backtick strings.

This is a simple code span:

[Example 338](#example-338)

```markdown
`foo`
```

```html
<p><code>foo</code></p>
```

Here two backticks are used, because the code contains a backtick. This example also illustrates stripping of a single leading and trailing space:

[Example 339](#example-339)

```markdown
`` foo ` bar ``
```

```html
<p><code>foo ` bar</code></p>
```

This example shows the motivation for stripping leading and trailing spaces:

[Example 340](#example-340)

```markdown
` `` `
```

```html
<p><code>``</code></p>
```

Note that only *one* space is stripped:

[Example 341](#example-341)

```markdown
`  ``  `
```

```html
<p><code> `` </code></p>
```

The stripping only happens if the space is on both sides of the string:

[Example 342](#example-342)

```markdown
` a`
```

```html
<p><code> a</code></p>
```

Only [spaces](#space), and not [unicode whitespace](#unicode-whitespace) in general, are stripped in this way:

[Example 343](#example-343)

```markdown
` b `
```

```html
<p><code> b </code></p>
```

No stripping occurs if the code span contains only spaces:

[Example 344](#example-344)

```markdown
` `
`  `
```

```html
<p><code> </code>
<code>  </code></p>
```

[Line endings](#line-ending) are treated like spaces:

[Example 345](#example-345)

```markdown
``
foo
bar  
baz
``
```

```html
<p><code>foo bar   baz</code></p>
```

[Example 346](#example-346)

```markdown
``
foo 
``
```

```html
<p><code>foo </code></p>
```

Interior spaces are not collapsed:

[Example 347](#example-347)

```markdown
`foo   bar 
baz`
```

```html
<p><code>foo   bar  baz</code></p>
```

Note that browsers will typically collapse consecutive spaces when rendering `<code>` elements, so it is recommended that the following CSS be used:

```
code{white-space: pre-wrap;}
```

Note that backslash escapes do not work in code spans. All backslashes are treated literally:

[Example 348](#example-348)

```markdown
`foo\`bar`
```

```html
<p><code>foo\</code>bar`</p>
```

Backslash escapes are never needed, because one can always choose a string of *n* backtick characters as delimiters, where the code does not contain any strings of exactly *n* backtick characters.

[Example 349](#example-349)

```markdown
``foo`bar``
```

```html
<p><code>foo`bar</code></p>
```

[Example 350](#example-350)

```markdown
` foo `` bar `
```

```html
<p><code>foo `` bar</code></p>
```

Code span backticks have higher precedence than any other inline constructs except HTML tags and autolinks. Thus, for example, this is not parsed as emphasized text, since the second `*` is part of a code span:

[Example 351](#example-351)

```markdown
*foo`*`
```

```html
<p>*foo<code>*</code></p>
```

And this is not parsed as a link:

[Example 352](#example-352)

```markdown
[not a `link](/foo`)
```

```html
<p>[not a <code>link](/foo</code>)</p>
```

Code spans, HTML tags, and autolinks have the same precedence. Thus, this is code:

[Example 353](#example-353)

```markdown
`<a href="`">`
```

```html
<p><code>&lt;a href=&quot;</code>&quot;&gt;`</p>
```

But this is an HTML tag:

[Example 354](#example-354)

```markdown
<a href="`">`
```

```html
<p><a href="`">`</p>
```

And this is code:

[Example 355](#example-355)

```markdown
`<http://foo.bar.`baz>`
```

```html
<p><code>&lt;http://foo.bar.</code>baz&gt;`</p>
```

But this is an autolink:

[Example 356](#example-356)

```markdown
<http://foo.bar.`baz>`
```

```html
<p><a href="http://foo.bar.%60baz">http://foo.bar.`baz</a>`</p>
```

When a backtick string is not closed by a matching backtick string, we just have literal backticks:

[Example 357](#example-357)

````markdown
```foo``
````

```html
<p>```foo``</p>
```

[Example 358](#example-358)

```markdown
`foo
```

```html
<p>`foo</p>
```

The following case also illustrates the need for opening and closing backtick strings to be equal in length:

[Example 359](#example-359)

```markdown
`foo``bar``
```

```html
<p>`foo<code>bar</code></p>
```

## [](#TOC)6.4Emphasis and strong emphasis

John Gruber’s original [Markdown syntax description](http://daringfireball.net/projects/markdown/syntax#em) says:

> Markdown treats asterisks (`*`) and underscores (`_`) as indicators of emphasis. Text wrapped with one `*` or `_` will be wrapped with an HTML `<em>` tag; double `*`’s or `_`’s will be wrapped with an HTML `<strong>` tag.

This is enough for most users, but these rules leave much undecided, especially when it comes to nested emphasis. The original `Markdown.pl` test suite makes it clear that triple `***` and `___` delimiters can be used for strong emphasis, and most implementations have also allowed the following patterns:

```markdown
***strong emph***
***strong** in emph*
***emph* in strong**
**in strong *emph***
*in emph **strong***
```

The following patterns are less widely supported, but the intent is clear and they are useful (especially in contexts like bibliography entries):

```markdown
*emph *with emph* in it*
**strong **with strong** in it**
```

Many implementations have also restricted intraword emphasis to the `*` forms, to avoid unwanted emphasis in words containing internal underscores. (It is best practice to put these in code spans, but users often do not.)

```markdown
internal emphasis: foo*bar*baz
no emphasis: foo_bar_baz
```

The rules given below capture all of these patterns, while allowing for efficient parsing strategies that do not backtrack.

First, some definitions. A [delimiter run](#delimiter-run) is either a sequence of one or more `*` characters that is not preceded or followed by a non-backslash-escaped `*` character, or a sequence of one or more `_` characters that is not preceded or followed by a non-backslash-escaped `_` character.

A [left-flanking delimiter run](#left-flanking-delimiter-run) is a [delimiter run](#delimiter-run) that is (1) not followed by [Unicode whitespace](#unicode-whitespace), and either (2a) not followed by a [punctuation character](#punctuation-character), or (2b) followed by a [punctuation character](#punctuation-character) and preceded by [Unicode whitespace](#unicode-whitespace) or a [punctuation character](#punctuation-character). For purposes of this definition, the beginning and the end of the line count as Unicode whitespace.

A [right-flanking delimiter run](#right-flanking-delimiter-run) is a [delimiter run](#delimiter-run) that is (1) not preceded by [Unicode whitespace](#unicode-whitespace), and either (2a) not preceded by a [punctuation character](#punctuation-character), or (2b) preceded by a [punctuation character](#punctuation-character) and followed by [Unicode whitespace](#unicode-whitespace) or a [punctuation character](#punctuation-character). For purposes of this definition, the beginning and the end of the line count as Unicode whitespace.

Here are some examples of delimiter runs.

-   left-flanking but not right-flanking:
    
    ```
    ***abc
      _abc
    **"abc"
     _"abc"
    ```
    
-   right-flanking but not left-flanking:
    
    ```
     abc***
     abc_
    "abc"**
    "abc"_
    ```
    
-   Both left and right-flanking:
    
    ```
     abc***def
    "abc"_"def"
    ```
    
-   Neither left nor right-flanking:
    
    ```
    abc *** def
    a _ b
    ```
    

(The idea of distinguishing left-flanking and right-flanking delimiter runs based on the character before and the character after comes from Roopesh Chander’s [vfmd](http://www.vfmd.org/vfmd-spec/specification/#procedure-for-identifying-emphasis-tags). vfmd uses the terminology “emphasis indicator string” instead of “delimiter run,” and its rules for distinguishing left- and right-flanking runs are a bit more complex than the ones given here.)

The following rules define emphasis and strong emphasis:

1.  A single `*` character [can open emphasis](#can-open-emphasis) iff (if and only if) it is part of a [left-flanking delimiter run](#left-flanking-delimiter-run).
    
2.  A single `_` character [can open emphasis](#can-open-emphasis) iff it is part of a [left-flanking delimiter run](#left-flanking-delimiter-run) and either (a) not part of a [right-flanking delimiter run](#right-flanking-delimiter-run) or (b) part of a [right-flanking delimiter run](#right-flanking-delimiter-run) preceded by punctuation.
    
3.  A single `*` character [can close emphasis](#can-close-emphasis) iff it is part of a [right-flanking delimiter run](#right-flanking-delimiter-run).
    
4.  A single `_` character [can close emphasis](#can-close-emphasis) iff it is part of a [right-flanking delimiter run](#right-flanking-delimiter-run) and either (a) not part of a [left-flanking delimiter run](#left-flanking-delimiter-run) or (b) part of a [left-flanking delimiter run](#left-flanking-delimiter-run) followed by punctuation.
    
5.  A double `**` [can open strong emphasis](#can-open-strong-emphasis) iff it is part of a [left-flanking delimiter run](#left-flanking-delimiter-run).
    
6.  A double `__` [can open strong emphasis](#can-open-strong-emphasis) iff it is part of a [left-flanking delimiter run](#left-flanking-delimiter-run) and either (a) not part of a [right-flanking delimiter run](#right-flanking-delimiter-run) or (b) part of a [right-flanking delimiter run](#right-flanking-delimiter-run) preceded by punctuation.
    
7.  A double `**` [can close strong emphasis](#can-close-strong-emphasis) iff it is part of a [right-flanking delimiter run](#right-flanking-delimiter-run).
    
8.  A double `__` [can close strong emphasis](#can-close-strong-emphasis) iff it is part of a [right-flanking delimiter run](#right-flanking-delimiter-run) and either (a) not part of a [left-flanking delimiter run](#left-flanking-delimiter-run) or (b) part of a [left-flanking delimiter run](#left-flanking-delimiter-run) followed by punctuation.
    
9.  Emphasis begins with a delimiter that [can open emphasis](#can-open-emphasis) and ends with a delimiter that [can close emphasis](#can-close-emphasis), and that uses the same character (`_` or `*`) as the opening delimiter. The opening and closing delimiters must belong to separate [delimiter runs](#delimiter-run). If one of the delimiters can both open and close emphasis, then the sum of the lengths of the delimiter runs containing the opening and closing delimiters must not be a multiple of 3 unless both lengths are multiples of 3.
    
10.  Strong emphasis begins with a delimiter that [can open strong emphasis](#can-open-strong-emphasis) and ends with a delimiter that [can close strong emphasis](#can-close-strong-emphasis), and that uses the same character (`_` or `*`) as the opening delimiter. The opening and closing delimiters must belong to separate [delimiter runs](#delimiter-run). If one of the delimiters can both open and close strong emphasis, then the sum of the lengths of the delimiter runs containing the opening and closing delimiters must not be a multiple of 3 unless both lengths are multiples of 3.
    
11.  A literal `*` character cannot occur at the beginning or end of `*`\-delimited emphasis or `**`\-delimited strong emphasis, unless it is backslash-escaped.
    
12.  A literal `_` character cannot occur at the beginning or end of `_`\-delimited emphasis or `__`\-delimited strong emphasis, unless it is backslash-escaped.
    

Where rules 1–12 above are compatible with multiple parsings, the following principles resolve ambiguity:

13.  The number of nestings should be minimized. Thus, for example, an interpretation `<strong>...</strong>` is always preferred to `<em><em>...</em></em>`.
    
14.  An interpretation `<em><strong>...</strong></em>` is always preferred to `<strong><em>...</em></strong>`.
    
15.  When two potential emphasis or strong emphasis spans overlap, so that the second begins before the first ends and ends after the first ends, the first takes precedence. Thus, for example, `*foo _bar* baz_` is parsed as `<em>foo _bar</em> baz_` rather than `*foo <em>bar* baz</em>`.
    
16.  When there are two potential emphasis or strong emphasis spans with the same closing delimiter, the shorter one (the one that opens later) takes precedence. Thus, for example, `**foo **bar baz**` is parsed as `**foo <strong>bar baz</strong>` rather than `<strong>foo **bar baz</strong>`.
    
17.  Inline code spans, links, images, and HTML tags group more tightly than emphasis. So, when there is a choice between an interpretation that contains one of these elements and one that does not, the former always wins. Thus, for example, `*[foo*](bar)` is parsed as `*<a href="bar">foo*</a>` rather than as `<em>[foo</em>](bar)`.
    

These rules can be illustrated through a series of examples.

Rule 1:

[Example 360](#example-360)

```markdown
*foo bar*
```

```html
<p><em>foo bar</em></p>
```

This is not emphasis, because the opening `*` is followed by whitespace, and hence not part of a [left-flanking delimiter run](#left-flanking-delimiter-run):

[Example 361](#example-361)

```markdown
a * foo bar*
```

```html
<p>a * foo bar*</p>
```

This is not emphasis, because the opening `*` is preceded by an alphanumeric and followed by punctuation, and hence not part of a [left-flanking delimiter run](#left-flanking-delimiter-run):

[Example 362](#example-362)

```markdown
a*"foo"*
```

```html
<p>a*&quot;foo&quot;*</p>
```

Unicode nonbreaking spaces count as whitespace, too:

[Example 363](#example-363)

```markdown
* a *
```

```html
<p>* a *</p>
```

Intraword emphasis with `*` is permitted:

[Example 364](#example-364)

```markdown
foo*bar*
```

```html
<p>foo<em>bar</em></p>
```

[Example 365](#example-365)

```markdown
5*6*78
```

```html
<p>5<em>6</em>78</p>
```

Rule 2:

[Example 366](#example-366)

```markdown
_foo bar_
```

```html
<p><em>foo bar</em></p>
```

This is not emphasis, because the opening `_` is followed by whitespace:

[Example 367](#example-367)

```markdown
_ foo bar_
```

```html
<p>_ foo bar_</p>
```

This is not emphasis, because the opening `_` is preceded by an alphanumeric and followed by punctuation:

[Example 368](#example-368)

```markdown
a_"foo"_
```

```html
<p>a_&quot;foo&quot;_</p>
```

Emphasis with `_` is not allowed inside words:

[Example 369](#example-369)

```markdown
foo_bar_
```

```html
<p>foo_bar_</p>
```

[Example 370](#example-370)

```markdown
5_6_78
```

```html
<p>5_6_78</p>
```

[Example 371](#example-371)

```markdown
пристаням_стремятся_
```

```html
<p>пристаням_стремятся_</p>
```

Here `_` does not generate emphasis, because the first delimiter run is right-flanking and the second left-flanking:

[Example 372](#example-372)

```markdown
aa_"bb"_cc
```

```html
<p>aa_&quot;bb&quot;_cc</p>
```

This is emphasis, even though the opening delimiter is both left- and right-flanking, because it is preceded by punctuation:

[Example 373](#example-373)

```markdown
foo-_(bar)_
```

```html
<p>foo-<em>(bar)</em></p>
```

Rule 3:

This is not emphasis, because the closing delimiter does not match the opening delimiter:

[Example 374](#example-374)

```markdown
_foo*
```

```html
<p>_foo*</p>
```

This is not emphasis, because the closing `*` is preceded by whitespace:

[Example 375](#example-375)

```markdown
*foo bar *
```

```html
<p>*foo bar *</p>
```

A newline also counts as whitespace:

[Example 376](#example-376)

```markdown
*foo bar
*
```

```html
<p>*foo bar
*</p>
```

This is not emphasis, because the second `*` is preceded by punctuation and followed by an alphanumeric (hence it is not part of a [right-flanking delimiter run](#right-flanking-delimiter-run):

[Example 377](#example-377)

```markdown
*(*foo)
```

```html
<p>*(*foo)</p>
```

The point of this restriction is more easily appreciated with this example:

[Example 378](#example-378)

```markdown
*(*foo*)*
```

```html
<p><em>(<em>foo</em>)</em></p>
```

Intraword emphasis with `*` is allowed:

[Example 379](#example-379)

```markdown
*foo*bar
```

```html
<p><em>foo</em>bar</p>
```

Rule 4:

This is not emphasis, because the closing `_` is preceded by whitespace:

[Example 380](#example-380)

```markdown
_foo bar _
```

```html
<p>_foo bar _</p>
```

This is not emphasis, because the second `_` is preceded by punctuation and followed by an alphanumeric:

[Example 381](#example-381)

```markdown
_(_foo)
```

```html
<p>_(_foo)</p>
```

This is emphasis within emphasis:

[Example 382](#example-382)

```markdown
_(_foo_)_
```

```html
<p><em>(<em>foo</em>)</em></p>
```

Intraword emphasis is disallowed for `_`:

[Example 383](#example-383)

```markdown
_foo_bar
```

```html
<p>_foo_bar</p>
```

[Example 384](#example-384)

```markdown
_пристаням_стремятся
```

```html
<p>_пристаням_стремятся</p>
```

[Example 385](#example-385)

```markdown
_foo_bar_baz_
```

```html
<p><em>foo_bar_baz</em></p>
```

This is emphasis, even though the closing delimiter is both left- and right-flanking, because it is followed by punctuation:

[Example 386](#example-386)

```markdown
_(bar)_.
```

```html
<p><em>(bar)</em>.</p>
```

Rule 5:

[Example 387](#example-387)

```markdown
**foo bar**
```

```html
<p><strong>foo bar</strong></p>
```

This is not strong emphasis, because the opening delimiter is followed by whitespace:

[Example 388](#example-388)

```markdown
** foo bar**
```

```html
<p>** foo bar**</p>
```

This is not strong emphasis, because the opening `**` is preceded by an alphanumeric and followed by punctuation, and hence not part of a [left-flanking delimiter run](#left-flanking-delimiter-run):

[Example 389](#example-389)

```markdown
a**"foo"**
```

```html
<p>a**&quot;foo&quot;**</p>
```

Intraword strong emphasis with `**` is permitted:

[Example 390](#example-390)

```markdown
foo**bar**
```

```html
<p>foo<strong>bar</strong></p>
```

Rule 6:

[Example 391](#example-391)

```markdown
__foo bar__
```

```html
<p><strong>foo bar</strong></p>
```

This is not strong emphasis, because the opening delimiter is followed by whitespace:

[Example 392](#example-392)

```markdown
__ foo bar__
```

```html
<p>__ foo bar__</p>
```

A newline counts as whitespace:

[Example 393](#example-393)

```markdown
__
foo bar__
```

```html
<p>__
foo bar__</p>
```

This is not strong emphasis, because the opening `__` is preceded by an alphanumeric and followed by punctuation:

[Example 394](#example-394)

```markdown
a__"foo"__
```

```html
<p>a__&quot;foo&quot;__</p>
```

Intraword strong emphasis is forbidden with `__`:

[Example 395](#example-395)

```markdown
foo__bar__
```

```html
<p>foo__bar__</p>
```

[Example 396](#example-396)

```markdown
5__6__78
```

```html
<p>5__6__78</p>
```

[Example 397](#example-397)

```markdown
пристаням__стремятся__
```

```html
<p>пристаням__стремятся__</p>
```

[Example 398](#example-398)

```markdown
__foo, __bar__, baz__
```

```html
<p><strong>foo, <strong>bar</strong>, baz</strong></p>
```

This is strong emphasis, even though the opening delimiter is both left- and right-flanking, because it is preceded by punctuation:

[Example 399](#example-399)

```markdown
foo-__(bar)__
```

```html
<p>foo-<strong>(bar)</strong></p>
```

Rule 7:

This is not strong emphasis, because the closing delimiter is preceded by whitespace:

[Example 400](#example-400)

```markdown
**foo bar **
```

```html
<p>**foo bar **</p>
```

(Nor can it be interpreted as an emphasized `*foo bar *`, because of Rule 11.)

This is not strong emphasis, because the second `**` is preceded by punctuation and followed by an alphanumeric:

[Example 401](#example-401)

```markdown
**(**foo)
```

```html
<p>**(**foo)</p>
```

The point of this restriction is more easily appreciated with these examples:

[Example 402](#example-402)

```markdown
*(**foo**)*
```

```html
<p><em>(<strong>foo</strong>)</em></p>
```

[Example 403](#example-403)

```markdown
**Gomphocarpus (*Gomphocarpus physocarpus*, syn.
*Asclepias physocarpa*)**
```

```html
<p><strong>Gomphocarpus (<em>Gomphocarpus physocarpus</em>, syn.
<em>Asclepias physocarpa</em>)</strong></p>
```

[Example 404](#example-404)

```markdown
**foo "*bar*" foo**
```

```html
<p><strong>foo &quot;<em>bar</em>&quot; foo</strong></p>
```

Intraword emphasis:

[Example 405](#example-405)

```markdown
**foo**bar
```

```html
<p><strong>foo</strong>bar</p>
```

Rule 8:

This is not strong emphasis, because the closing delimiter is preceded by whitespace:

[Example 406](#example-406)

```markdown
__foo bar __
```

```html
<p>__foo bar __</p>
```

This is not strong emphasis, because the second `__` is preceded by punctuation and followed by an alphanumeric:

[Example 407](#example-407)

```markdown
__(__foo)
```

```html
<p>__(__foo)</p>
```

The point of this restriction is more easily appreciated with this example:

[Example 408](#example-408)

```markdown
_(__foo__)_
```

```html
<p><em>(<strong>foo</strong>)</em></p>
```

Intraword strong emphasis is forbidden with `__`:

[Example 409](#example-409)

```markdown
__foo__bar
```

```html
<p>__foo__bar</p>
```

[Example 410](#example-410)

```markdown
__пристаням__стремятся
```

```html
<p>__пристаням__стремятся</p>
```

[Example 411](#example-411)

```markdown
__foo__bar__baz__
```

```html
<p><strong>foo__bar__baz</strong></p>
```

This is strong emphasis, even though the closing delimiter is both left- and right-flanking, because it is followed by punctuation:

[Example 412](#example-412)

```markdown
__(bar)__.
```

```html
<p><strong>(bar)</strong>.</p>
```

Rule 9:

Any nonempty sequence of inline elements can be the contents of an emphasized span.

[Example 413](#example-413)

```markdown
*foo [bar](/url)*
```

```html
<p><em>foo <a href="/url">bar</a></em></p>
```

[Example 414](#example-414)

```markdown
*foo
bar*
```

```html
<p><em>foo
bar</em></p>
```

In particular, emphasis and strong emphasis can be nested inside emphasis:

[Example 415](#example-415)

```markdown
_foo __bar__ baz_
```

```html
<p><em>foo <strong>bar</strong> baz</em></p>
```

[Example 416](#example-416)

```markdown
_foo _bar_ baz_
```

```html
<p><em>foo <em>bar</em> baz</em></p>
```

[Example 417](#example-417)

```markdown
__foo_ bar_
```

```html
<p><em><em>foo</em> bar</em></p>
```

[Example 418](#example-418)

```markdown
*foo *bar**
```

```html
<p><em>foo <em>bar</em></em></p>
```

[Example 419](#example-419)

```markdown
*foo **bar** baz*
```

```html
<p><em>foo <strong>bar</strong> baz</em></p>
```

[Example 420](#example-420)

```markdown
*foo**bar**baz*
```

```html
<p><em>foo<strong>bar</strong>baz</em></p>
```

Note that in the preceding case, the interpretation

```markdown
<p><em>foo</em><em>bar<em></em>baz</em></p>
```

is precluded by the condition that a delimiter that can both open and close (like the `*` after `foo`) cannot form emphasis if the sum of the lengths of the delimiter runs containing the opening and closing delimiters is a multiple of 3 unless both lengths are multiples of 3.

For the same reason, we don’t get two consecutive emphasis sections in this example:

[Example 421](#example-421)

```markdown
*foo**bar*
```

```html
<p><em>foo**bar</em></p>
```

The same condition ensures that the following cases are all strong emphasis nested inside emphasis, even when the interior spaces are omitted:

[Example 422](#example-422)

```markdown
***foo** bar*
```

```html
<p><em><strong>foo</strong> bar</em></p>
```

[Example 423](#example-423)

```markdown
*foo **bar***
```

```html
<p><em>foo <strong>bar</strong></em></p>
```

[Example 424](#example-424)

```markdown
*foo**bar***
```

```html
<p><em>foo<strong>bar</strong></em></p>
```

When the lengths of the interior closing and opening delimiter runs are *both* multiples of 3, though, they can match to create emphasis:

[Example 425](#example-425)

```markdown
foo***bar***baz
```

```html
<p>foo<em><strong>bar</strong></em>baz</p>
```

[Example 426](#example-426)

```markdown
foo******bar*********baz
```

```html
<p>foo<strong><strong><strong>bar</strong></strong></strong>***baz</p>
```

Indefinite levels of nesting are possible:

[Example 427](#example-427)

```markdown
*foo **bar *baz* bim** bop*
```

```html
<p><em>foo <strong>bar <em>baz</em> bim</strong> bop</em></p>
```

[Example 428](#example-428)

```markdown
*foo [*bar*](/url)*
```

```html
<p><em>foo <a href="/url"><em>bar</em></a></em></p>
```

There can be no empty emphasis or strong emphasis:

[Example 429](#example-429)

```markdown
** is not an empty emphasis
```

```html
<p>** is not an empty emphasis</p>
```

[Example 430](#example-430)

```markdown
**** is not an empty strong emphasis
```

```html
<p>**** is not an empty strong emphasis</p>
```

Rule 10:

Any nonempty sequence of inline elements can be the contents of an strongly emphasized span.

[Example 431](#example-431)

```markdown
**foo [bar](/url)**
```

```html
<p><strong>foo <a href="/url">bar</a></strong></p>
```

[Example 432](#example-432)

```markdown
**foo
bar**
```

```html
<p><strong>foo
bar</strong></p>
```

In particular, emphasis and strong emphasis can be nested inside strong emphasis:

[Example 433](#example-433)

```markdown
__foo _bar_ baz__
```

```html
<p><strong>foo <em>bar</em> baz</strong></p>
```

[Example 434](#example-434)

```markdown
__foo __bar__ baz__
```

```html
<p><strong>foo <strong>bar</strong> baz</strong></p>
```

[Example 435](#example-435)

```markdown
____foo__ bar__
```

```html
<p><strong><strong>foo</strong> bar</strong></p>
```

[Example 436](#example-436)

```markdown
**foo **bar****
```

```html
<p><strong>foo <strong>bar</strong></strong></p>
```

[Example 437](#example-437)

```markdown
**foo *bar* baz**
```

```html
<p><strong>foo <em>bar</em> baz</strong></p>
```

[Example 438](#example-438)

```markdown
**foo*bar*baz**
```

```html
<p><strong>foo<em>bar</em>baz</strong></p>
```

[Example 439](#example-439)

```markdown
***foo* bar**
```

```html
<p><strong><em>foo</em> bar</strong></p>
```

[Example 440](#example-440)

```markdown
**foo *bar***
```

```html
<p><strong>foo <em>bar</em></strong></p>
```

Indefinite levels of nesting are possible:

[Example 441](#example-441)

```markdown
**foo *bar **baz**
bim* bop**
```

```html
<p><strong>foo <em>bar <strong>baz</strong>
bim</em> bop</strong></p>
```

[Example 442](#example-442)

```markdown
**foo [*bar*](/url)**
```

```html
<p><strong>foo <a href="/url"><em>bar</em></a></strong></p>
```

There can be no empty emphasis or strong emphasis:

[Example 443](#example-443)

```markdown
__ is not an empty emphasis
```

```html
<p>__ is not an empty emphasis</p>
```

[Example 444](#example-444)

```markdown
____ is not an empty strong emphasis
```

```html
<p>____ is not an empty strong emphasis</p>
```

Rule 11:

[Example 445](#example-445)

```markdown
foo ***
```

```html
<p>foo ***</p>
```

[Example 446](#example-446)

```markdown
foo *\**
```

```html
<p>foo <em>*</em></p>
```

[Example 447](#example-447)

```markdown
foo *_*
```

```html
<p>foo <em>_</em></p>
```

[Example 448](#example-448)

```markdown
foo *****
```

```html
<p>foo *****</p>
```

[Example 449](#example-449)

```markdown
foo **\***
```

```html
<p>foo <strong>*</strong></p>
```

[Example 450](#example-450)

```markdown
foo **_**
```

```html
<p>foo <strong>_</strong></p>
```

Note that when delimiters do not match evenly, Rule 11 determines that the excess literal `*` characters will appear outside of the emphasis, rather than inside it:

[Example 451](#example-451)

```markdown
**foo*
```

```html
<p>*<em>foo</em></p>
```

[Example 452](#example-452)

```markdown
*foo**
```

```html
<p><em>foo</em>*</p>
```

[Example 453](#example-453)

```markdown
***foo**
```

```html
<p>*<strong>foo</strong></p>
```

[Example 454](#example-454)

```markdown
****foo*
```

```html
<p>***<em>foo</em></p>
```

[Example 455](#example-455)

```markdown
**foo***
```

```html
<p><strong>foo</strong>*</p>
```

[Example 456](#example-456)

```markdown
*foo****
```

```html
<p><em>foo</em>***</p>
```

Rule 12:

[Example 457](#example-457)

```markdown
foo ___
```

```html
<p>foo ___</p>
```

[Example 458](#example-458)

```markdown
foo _\__
```

```html
<p>foo <em>_</em></p>
```

[Example 459](#example-459)

```markdown
foo _*_
```

```html
<p>foo <em>*</em></p>
```

[Example 460](#example-460)

```markdown
foo _____
```

```html
<p>foo _____</p>
```

[Example 461](#example-461)

```markdown
foo __\___
```

```html
<p>foo <strong>_</strong></p>
```

[Example 462](#example-462)

```markdown
foo __*__
```

```html
<p>foo <strong>*</strong></p>
```

[Example 463](#example-463)

```markdown
__foo_
```

```html
<p>_<em>foo</em></p>
```

Note that when delimiters do not match evenly, Rule 12 determines that the excess literal `_` characters will appear outside of the emphasis, rather than inside it:

[Example 464](#example-464)

```markdown
_foo__
```

```html
<p><em>foo</em>_</p>
```

[Example 465](#example-465)

```markdown
___foo__
```

```html
<p>_<strong>foo</strong></p>
```

[Example 466](#example-466)

```markdown
____foo_
```

```html
<p>___<em>foo</em></p>
```

[Example 467](#example-467)

```markdown
__foo___
```

```html
<p><strong>foo</strong>_</p>
```

[Example 468](#example-468)

```markdown
_foo____
```

```html
<p><em>foo</em>___</p>
```

Rule 13 implies that if you want emphasis nested directly inside emphasis, you must use different delimiters:

[Example 469](#example-469)

```markdown
**foo**
```

```html
<p><strong>foo</strong></p>
```

[Example 470](#example-470)

```markdown
*_foo_*
```

```html
<p><em><em>foo</em></em></p>
```

[Example 471](#example-471)

```markdown
__foo__
```

```html
<p><strong>foo</strong></p>
```

[Example 472](#example-472)

```markdown
_*foo*_
```

```html
<p><em><em>foo</em></em></p>
```

However, strong emphasis within strong emphasis is possible without switching delimiters:

[Example 473](#example-473)

```markdown
****foo****
```

```html
<p><strong><strong>foo</strong></strong></p>
```

[Example 474](#example-474)

```markdown
____foo____
```

```html
<p><strong><strong>foo</strong></strong></p>
```

Rule 13 can be applied to arbitrarily long sequences of delimiters:

[Example 475](#example-475)

```markdown
******foo******
```

```html
<p><strong><strong><strong>foo</strong></strong></strong></p>
```

Rule 14:

[Example 476](#example-476)

```markdown
***foo***
```

```html
<p><em><strong>foo</strong></em></p>
```

[Example 477](#example-477)

```markdown
_____foo_____
```

```html
<p><em><strong><strong>foo</strong></strong></em></p>
```

Rule 15:

[Example 478](#example-478)

```markdown
*foo _bar* baz_
```

```html
<p><em>foo _bar</em> baz_</p>
```

[Example 479](#example-479)

```markdown
*foo __bar *baz bim__ bam*
```

```html
<p><em>foo <strong>bar *baz bim</strong> bam</em></p>
```

Rule 16:

[Example 480](#example-480)

```markdown
**foo **bar baz**
```

```html
<p>**foo <strong>bar baz</strong></p>
```

[Example 481](#example-481)

```markdown
*foo *bar baz*
```

```html
<p>*foo <em>bar baz</em></p>
```

Rule 17:

[Example 482](#example-482)

```markdown
*[bar*](/url)
```

```html
<p>*<a href="/url">bar*</a></p>
```

[Example 483](#example-483)

```markdown
_foo [bar_](/url)
```

```html
<p>_foo <a href="/url">bar_</a></p>
```

[Example 484](#example-484)

```markdown
*<img src="foo" title="*"/>
```

```html
<p>*<img src="foo" title="*"/></p>
```

[Example 485](#example-485)

```markdown
**<a href="**">
```

```html
<p>**<a href="**"></p>
```

[Example 486](#example-486)

```markdown
__<a href="__">
```

```html
<p>__<a href="__"></p>
```

[Example 487](#example-487)

```markdown
*a `*`*
```

```html
<p><em>a <code>*</code></em></p>
```

[Example 488](#example-488)

```markdown
_a `_`_
```

```html
<p><em>a <code>_</code></em></p>
```

[Example 489](#example-489)

```markdown
**a<http://foo.bar/?q=**>
```

```html
<p>**a<a href="http://foo.bar/?q=**">http://foo.bar/?q=**</a></p>
```

[Example 490](#example-490)

```markdown
__a<http://foo.bar/?q=__>
```

```html
<p>__a<a href="http://foo.bar/?q=__">http://foo.bar/?q=__</a></p>
```

## [](#TOC)6.5Strikethrough (extension)

GFM enables the `strikethrough` extension, where an additional emphasis type is available.

Strikethrough text is any text wrapped in a matching pair of one or two tildes (`~`).

[Example 491](#example-491)

```markdown
~~Hi~~ Hello, ~there~ world!
```

```html
<p><del>Hi</del> Hello, <del>there</del> world!</p>
```

As with regular emphasis delimiters, a new paragraph will cause strikethrough parsing to cease:

[Example 492](#example-492)

```markdown
This ~~has a

new paragraph~~.
```

```html
<p>This ~~has a</p>
<p>new paragraph~~.</p>
```

Three or more tildes do not create a strikethrough:

[Example 493](#example-493)

```markdown
This will ~~~not~~~ strike.
```

```html
<p>This will ~~~not~~~ strike.</p>
```

## [](#TOC)6.6Links

A link contains [link text](#link-text) (the visible text), a [link destination](#link-destination) (the URI that is the link destination), and optionally a [link title](#link-title). There are two basic kinds of links in Markdown. In [inline links](#inline-link) the destination and title are given immediately after the link text. In [reference links](#reference-link) the destination and title are defined elsewhere in the document.

A [link text](#link-text) consists of a sequence of zero or more inline elements enclosed by square brackets (`[` and `]`). The following rules apply:

-   Links may not contain other links, at any level of nesting. If multiple otherwise valid link definitions appear nested inside each other, the inner-most definition is used.
    
-   Brackets are allowed in the [link text](#link-text) only if (a) they are backslash-escaped or (b) they appear as a matched pair of brackets, with an open bracket `[`, a sequence of zero or more inlines, and a close bracket `]`.
    
-   Backtick [code spans](#code-spans), [autolinks](#autolinks), and raw [HTML tags](#html-tag) bind more tightly than the brackets in link text. Thus, for example, `` [foo`]` `` could not be a link text, since the second `]` is part of a code span.
    
-   The brackets in link text bind more tightly than markers for [emphasis and strong emphasis](#emphasis-and-strong-emphasis). Thus, for example, `*[foo*](url)` is a link.
    

A [link destination](#link-destination) consists of either

-   a sequence of zero or more characters between an opening `<` and a closing `>` that contains no line breaks or unescaped `<` or `>` characters, or
    
-   a nonempty sequence of characters that does not start with `<`, does not include ASCII space or control characters, and includes parentheses only if (a) they are backslash-escaped or (b) they are part of a balanced pair of unescaped parentheses. (Implementations may impose limits on parentheses nesting to avoid performance issues, but at least three levels of nesting should be supported.)
    

A [link title](#link-title) consists of either

-   a sequence of zero or more characters between straight double-quote characters (`"`), including a `"` character only if it is backslash-escaped, or
    
-   a sequence of zero or more characters between straight single-quote characters (`'`), including a `'` character only if it is backslash-escaped, or
    
-   a sequence of zero or more characters between matching parentheses (`(...)`), including a `(` or `)` character only if it is backslash-escaped.
    

Although [link titles](#link-title) may span multiple lines, they may not contain a [blank line](#blank-line).

An [inline link](#inline-link) consists of a [link text](#link-text) followed immediately by a left parenthesis `(`, optional [whitespace](#whitespace), an optional [link destination](#link-destination), an optional [link title](#link-title) separated from the link destination by [whitespace](#whitespace), optional [whitespace](#whitespace), and a right parenthesis `)`. The link’s text consists of the inlines contained in the [link text](#link-text) (excluding the enclosing square brackets). The link’s URI consists of the link destination, excluding enclosing `<...>` if present, with backslash-escapes in effect as described above. The link’s title consists of the link title, excluding its enclosing delimiters, with backslash-escapes in effect as described above.

Here is a simple inline link:

[Example 494](#example-494)

```markdown
[link](/uri "title")
```

```html
<p><a href="/uri" title="title">link</a></p>
```

The title may be omitted:

[Example 495](#example-495)

```markdown
[link](/uri)
```

```html
<p><a href="/uri">link</a></p>
```

Both the title and the destination may be omitted:

[Example 496](#example-496)

```markdown
[link]()
```

```html
<p><a href="">link</a></p>
```

[Example 497](#example-497)

```markdown
[link](<>)
```

```html
<p><a href="">link</a></p>
```

The destination can only contain spaces if it is enclosed in pointy brackets:

[Example 498](#example-498)

```markdown
[link](/my uri)
```

```html
<p>[link](/my uri)</p>
```

[Example 499](#example-499)

```markdown
[link](</my uri>)
```

```html
<p><a href="/my%20uri">link</a></p>
```

The destination cannot contain line breaks, even if enclosed in pointy brackets:

[Example 500](#example-500)

```markdown
[link](foo
bar)
```

```html
<p>[link](foo
bar)</p>
```

[Example 501](#example-501)

```markdown
[link](<foo
bar>)
```

```html
<p>[link](<foo
bar>)</p>
```

The destination can contain `)` if it is enclosed in pointy brackets:

[Example 502](#example-502)

```markdown
[a](<b)c>)
```

```html
<p><a href="b)c">a</a></p>
```

Pointy brackets that enclose links must be unescaped:

[Example 503](#example-503)

```markdown
[link](<foo\>)
```

```html
<p>[link](&lt;foo&gt;)</p>
```

These are not links, because the opening pointy bracket is not matched properly:

[Example 504](#example-504)

```markdown
[a](<b)c
[a](<b)c>
[a](<b>c)
```

```html
<p>[a](&lt;b)c
[a](&lt;b)c&gt;
[a](<b>c)</p>
```

Parentheses inside the link destination may be escaped:

[Example 505](#example-505)

```markdown
[link](\(foo\))
```

```html
<p><a href="(foo)">link</a></p>
```

Any number of parentheses are allowed without escaping, as long as they are balanced:

[Example 506](#example-506)

```markdown
[link](foo(and(bar)))
```

```html
<p><a href="foo(and(bar))">link</a></p>
```

However, if you have unbalanced parentheses, you need to escape or use the `<...>` form:

[Example 507](#example-507)

```markdown
[link](foo\(and\(bar\))
```

```html
<p><a href="foo(and(bar)">link</a></p>
```

[Example 508](#example-508)

```markdown
[link](<foo(and(bar)>)
```

```html
<p><a href="foo(and(bar)">link</a></p>
```

Parentheses and other symbols can also be escaped, as usual in Markdown:

[Example 509](#example-509)

```markdown
[link](foo\)\:)
```

```html
<p><a href="foo):">link</a></p>
```

A link can contain fragment identifiers and queries:

[Example 510](#example-510)

```markdown
[link](#fragment)

[link](http://example.com#fragment)

[link](http://example.com?foo=3#frag)
```

```html
<p><a href="#fragment">link</a></p>
<p><a href="http://example.com#fragment">link</a></p>
<p><a href="http://example.com?foo=3#frag">link</a></p>
```

Note that a backslash before a non-escapable character is just a backslash:

[Example 511](#example-511)

```markdown
[link](foo\bar)
```

```html
<p><a href="foo%5Cbar">link</a></p>
```

URL-escaping should be left alone inside the destination, as all URL-escaped characters are also valid URL characters. Entity and numerical character references in the destination will be parsed into the corresponding Unicode code points, as usual. These may be optionally URL-escaped when written as HTML, but this spec does not enforce any particular policy for rendering URLs in HTML or other formats. Renderers may make different decisions about how to escape or normalize URLs in the output.

[Example 512](#example-512)

```markdown
[link](foo%20b&auml;)
```

```html
<p><a href="foo%20b%C3%A4">link</a></p>
```

Note that, because titles can often be parsed as destinations, if you try to omit the destination and keep the title, you’ll get unexpected results:

[Example 513](#example-513)

```markdown
[link]("title")
```

```html
<p><a href="%22title%22">link</a></p>
```

Titles may be in single quotes, double quotes, or parentheses:

[Example 514](#example-514)

```markdown
[link](/url "title")
[link](/url 'title')
[link](/url (title))
```

```html
<p><a href="/url" title="title">link</a>
<a href="/url" title="title">link</a>
<a href="/url" title="title">link</a></p>
```

Backslash escapes and entity and numeric character references may be used in titles:

[Example 515](#example-515)

```markdown
[link](/url "title \"&quot;")
```

```html
<p><a href="/url" title="title &quot;&quot;">link</a></p>
```

Titles must be separated from the link using a [whitespace](#whitespace). Other [Unicode whitespace](#unicode-whitespace) like non-breaking space doesn’t work.

[Example 516](#example-516)

```markdown
[link](/url "title")
```

```html
<p><a href="/url%C2%A0%22title%22">link</a></p>
```

Nested balanced quotes are not allowed without escaping:

[Example 517](#example-517)

```markdown
[link](/url "title "and" title")
```

```html
<p>[link](/url &quot;title &quot;and&quot; title&quot;)</p>
```

But it is easy to work around this by using a different quote type:

[Example 518](#example-518)

```markdown
[link](/url 'title "and" title')
```

```html
<p><a href="/url" title="title &quot;and&quot; title">link</a></p>
```

(Note: `Markdown.pl` did allow double quotes inside a double-quoted title, and its test suite included a test demonstrating this. But it is hard to see a good rationale for the extra complexity this brings, since there are already many ways—backslash escaping, entity and numeric character references, or using a different quote type for the enclosing title—to write titles containing double quotes. `Markdown.pl`’s handling of titles has a number of other strange features. For example, it allows single-quoted titles in inline links, but not reference links. And, in reference links but not inline links, it allows a title to begin with `"` and end with `)`. `Markdown.pl` 1.0.1 even allows titles with no closing quotation mark, though 1.0.2b8 does not. It seems preferable to adopt a simple, rational rule that works the same way in inline links and link reference definitions.)

[Whitespace](#whitespace) is allowed around the destination and title:

[Example 519](#example-519)

```markdown
[link](   /uri
  "title"  )
```

```html
<p><a href="/uri" title="title">link</a></p>
```

But it is not allowed between the link text and the following parenthesis:

[Example 520](#example-520)

```markdown
[link] (/uri)
```

```html
<p>[link] (/uri)</p>
```

The link text may contain balanced brackets, but not unbalanced ones, unless they are escaped:

[Example 521](#example-521)

```markdown
[link [foo [bar]]](/uri)
```

```html
<p><a href="/uri">link [foo [bar]]</a></p>
```

[Example 522](#example-522)

```markdown
[link] bar](/uri)
```

```html
<p>[link] bar](/uri)</p>
```

[Example 523](#example-523)

```markdown
[link [bar](/uri)
```

```html
<p>[link <a href="/uri">bar</a></p>
```

[Example 524](#example-524)

```markdown
[link \[bar](/uri)
```

```html
<p><a href="/uri">link [bar</a></p>
```

The link text may contain inline content:

[Example 525](#example-525)

```markdown
[link *foo **bar** `#`*](/uri)
```

```html
<p><a href="/uri">link <em>foo <strong>bar</strong> <code>#</code></em></a></p>
```

[Example 526](#example-526)

```markdown
[![moon](moon.jpg)](/uri)
```

```html
<p><a href="/uri"><img src="moon.jpg" alt="moon" /></a></p>
```

However, links may not contain other links, at any level of nesting.

[Example 527](#example-527)

```markdown
[foo [bar](/uri)](/uri)
```

```html
<p>[foo <a href="/uri">bar</a>](/uri)</p>
```

[Example 528](#example-528)

```markdown
[foo *[bar [baz](/uri)](/uri)*](/uri)
```

```html
<p>[foo <em>[bar <a href="/uri">baz</a>](/uri)</em>](/uri)</p>
```

[Example 529](#example-529)

```markdown
![[[foo](uri1)](uri2)](uri3)
```

```html
<p><img src="uri3" alt="[foo](uri2)" /></p>
```

These cases illustrate the precedence of link text grouping over emphasis grouping:

[Example 530](#example-530)

```markdown
*[foo*](/uri)
```

```html
<p>*<a href="/uri">foo*</a></p>
```

[Example 531](#example-531)

```markdown
[foo *bar](baz*)
```

```html
<p><a href="baz*">foo *bar</a></p>
```

Note that brackets that *aren’t* part of links do not take precedence:

[Example 532](#example-532)

```markdown
*foo [bar* baz]
```

```html
<p><em>foo [bar</em> baz]</p>
```

These cases illustrate the precedence of HTML tags, code spans, and autolinks over link grouping:

[Example 533](#example-533)

```markdown
[foo <bar attr="](baz)">
```

```html
<p>[foo <bar attr="](baz)"></p>
```

[Example 534](#example-534)

```markdown
[foo`](/uri)`
```

```html
<p>[foo<code>](/uri)</code></p>
```

[Example 535](#example-535)

```markdown
[foo<http://example.com/?search=](uri)>
```

```html
<p>[foo<a href="http://example.com/?search=%5D(uri)">http://example.com/?search=](uri)</a></p>
```

There are three kinds of [reference link](#reference-link)s: [full](#full-reference-link), [collapsed](#collapsed-reference-link), and [shortcut](#shortcut-reference-link).

A [full reference link](#full-reference-link) consists of a [link text](#link-text) immediately followed by a [link label](#link-label) that [matches](#matches) a [link reference definition](#link-reference-definition) elsewhere in the document.

A [link label](#link-label) begins with a left bracket (`[`) and ends with the first right bracket (`]`) that is not backslash-escaped. Between these brackets there must be at least one [non-whitespace character](#non-whitespace-character). Unescaped square bracket characters are not allowed inside the opening and closing square brackets of [link labels](#link-label). A link label can have at most 999 characters inside the square brackets.

One label [matches](#matches) another just in case their normalized forms are equal. To normalize a label, strip off the opening and closing brackets, perform the *Unicode case fold*, strip leading and trailing [whitespace](#whitespace) and collapse consecutive internal [whitespace](#whitespace) to a single space. If there are multiple matching reference link definitions, the one that comes first in the document is used. (It is desirable in such cases to emit a warning.)

The link’s URI and title are provided by the matching [link reference definition](#link-reference-definition).

Here is a simple example:

[Example 536](#example-536)

```markdown
[foo][bar]

[bar]: /url "title"
```

```html
<p><a href="/url" title="title">foo</a></p>
```

The rules for the [link text](#link-text) are the same as with [inline links](#inline-link). Thus:

The link text may contain balanced brackets, but not unbalanced ones, unless they are escaped:

[Example 537](#example-537)

```markdown
[link [foo [bar]]][ref]

[ref]: /uri
```

```html
<p><a href="/uri">link [foo [bar]]</a></p>
```

[Example 538](#example-538)

```markdown
[link \[bar][ref]

[ref]: /uri
```

```html
<p><a href="/uri">link [bar</a></p>
```

The link text may contain inline content:

[Example 539](#example-539)

```markdown
[link *foo **bar** `#`*][ref]

[ref]: /uri
```

```html
<p><a href="/uri">link <em>foo <strong>bar</strong> <code>#</code></em></a></p>
```

[Example 540](#example-540)

```markdown
[![moon](moon.jpg)][ref]

[ref]: /uri
```

```html
<p><a href="/uri"><img src="moon.jpg" alt="moon" /></a></p>
```

However, links may not contain other links, at any level of nesting.

[Example 541](#example-541)

```markdown
[foo [bar](/uri)][ref]

[ref]: /uri
```

```html
<p>[foo <a href="/uri">bar</a>]<a href="/uri">ref</a></p>
```

[Example 542](#example-542)

```markdown
[foo *bar [baz][ref]*][ref]

[ref]: /uri
```

```html
<p>[foo <em>bar <a href="/uri">baz</a></em>]<a href="/uri">ref</a></p>
```

(In the examples above, we have two [shortcut reference links](#shortcut-reference-link) instead of one [full reference link](#full-reference-link).)

The following cases illustrate the precedence of link text grouping over emphasis grouping:

[Example 543](#example-543)

```markdown
*[foo*][ref]

[ref]: /uri
```

```html
<p>*<a href="/uri">foo*</a></p>
```

[Example 544](#example-544)

```markdown
[foo *bar][ref]*

[ref]: /uri
```

```html
<p><a href="/uri">foo *bar</a>*</p>
```

These cases illustrate the precedence of HTML tags, code spans, and autolinks over link grouping:

[Example 545](#example-545)

```markdown
[foo <bar attr="][ref]">

[ref]: /uri
```

```html
<p>[foo <bar attr="][ref]"></p>
```

[Example 546](#example-546)

```markdown
[foo`][ref]`

[ref]: /uri
```

```html
<p>[foo<code>][ref]</code></p>
```

[Example 547](#example-547)

```markdown
[foo<http://example.com/?search=][ref]>

[ref]: /uri
```

```html
<p>[foo<a href="http://example.com/?search=%5D%5Bref%5D">http://example.com/?search=][ref]</a></p>
```

Matching is case-insensitive:

[Example 548](#example-548)

```markdown
[foo][BaR]

[bar]: /url "title"
```

```html
<p><a href="/url" title="title">foo</a></p>
```

Unicode case fold is used:

[Example 549](#example-549)

```markdown
[ẞ]

[SS]: /url
```

```html
<p><a href="/url">ẞ</a></p>
```

Consecutive internal [whitespace](#whitespace) is treated as one space for purposes of determining matching:

[Example 550](#example-550)

```markdown
[Foo
  bar]: /url

[Baz][Foo bar]
```

```html
<p><a href="/url">Baz</a></p>
```

No [whitespace](#whitespace) is allowed between the [link text](#link-text) and the [link label](#link-label):

[Example 551](#example-551)

```markdown
[foo] [bar]

[bar]: /url "title"
```

```html
<p>[foo] <a href="/url" title="title">bar</a></p>
```

[Example 552](#example-552)

```markdown
[foo]
[bar]

[bar]: /url "title"
```

```html
<p>[foo]
<a href="/url" title="title">bar</a></p>
```

This is a departure from John Gruber’s original Markdown syntax description, which explicitly allows whitespace between the link text and the link label. It brings reference links in line with [inline links](#inline-link), which (according to both original Markdown and this spec) cannot have whitespace after the link text. More importantly, it prevents inadvertent capture of consecutive [shortcut reference links](#shortcut-reference-link). If whitespace is allowed between the link text and the link label, then in the following we will have a single reference link, not two shortcut reference links, as intended:

```markdown
[foo]
[bar]

[foo]: /url1
[bar]: /url2
```

(Note that [shortcut reference links](#shortcut-reference-link) were introduced by Gruber himself in a beta version of `Markdown.pl`, but never included in the official syntax description. Without shortcut reference links, it is harmless to allow space between the link text and link label; but once shortcut references are introduced, it is too dangerous to allow this, as it frequently leads to unintended results.)

When there are multiple matching [link reference definitions](#link-reference-definitions), the first is used:

[Example 553](#example-553)

```markdown
[foo]: /url1

[foo]: /url2

[bar][foo]
```

```html
<p><a href="/url1">bar</a></p>
```

Note that matching is performed on normalized strings, not parsed inline content. So the following does not match, even though the labels define equivalent inline content:

[Example 554](#example-554)

```markdown
[bar][foo\!]

[foo!]: /url
```

```html
<p>[bar][foo!]</p>
```

[Link labels](#link-label) cannot contain brackets, unless they are backslash-escaped:

[Example 555](#example-555)

```markdown
[foo][ref[]

[ref[]: /uri
```

```html
<p>[foo][ref[]</p>
<p>[ref[]: /uri</p>
```

[Example 556](#example-556)

```markdown
[foo][ref[bar]]

[ref[bar]]: /uri
```

```html
<p>[foo][ref[bar]]</p>
<p>[ref[bar]]: /uri</p>
```

[Example 557](#example-557)

```markdown
[[[foo]]]

[[[foo]]]: /url
```

```html
<p>[[[foo]]]</p>
<p>[[[foo]]]: /url</p>
```

[Example 558](#example-558)

```markdown
[foo][ref\[]

[ref\[]: /uri
```

```html
<p><a href="/uri">foo</a></p>
```

Note that in this example `]` is not backslash-escaped:

[Example 559](#example-559)

```markdown
[bar\\]: /uri

[bar\\]
```

```html
<p><a href="/uri">bar\</a></p>
```

A [link label](#link-label) must contain at least one [non-whitespace character](#non-whitespace-character):

[Example 560](#example-560)

```markdown
[]

[]: /uri
```

```html
<p>[]</p>
<p>[]: /uri</p>
```

[Example 561](#example-561)

```markdown
[
 ]

[
 ]: /uri
```

```html
<p>[
]</p>
<p>[
]: /uri</p>
```

A [collapsed reference link](#collapsed-reference-link) consists of a [link label](#link-label) that [matches](#matches) a [link reference definition](#link-reference-definition) elsewhere in the document, followed by the string `[]`. The contents of the first link label are parsed as inlines, which are used as the link’s text. The link’s URI and title are provided by the matching reference link definition. Thus, `[foo][]` is equivalent to `[foo][foo]`.

[Example 562](#example-562)

```markdown
[foo][]

[foo]: /url "title"
```

```html
<p><a href="/url" title="title">foo</a></p>
```

[Example 563](#example-563)

```markdown
[*foo* bar][]

[*foo* bar]: /url "title"
```

```html
<p><a href="/url" title="title"><em>foo</em> bar</a></p>
```

The link labels are case-insensitive:

[Example 564](#example-564)

```markdown
[Foo][]

[foo]: /url "title"
```

```html
<p><a href="/url" title="title">Foo</a></p>
```

As with full reference links, [whitespace](#whitespace) is not allowed between the two sets of brackets:

[Example 565](#example-565)

```markdown
[foo] 
[]

[foo]: /url "title"
```

```html
<p><a href="/url" title="title">foo</a>
[]</p>
```

A [shortcut reference link](#shortcut-reference-link) consists of a [link label](#link-label) that [matches](#matches) a [link reference definition](#link-reference-definition) elsewhere in the document and is not followed by `[]` or a link label. The contents of the first link label are parsed as inlines, which are used as the link’s text. The link’s URI and title are provided by the matching link reference definition. Thus, `[foo]` is equivalent to `[foo][]`.

[Example 566](#example-566)

```markdown
[foo]

[foo]: /url "title"
```

```html
<p><a href="/url" title="title">foo</a></p>
```

[Example 567](#example-567)

```markdown
[*foo* bar]

[*foo* bar]: /url "title"
```

```html
<p><a href="/url" title="title"><em>foo</em> bar</a></p>
```

[Example 568](#example-568)

```markdown
[[*foo* bar]]

[*foo* bar]: /url "title"
```

```html
<p>[<a href="/url" title="title"><em>foo</em> bar</a>]</p>
```

[Example 569](#example-569)

```markdown
[[bar [foo]

[foo]: /url
```

```html
<p>[[bar <a href="/url">foo</a></p>
```

The link labels are case-insensitive:

[Example 570](#example-570)

```markdown
[Foo]

[foo]: /url "title"
```

```html
<p><a href="/url" title="title">Foo</a></p>
```

A space after the link text should be preserved:

[Example 571](#example-571)

```markdown
[foo] bar

[foo]: /url
```

```html
<p><a href="/url">foo</a> bar</p>
```

If you just want bracketed text, you can backslash-escape the opening bracket to avoid links:

[Example 572](#example-572)

```markdown
\[foo]

[foo]: /url "title"
```

```html
<p>[foo]</p>
```

Note that this is a link, because a link label ends with the first following closing bracket:

[Example 573](#example-573)

```markdown
[foo*]: /url

*[foo*]
```

```html
<p>*<a href="/url">foo*</a></p>
```

Full and compact references take precedence over shortcut references:

[Example 574](#example-574)

```markdown
[foo][bar]

[foo]: /url1
[bar]: /url2
```

```html
<p><a href="/url2">foo</a></p>
```

[Example 575](#example-575)

```markdown
[foo][]

[foo]: /url1
```

```html
<p><a href="/url1">foo</a></p>
```

Inline links also take precedence:

[Example 576](#example-576)

```markdown
[foo]()

[foo]: /url1
```

```html
<p><a href="">foo</a></p>
```

[Example 577](#example-577)

```markdown
[foo](not a link)

[foo]: /url1
```

```html
<p><a href="/url1">foo</a>(not a link)</p>
```

In the following case `[bar][baz]` is parsed as a reference, `[foo]` as normal text:

[Example 578](#example-578)

```markdown
[foo][bar][baz]

[baz]: /url
```

```html
<p>[foo]<a href="/url">bar</a></p>
```

Here, though, `[foo][bar]` is parsed as a reference, since `[bar]` is defined:

[Example 579](#example-579)

```markdown
[foo][bar][baz]

[baz]: /url1
[bar]: /url2
```

```html
<p><a href="/url2">foo</a><a href="/url1">baz</a></p>
```

Here `[foo]` is not parsed as a shortcut reference, because it is followed by a link label (even though `[bar]` is not defined):

[Example 580](#example-580)

```markdown
[foo][bar][baz]

[baz]: /url1
[foo]: /url2
```

```html
<p>[foo]<a href="/url1">bar</a></p>
```

## [](#TOC)6.7Images

Syntax for images is like the syntax for links, with one difference. Instead of [link text](#link-text), we have an [image description](#image-description). The rules for this are the same as for [link text](#link-text), except that (a) an image description starts with `![` rather than `[`, and (b) an image description may contain links. An image description has inline elements as its contents. When an image is rendered to HTML, this is standardly used as the image’s `alt` attribute.

[Example 581](#example-581)

```markdown
![foo](/url "title")
```

```html
<p><img src="/url" alt="foo" title="title" /></p>
```

[Example 582](#example-582)

```markdown
![foo *bar*]

[foo *bar*]: train.jpg "train & tracks"
```

```html
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>
```

[Example 583](#example-583)

```markdown
![foo ![bar](/url)](/url2)
```

```html
<p><img src="/url2" alt="foo bar" /></p>
```

[Example 584](#example-584)

```markdown
![foo [bar](/url)](/url2)
```

```html
<p><img src="/url2" alt="foo bar" /></p>
```

Though this spec is concerned with parsing, not rendering, it is recommended that in rendering to HTML, only the plain string content of the [image description](#image-description) be used. Note that in the above example, the alt attribute’s value is `foo bar`, not `foo [bar](/url)` or `foo <a href="/url">bar</a>`. Only the plain string content is rendered, without formatting.

[Example 585](#example-585)

```markdown
![foo *bar*][]

[foo *bar*]: train.jpg "train & tracks"
```

```html
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>
```

[Example 586](#example-586)

```markdown
![foo *bar*][foobar]

[FOOBAR]: train.jpg "train & tracks"
```

```html
<p><img src="train.jpg" alt="foo bar" title="train &amp; tracks" /></p>
```

[Example 587](#example-587)

```markdown
![foo](train.jpg)
```

```html
<p><img src="train.jpg" alt="foo" /></p>
```

[Example 588](#example-588)

```markdown
My ![foo bar](/path/to/train.jpg  "title"   )
```

```html
<p>My <img src="/path/to/train.jpg" alt="foo bar" title="title" /></p>
```

[Example 589](#example-589)

```markdown
![foo](<url>)
```

```html
<p><img src="url" alt="foo" /></p>
```

[Example 590](#example-590)

```markdown
![](/url)
```

```html
<p><img src="/url" alt="" /></p>
```

Reference-style:

[Example 591](#example-591)

```markdown
![foo][bar]

[bar]: /url
```

```html
<p><img src="/url" alt="foo" /></p>
```

[Example 592](#example-592)

```markdown
![foo][bar]

[BAR]: /url
```

```html
<p><img src="/url" alt="foo" /></p>
```

Collapsed:

[Example 593](#example-593)

```markdown
![foo][]

[foo]: /url "title"
```

```html
<p><img src="/url" alt="foo" title="title" /></p>
```

[Example 594](#example-594)

```markdown
![*foo* bar][]

[*foo* bar]: /url "title"
```

```html
<p><img src="/url" alt="foo bar" title="title" /></p>
```

The labels are case-insensitive:

[Example 595](#example-595)

```markdown
![Foo][]

[foo]: /url "title"
```

```html
<p><img src="/url" alt="Foo" title="title" /></p>
```

As with reference links, [whitespace](#whitespace) is not allowed between the two sets of brackets:

[Example 596](#example-596)

```markdown
![foo] 
[]

[foo]: /url "title"
```

```html
<p><img src="/url" alt="foo" title="title" />
[]</p>
```

Shortcut:

[Example 597](#example-597)

```markdown
![foo]

[foo]: /url "title"
```

```html
<p><img src="/url" alt="foo" title="title" /></p>
```

[Example 598](#example-598)

```markdown
![*foo* bar]

[*foo* bar]: /url "title"
```

```html
<p><img src="/url" alt="foo bar" title="title" /></p>
```

Note that link labels cannot contain unescaped brackets:

[Example 599](#example-599)

```markdown
![[foo]]

[[foo]]: /url "title"
```

```html
<p>![[foo]]</p>
<p>[[foo]]: /url &quot;title&quot;</p>
```

The link labels are case-insensitive:

[Example 600](#example-600)

```markdown
![Foo]

[foo]: /url "title"
```

```html
<p><img src="/url" alt="Foo" title="title" /></p>
```

If you just want a literal `!` followed by bracketed text, you can backslash-escape the opening `[`:

[Example 601](#example-601)

```markdown
!\[foo]

[foo]: /url "title"
```

```html
<p>![foo]</p>
```

If you want a link after a literal `!`, backslash-escape the `!`:

[Example 602](#example-602)

```markdown
\![foo]

[foo]: /url "title"
```

```html
<p>!<a href="/url" title="title">foo</a></p>
```

## [](#TOC)6.8Autolinks

[Autolink](#autolink)s are absolute URIs and email addresses inside `<` and `>`. They are parsed as links, with the URL or email address as the link label.

A [URI autolink](#uri-autolink) consists of `<`, followed by an [absolute URI](#absolute-uri) followed by `>`. It is parsed as a link to the URI, with the URI as the link’s label.

An [absolute URI](#absolute-uri), for these purposes, consists of a [scheme](#scheme) followed by a colon (`:`) followed by zero or more characters other than ASCII [whitespace](#whitespace) and control characters, `<`, and `>`. If the URI includes these characters, they must be percent-encoded (e.g. `%20` for a space).

For purposes of this spec, a [scheme](#scheme) is any sequence of 2–32 characters beginning with an ASCII letter and followed by any combination of ASCII letters, digits, or the symbols plus (“+”), period (“.”), or hyphen (“-”).

Here are some valid autolinks:

[Example 603](#example-603)

```markdown
<http://foo.bar.baz>
```

```html
<p><a href="http://foo.bar.baz">http://foo.bar.baz</a></p>
```

[Example 604](#example-604)

```markdown
<http://foo.bar.baz/test?q=hello&id=22&boolean>
```

```html
<p><a href="http://foo.bar.baz/test?q=hello&amp;id=22&amp;boolean">http://foo.bar.baz/test?q=hello&amp;id=22&amp;boolean</a></p>
```

[Example 605](#example-605)

```markdown
<irc://foo.bar:2233/baz>
```

```html
<p><a href="irc://foo.bar:2233/baz">irc://foo.bar:2233/baz</a></p>
```

Uppercase is also fine:

[Example 606](#example-606)

```markdown
<MAILTO:FOO@BAR.BAZ>
```

```html
<p><a href="MAILTO:FOO@BAR.BAZ">MAILTO:FOO@BAR.BAZ</a></p>
```

Note that many strings that count as [absolute URIs](#absolute-uri) for purposes of this spec are not valid URIs, because their schemes are not registered or because of other problems with their syntax:

[Example 607](#example-607)

```markdown
<a+b+c:d>
```

```html
<p><a href="a+b+c:d">a+b+c:d</a></p>
```

[Example 608](#example-608)

```markdown
<made-up-scheme://foo,bar>
```

```html
<p><a href="made-up-scheme://foo,bar">made-up-scheme://foo,bar</a></p>
```

[Example 609](#example-609)

```markdown
<http://../>
```

```html
<p><a href="http://../">http://../</a></p>
```

[Example 610](#example-610)

```markdown
<localhost:5001/foo>
```

```html
<p><a href="localhost:5001/foo">localhost:5001/foo</a></p>
```

Spaces are not allowed in autolinks:

[Example 611](#example-611)

```markdown
<http://foo.bar/baz bim>
```

```html
<p>&lt;http://foo.bar/baz bim&gt;</p>
```

Backslash-escapes do not work inside autolinks:

[Example 612](#example-612)

```markdown
<http://example.com/\[\>
```

```html
<p><a href="http://example.com/%5C%5B%5C">http://example.com/\[\</a></p>
```

An [email autolink](#email-autolink) consists of `<`, followed by an [email address](#email-address), followed by `>`. The link’s label is the email address, and the URL is `mailto:` followed by the email address.

An [email address](#email-address), for these purposes, is anything that matches the [non-normative regex from the HTML5 spec](https://html.spec.whatwg.org/multipage/forms.html#e-mail-state-\(type=email\)):

```
/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?
(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
```

Examples of email autolinks:

[Example 613](#example-613)

```markdown
<foo@bar.example.com>
```

```html
<p><a href="mailto:foo@bar.example.com">foo@bar.example.com</a></p>
```

[Example 614](#example-614)

```markdown
<foo+special@Bar.baz-bar0.com>
```

```html
<p><a href="mailto:foo+special@Bar.baz-bar0.com">foo+special@Bar.baz-bar0.com</a></p>
```

Backslash-escapes do not work inside email autolinks:

[Example 615](#example-615)

```markdown
<foo\+@bar.example.com>
```

```html
<p>&lt;foo+@bar.example.com&gt;</p>
```

These are not autolinks:

[Example 616](#example-616)

```markdown
<>
```

```html
<p>&lt;&gt;</p>
```

[Example 617](#example-617)

```markdown
< http://foo.bar >
```

```html
<p>&lt; http://foo.bar &gt;</p>
```

[Example 618](#example-618)

```markdown
<m:abc>
```

```html
<p>&lt;m:abc&gt;</p>
```

[Example 619](#example-619)

```markdown
<foo.bar.baz>
```

```html
<p>&lt;foo.bar.baz&gt;</p>
```

[Example 620](#example-620)

```markdown
http://example.com
```

```html
<p>http://example.com</p>
```

[Example 621](#example-621)

```markdown
foo@bar.example.com
```

```html
<p>foo@bar.example.com</p>
```

## [](#TOC)6.9Autolinks (extension)

GFM enables the `autolink` extension, where autolinks will be recognised in a greater number of conditions.

[Autolink](#autolink)s can also be constructed without requiring the use of `<` and to `>` to delimit them, although they will be recognized under a smaller set of circumstances. All such recognized autolinks can only come at the beginning of a line, after whitespace, or any of the delimiting characters `*`, `_`, `~`, and `(`.

An [extended www autolink](#extended-www-autolink) will be recognized when the text `www.` is found followed by a [valid domain](#valid-domain). A [valid domain](#valid-domain) consists of segments of alphanumeric characters, underscores (`_`) and hyphens (`-`) separated by periods (`.`). There must be at least one period, and no underscores may be present in the last two segments of the domain.

The scheme `http` will be inserted automatically:

[Example 622](#example-622)

```markdown
www.commonmark.org
```

```html
<p><a href="http://www.commonmark.org">www.commonmark.org</a></p>
```

After a [valid domain](#valid-domain), zero or more non-space non-`<` characters may follow:

[Example 623](#example-623)

```markdown
Visit www.commonmark.org/help for more information.
```

```html
<p>Visit <a href="http://www.commonmark.org/help">www.commonmark.org/help</a> for more information.</p>
```

We then apply [extended autolink path validation](#extended-autolink-path-validation) as follows:

Trailing punctuation (specifically, `?`, `!`, `.`, `,`, `:`, `*`, `_`, and `~`) will not be considered part of the autolink, though they may be included in the interior of the link:

[Example 624](#example-624)

```markdown
Visit www.commonmark.org.

Visit www.commonmark.org/a.b.
```

```html
<p>Visit <a href="http://www.commonmark.org">www.commonmark.org</a>.</p>
<p>Visit <a href="http://www.commonmark.org/a.b">www.commonmark.org/a.b</a>.</p>
```

When an autolink ends in `)`, we scan the entire autolink for the total number of parentheses. If there is a greater number of closing parentheses than opening ones, we don’t consider the unmatched trailing parentheses part of the autolink, in order to facilitate including an autolink inside a parenthesis:

[Example 625](#example-625)

```markdown
www.google.com/search?q=Markup+(business)

www.google.com/search?q=Markup+(business)))

(www.google.com/search?q=Markup+(business))

(www.google.com/search?q=Markup+(business)
```

```html
<p><a href="http://www.google.com/search?q=Markup+(business)">www.google.com/search?q=Markup+(business)</a></p>
<p><a href="http://www.google.com/search?q=Markup+(business)">www.google.com/search?q=Markup+(business)</a>))</p>
<p>(<a href="http://www.google.com/search?q=Markup+(business)">www.google.com/search?q=Markup+(business)</a>)</p>
<p>(<a href="http://www.google.com/search?q=Markup+(business)">www.google.com/search?q=Markup+(business)</a></p>
```

This check is only done when the link ends in a closing parentheses `)`, so if the only parentheses are in the interior of the autolink, no special rules are applied:

[Example 626](#example-626)

```markdown
www.google.com/search?q=(business))+ok
```

```html
<p><a href="http://www.google.com/search?q=(business))+ok">www.google.com/search?q=(business))+ok</a></p>
```

If an autolink ends in a semicolon (`;`), we check to see if it appears to resemble an [entity reference](#entity-references); if the preceding text is `&` followed by one or more alphanumeric characters. If so, it is excluded from the autolink:

[Example 627](#example-627)

```markdown
www.google.com/search?q=commonmark&hl=en

www.google.com/search?q=commonmark&hl;
```

```html
<p><a href="http://www.google.com/search?q=commonmark&amp;hl=en">www.google.com/search?q=commonmark&amp;hl=en</a></p>
<p><a href="http://www.google.com/search?q=commonmark">www.google.com/search?q=commonmark</a>&amp;hl;</p>
```

`<` immediately ends an autolink.

[Example 628](#example-628)

```markdown
www.commonmark.org/he<lp
```

```html
<p><a href="http://www.commonmark.org/he">www.commonmark.org/he</a>&lt;lp</p>
```

An [extended url autolink](#extended-url-autolink) will be recognised when one of the schemes `http://`, or `https://`, followed by a [valid domain](#valid-domain), then zero or more non-space non-`<` characters according to [extended autolink path validation](#extended-autolink-path-validation):

[Example 629](#example-629)

```markdown
http://commonmark.org

(Visit https://encrypted.google.com/search?q=Markup+(business))
```

```html
<p><a href="http://commonmark.org">http://commonmark.org</a></p>
<p>(Visit <a href="https://encrypted.google.com/search?q=Markup+(business)">https://encrypted.google.com/search?q=Markup+(business)</a>)</p>
```

An [extended email autolink](#extended-email-autolink) will be recognised when an email address is recognised within any text node. Email addresses are recognised according to the following rules:

-   One ore more characters which are alphanumeric, or `.`, `-`, `_`, or `+`.
-   An `@` symbol.
-   One or more characters which are alphanumeric, or `-` or `_`, separated by periods (`.`). There must be at least one period. The last character must not be one of `-` or `_`.

The scheme `mailto:` will automatically be added to the generated link:

[Example 630](#example-630)

```markdown
foo@bar.baz
```

```html
<p><a href="mailto:foo@bar.baz">foo@bar.baz</a></p>
```

`+` can occur before the `@`, but not after.

[Example 631](#example-631)

```markdown
hello@mail+xyz.example isn't valid, but hello+xyz@mail.example is.
```

```html
<p>hello@mail+xyz.example isn't valid, but <a href="mailto:hello+xyz@mail.example">hello+xyz@mail.example</a> is.</p>
```

`.`, `-`, and `_` can occur on both sides of the `@`, but only `.` may occur at the end of the email address, in which case it will not be considered part of the address:

[Example 632](#example-632)

```markdown
a.b-c_d@a.b

a.b-c_d@a.b.

a.b-c_d@a.b-

a.b-c_d@a.b_
```

```html
<p><a href="mailto:a.b-c_d@a.b">a.b-c_d@a.b</a></p>
<p><a href="mailto:a.b-c_d@a.b">a.b-c_d@a.b</a>.</p>
<p>a.b-c_d@a.b-</p>
<p>a.b-c_d@a.b_</p>
```

An [extended protocol autolink](#extended-protocol-autolink) will be recognised when a protocol is recognised within any text node. Valid protocols are:

-   `mailto:`
-   `xmpp:`

The scheme of the protocol will automatically be added to the generated link. All the rules of email address autolinking apply.

[Example 633](#example-633)

```markdown
mailto:foo@bar.baz

mailto:a.b-c_d@a.b

mailto:a.b-c_d@a.b.

mailto:a.b-c_d@a.b/

mailto:a.b-c_d@a.b-

mailto:a.b-c_d@a.b_

xmpp:foo@bar.baz

xmpp:foo@bar.baz.
```

```html
<p><a href="mailto:foo@bar.baz">mailto:foo@bar.baz</a></p>
<p><a href="mailto:a.b-c_d@a.b">mailto:a.b-c_d@a.b</a></p>
<p><a href="mailto:a.b-c_d@a.b">mailto:a.b-c_d@a.b</a>.</p>
<p><a href="mailto:a.b-c_d@a.b">mailto:a.b-c_d@a.b</a>/</p>
<p>mailto:a.b-c_d@a.b-</p>
<p>mailto:a.b-c_d@a.b_</p>
<p><a href="xmpp:foo@bar.baz">xmpp:foo@bar.baz</a></p>
<p><a href="xmpp:foo@bar.baz">xmpp:foo@bar.baz</a>.</p>
```

A described in the [specification](https://datatracker.ietf.org/doc/rfc7622/) `xmpp` offers an optional `/` followed by a resource. The resource can contain all alphanumeric characters, as well as `@` and `.`.

[Example 634](#example-634)

```markdown
xmpp:foo@bar.baz/txt

xmpp:foo@bar.baz/txt@bin

xmpp:foo@bar.baz/txt@bin.com
```

```html
<p><a href="xmpp:foo@bar.baz/txt">xmpp:foo@bar.baz/txt</a></p>
<p><a href="xmpp:foo@bar.baz/txt@bin">xmpp:foo@bar.baz/txt@bin</a></p>
<p><a href="xmpp:foo@bar.baz/txt@bin.com">xmpp:foo@bar.baz/txt@bin.com</a></p>
```

Further `/` characters are not considered part of the domain:

[Example 635](#example-635)

```markdown
xmpp:foo@bar.baz/txt/bin
```

```html
<p><a href="xmpp:foo@bar.baz/txt">xmpp:foo@bar.baz/txt</a>/bin</p>
```

## [](#TOC)6.10Raw HTML

Text between `<` and `>` that looks like an HTML tag is parsed as a raw HTML tag and will be rendered in HTML without escaping. Tag and attribute names are not limited to current HTML tags, so custom tags (and even, say, DocBook tags) may be used.

Here is the grammar for tags:

A [tag name](#tag-name) consists of an ASCII letter followed by zero or more ASCII letters, digits, or hyphens (`-`).

An [attribute](#attribute) consists of [whitespace](#whitespace), an [attribute name](#attribute-name), and an optional [attribute value specification](#attribute-value-specification).

An [attribute name](#attribute-name) consists of an ASCII letter, `_`, or `:`, followed by zero or more ASCII letters, digits, `_`, `.`, `:`, or `-`. (Note: This is the XML specification restricted to ASCII. HTML5 is laxer.)

An [attribute value specification](#attribute-value-specification) consists of optional [whitespace](#whitespace), a `=` character, optional [whitespace](#whitespace), and an [attribute value](#attribute-value).

An [attribute value](#attribute-value) consists of an [unquoted attribute value](#unquoted-attribute-value), a [single-quoted attribute value](#single-quoted-attribute-value), or a [double-quoted attribute value](#double-quoted-attribute-value).

An [unquoted attribute value](#unquoted-attribute-value) is a nonempty string of characters not including [whitespace](#whitespace), `"`, `'`, `=`, `<`, `>`, or `` ` ``.

A [single-quoted attribute value](#single-quoted-attribute-value) consists of `'`, zero or more characters not including `'`, and a final `'`.

A [double-quoted attribute value](#double-quoted-attribute-value) consists of `"`, zero or more characters not including `"`, and a final `"`.

An [open tag](#open-tag) consists of a `<` character, a [tag name](#tag-name), zero or more [attributes](#attribute), optional [whitespace](#whitespace), an optional `/` character, and a `>` character.

A [closing tag](#closing-tag) consists of the string `</`, a [tag name](#tag-name), optional [whitespace](#whitespace), and the character `>`.

An [HTML comment](#html-comment) consists of `<!--` + *text* + `-->`, where *text* does not start with `>` or `->`, does not end with `-`, and does not contain `--`. (See the [HTML5 spec](http://www.w3.org/TR/html5/syntax.html#comments).)

A [processing instruction](#processing-instruction) consists of the string `<?`, a string of characters not including the string `?>`, and the string `?>`.

A [declaration](#declaration) consists of the string `<!`, a name consisting of one or more uppercase ASCII letters, [whitespace](#whitespace), a string of characters not including the character `>`, and the character `>`.

A [CDATA section](#cdata-section) consists of the string `<![CDATA[`, a string of characters not including the string `]]>`, and the string `]]>`.

An [HTML tag](#html-tag) consists of an [open tag](#open-tag), a [closing tag](#closing-tag), an [HTML comment](#html-comment), a [processing instruction](#processing-instruction), a [declaration](#declaration), or a [CDATA section](#cdata-section).

Here are some simple open tags:

[Example 636](#example-636)

```markdown
<a><bab><c2c>
```

```html
<p><a><bab><c2c></p>
```

Empty elements:

[Example 637](#example-637)

```markdown
<a/><b2/>
```

```html
<p><a/><b2/></p>
```

[Whitespace](#whitespace) is allowed:

[Example 638](#example-638)

```markdown
<a  /><b2
data="foo" >
```

```html
<p><a  /><b2
data="foo" ></p>
```

With attributes:

[Example 639](#example-639)

```markdown
<a foo="bar" bam = 'baz <em>"</em>'
_boolean zoop:33=zoop:33 />
```

```html
<p><a foo="bar" bam = 'baz <em>"</em>'
_boolean zoop:33=zoop:33 /></p>
```

Custom tag names can be used:

[Example 640](#example-640)

```markdown
Foo <responsive-image src="foo.jpg" />
```

```html
<p>Foo <responsive-image src="foo.jpg" /></p>
```

Illegal tag names, not parsed as HTML:

[Example 641](#example-641)

```markdown
<33> <__>
```

```html
<p>&lt;33&gt; &lt;__&gt;</p>
```

Illegal attribute names:

[Example 642](#example-642)

```markdown
<a h*#ref="hi">
```

```html
<p>&lt;a h*#ref=&quot;hi&quot;&gt;</p>
```

Illegal attribute values:

[Example 643](#example-643)

```markdown
<a href="hi'> <a href=hi'>
```

```html
<p>&lt;a href=&quot;hi'&gt; &lt;a href=hi'&gt;</p>
```

Illegal [whitespace](#whitespace):

[Example 644](#example-644)

```markdown
< a><
foo><bar/ >
<foo bar=baz
bim!bop />
```

```html
<p>&lt; a&gt;&lt;
foo&gt;&lt;bar/ &gt;
&lt;foo bar=baz
bim!bop /&gt;</p>
```

Missing [whitespace](#whitespace):

[Example 645](#example-645)

```markdown
<a href='bar'title=title>
```

```html
<p>&lt;a href='bar'title=title&gt;</p>
```

Closing tags:

[Example 646](#example-646)

```markdown
</a></foo >
```

```html
<p></a></foo ></p>
```

Illegal attributes in closing tag:

[Example 647](#example-647)

```markdown
</a href="foo">
```

```html
<p>&lt;/a href=&quot;foo&quot;&gt;</p>
```

Comments:

[Example 648](#example-648)

```markdown
foo <!-- this is a
comment - with hyphen -->
```

```html
<p>foo <!-- this is a
comment - with hyphen --></p>
```

[Example 649](#example-649)

```markdown
foo <!-- not a comment -- two hyphens -->
```

```html
<p>foo &lt;!-- not a comment -- two hyphens --&gt;</p>
```

Not comments:

[Example 650](#example-650)

```markdown
foo <!--> foo -->

foo <!-- foo--->
```

```html
<p>foo &lt;!--&gt; foo --&gt;</p>
<p>foo &lt;!-- foo---&gt;</p>
```

Processing instructions:

[Example 651](#example-651)

```markdown
foo <?php echo $a; ?>
```

```html
<p>foo <?php echo $a; ?></p>
```

Declarations:

[Example 652](#example-652)

```markdown
foo <!ELEMENT br EMPTY>
```

```html
<p>foo <!ELEMENT br EMPTY></p>
```

CDATA sections:

[Example 653](#example-653)

```markdown
foo <![CDATA[>&<]]>
```

```html
<p>foo <![CDATA[>&<]]></p>
```

Entity and numeric character references are preserved in HTML attributes:

[Example 654](#example-654)

```markdown
foo <a href="&ouml;">
```

```html
<p>foo <a href="&ouml;"></p>
```

Backslash escapes do not work in HTML attributes:

[Example 655](#example-655)

```markdown
foo <a href="\*">
```

```html
<p>foo <a href="\*"></p>
```

[Example 656](#example-656)

```markdown
<a href="\"">
```

```html
<p>&lt;a href=&quot;&quot;&quot;&gt;</p>
```

## [](#TOC)6.11Disallowed Raw HTML (extension)

GFM enables the `tagfilter` extension, where the following HTML tags will be filtered when rendering HTML output:

-   `<title>`
-   `<textarea>`
-   `<style>`
-   `<xmp>`
-   `<iframe>`
-   `<noembed>`
-   `<noframes>`
-   `<script>`
-   `<plaintext>`

Filtering is done by replacing the leading `<` with the entity `&lt;`. These tags are chosen in particular as they change how HTML is interpreted in a way unique to them (i.e. nested HTML is interpreted differently), and this is usually undesireable in the context of other rendered Markdown content.

All other HTML tags are left untouched.

[Example 657](#example-657)

```markdown
<strong> <title> <style> <em>

<blockquote>
  <xmp> is disallowed.  <XMP> is also disallowed.
</blockquote>
```

```html
<p><strong> &lt;title> &lt;style> <em></p>
<blockquote>
  &lt;xmp> is disallowed.  &lt;XMP> is also disallowed.
</blockquote>
```

## [](#TOC)6.12Hard line breaks

A line break (not in a code span or HTML tag) that is preceded by two or more spaces and does not occur at the end of a block is parsed as a [hard line break](#hard-line-break) (rendered in HTML as a `<br />` tag):

[Example 658](#example-658)

```markdown
foo  
baz
```

```html
<p>foo<br />
baz</p>
```

For a more visible alternative, a backslash before the [line ending](#line-ending) may be used instead of two spaces:

[Example 659](#example-659)

```markdown
foo\
baz
```

```html
<p>foo<br />
baz</p>
```

More than two spaces can be used:

[Example 660](#example-660)

```markdown
foo       
baz
```

```html
<p>foo<br />
baz</p>
```

Leading spaces at the beginning of the next line are ignored:

[Example 661](#example-661)

```markdown
foo  
     bar
```

```html
<p>foo<br />
bar</p>
```

[Example 662](#example-662)

```markdown
foo\
     bar
```

```html
<p>foo<br />
bar</p>
```

Line breaks can occur inside emphasis, links, and other constructs that allow inline content:

[Example 663](#example-663)

```markdown
*foo  
bar*
```

```html
<p><em>foo<br />
bar</em></p>
```

[Example 664](#example-664)

```markdown
*foo\
bar*
```

```html
<p><em>foo<br />
bar</em></p>
```

Line breaks do not occur inside code spans

[Example 665](#example-665)

```markdown
`code  
span`
```

```html
<p><code>code   span</code></p>
```

[Example 666](#example-666)

```markdown
`code\
span`
```

```html
<p><code>code\ span</code></p>
```

or HTML tags:

[Example 667](#example-667)

```markdown
<a href="foo  
bar">
```

```html
<p><a href="foo  
bar"></p>
```

[Example 668](#example-668)

```markdown
<a href="foo\
bar">
```

```html
<p><a href="foo\
bar"></p>
```

Hard line breaks are for separating inline content within a block. Neither syntax for hard line breaks works at the end of a paragraph or other block element:

[Example 669](#example-669)

```markdown
foo\
```

```html
<p>foo\</p>
```

[Example 670](#example-670)

```markdown
foo  
```

```html
<p>foo</p>
```

[Example 671](#example-671)

```markdown
### foo\
```

```html
<h3>foo\</h3>
```

[Example 672](#example-672)

```markdown
### foo  
```

```html
<h3>foo</h3>
```

## [](#TOC)6.13Soft line breaks

A regular line break (not in a code span or HTML tag) that is not preceded by two or more spaces or a backslash is parsed as a [softbreak](#softbreak). (A softbreak may be rendered in HTML either as a [line ending](#line-ending) or as a space. The result will be the same in browsers. In the examples here, a [line ending](#line-ending) will be used.)

[Example 673](#example-673)

```markdown
foo
baz
```

```html
<p>foo
baz</p>
```

Spaces at the end of the line and beginning of the next line are removed:

[Example 674](#example-674)

```markdown
foo 
 baz
```

```html
<p>foo
baz</p>
```

A conforming parser may render a soft line break in HTML either as a line break or as a space.

A renderer may also provide an option to render soft line breaks as hard line breaks.

## [](#TOC)6.14Textual content

Any characters not given an interpretation by the above rules will be parsed as plain textual content.

[Example 675](#example-675)

```markdown
hello $.;'there
```

```html
<p>hello $.;'there</p>
```

[Example 676](#example-676)

```markdown
Foo χρῆν
```

```html
<p>Foo χρῆν</p>
```

Internal spaces are preserved verbatim:

[Example 677](#example-677)

```markdown
Multiple     spaces
```

```html
<p>Multiple     spaces</p>
```

---

> **Navigation:** [← 05-container-blocks.md](05-container-blocks.md) | [INDEX](INDEX.md) | [07-appendix-parsing-strategy.md →](07-appendix-parsing-strategy.md)
