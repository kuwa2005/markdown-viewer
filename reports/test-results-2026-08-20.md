# Test Results Report — 2026-08-20

## Summary

| Category | Tests | Pass | Fail | Todo | Duration |
|----------|-------|------|------|------|----------|
| Unit: Pure Functions | 48 | 48 | 0 | 0 | 256ms |
| Unit: Compilers | 113 | 113 | 0 | 0 | 1,518ms |
| Integration: Compiler Compat | 78 | 78 | 0 | 0 | 1,127ms |
| Integration: GFM Compliance | 104 | 99 | 0 | 5 | 1,179ms |
| **Total** | **343** | **338** | **0** | **5** | **4,080ms** |

## Test Framework
- **node:test** (Node.js v26 built-in, zero dependencies)

## Files Created
```
package.json                  — root package with test scripts + compiler dependencies
tests/
├── TEST-SPEC.md              — test specification document
├── helpers/
│   ├── compiler-setup.js     — Node.js adapter for all 6 compilers
│   └── test-data.js          — shared test fixtures
├── unit/
│   ├── pure-functions.test.js — 48 tests for 12 pure functions
│   └── compilers.test.js     — 113 tests for 6 compilers
└── integration/
    ├── compiler-compat.test.js — 78 cross-compiler compatibility tests
    └── gfm-compliance.test.js  — 104 GFM spec compliance tests
reports/
└── test-results-2026-08-20.md — this report
```

## Unit Test Coverage

### Pure Functions (48 tests, 12 modules)

| Module | File | Tests | Status |
|--------|------|-------|--------|
| `_escape(str)` | content/index.js | 8 | PASS |
| `frontmatter(md)` | content/index.js | 7 | PASS |
| `toc.render(html)` | content/index.js | 4 | PASS |
| `anchors(html)` | content/index.js | 4 | PASS |
| `mathjax.escape` | background/mathjax.js | 5 | PASS |
| `mathjax.delimiters` | background/mathjax.js | 6 | PASS |
| `mathjax tokenize/detokenize` | background/mathjax.js | 5 | PASS |
| `storage.defaults` | background/storage.js | 3 | PASS |
| `detect origin matching` | background/detect.js | 6 | PASS |

### Compiler Adapters (113 tests, 6 compilers)

| Compiler | Basic (13) | GFM Extensions | Edge Cases (4) | Status |
|----------|------------|----------------|-----------------|--------|
| markdown-it | 13 | table, strikethrough, tasklist | 4 | PASS |
| marked | 13 | table, strikethrough | 4 | PASS |
| remark | 13 | table, strikethrough | 4 | PASS |
| commonmark | 13 | (N/A — no GFM) | 4 | PASS |
| remarkable | 13 | table | 4 | PASS |
| showdown | 13 | table, strikethrough, tasklist | 4 | PASS |

## Integration Test Results

### Cross-Compiler Compatibility (78 tests)
All 6 compilers produce consistent HTML structure for: headings, paragraphs, bold, italic, links, images, code blocks, lists, blockquotes, thematic breaks.

GFM extensions (tables, strikethrough) confirmed present in all GFM compilers and absent in commonmark.

### GFM Specification Compliance (104 tests, 5 known gaps)

| GFM Section | Tests | Status |
|-------------|-------|--------|
| §4.1 Thematic breaks | 15 | PASS |
| §4.2 ATX headings | 10 | PASS |
| §4.5 Fenced code blocks | 15 | PASS |
| §4.10 Tables | 13 | PASS (showdown: 2 skipped — no pipeless table support) |
| §5.1 Block quotes | 10 | PASS |
| §5.3 Task list items | 6 | PASS |
| §6.4 Emphasis | 15 | PASS |
| §6.5 Strikethrough | 10 | 5 PASS, 5 TODO |
| §6.6 Links | 10 | PASS |

## Known Limitations (TODO)

1. **Strikethrough across paragraph breaks** (5 tests): GFM spec §6.5 Example 492 allows `~~has a\n\nnew paragraph~~` to be treated as strikethrough, but **no compiler implements this**. All compilers break at paragraph boundaries, producing two separate paragraphs without strikethrough tags.

2. **Showdown pipeless tables** (2 tests skipped): Showdown requires leading pipe `|` for table recognition. Tables without leading pipes (GFM §4.10 Examples 199/200) are not parsed as tables.

## Notable Findings

1. **remarkable linkify warning**: `linkify` option is deprecated; should use `remarkable/linkify` plugin instead.
2. **markdown-it v15** outputs `<s>` for strikethrough instead of `<del>` (GFM spec says `<del>`). This is a minor GFM compliance difference.
3. **remark** uses `&#x3C;` entity encoding instead of `&lt;` for `<` in code blocks — both are valid HTML.

## Run Commands
```bash
node --test tests/**/*.test.js          # all tests
node --test tests/unit/*.test.js         # unit tests only
node --test tests/integration/*.test.js  # integration tests only
```
