# テスト仕様書 — Markdown Viewer

## 概要
Markdown Viewer 拡張機能の品質保証のため、単体テストと結合テストを作成・実行する。

## テストフレームワーク
- **node:test** (Node.js v26 組み込み、ゼロ依存)

## テスト対象
21個のコンポーネントを3カテゴリに分類してテストする。

---

## Part 1: 単体テスト (Unit Tests)

### 1.1 Pure Functions (`tests/unit/pure-functions.test.js`)

| # | テスト対象 | ファイル | テスト内容 |
|---|-----------|---------|-----------|
| 1 | `_escape(str)` | content/index.js:257 | HTML エスケープ: `&`→`&amp;`, `<`→`&lt;`, `>`→`&gt;` |
| 2 | `frontmatter(md)` | content/index.js:236 | YAML frontmatter 除去、TOML frontmatter 除去、title 抽出、frontmatter なしの入力 |
| 3 | `toc.render(html)` | content/index.js:217 | ネストした ToC 生成、h1-h6 の抽出、リンク生成 |
| 4 | `anchors(html)` | content/index.js:210 | 見出しにアンカーリンク追加 |
| 5 | `emojinator(str)` | content/emoji.js:2 | 絵文字ショートコード変換 |
| 6 | `mathjax.escape(math)` | background/mathjax.js:13 | HTML エスケープ: `<`,`>`,`&` |
| 7 | `mathjax.delimiters` | background/mathjax.js:4 | 正規表現マッチ: `$$..$$`, `\(...\)`, `\[...\]`, `\begin{...\end{...}`, `$...$` |
| 8 | `mathjax().tokenize(md)` | background/mathjax.js:20 | 数式をプレースホルダ `?N?` に置換 |
| 9 | `mathjax().detokenize(html)` | background/mathjax.js:27 | プレースホルダから数式を復元 + エスケープ |
| 10 | `storage.defaults(compilers)` | background/storage.js:38 | デフォルト設定オブジェクトの生成 |
| 11 | `storage.migrations(state)` | background/storage.js:92 | バージョンマイグレーション（v3.6→v5.3） |
| 12 | `detect(content, url)` | background/detect.js:81 | Origin パターンマッチング（優先順位付き） |

### 1.2 コンパイラアダプタ (`tests/unit/compilers.test.js`)

| # | テスト対象 | ファイル | テスト内容 |
|---|-----------|---------|-----------|
| 13 | markdown-it | background/compilers/markdown-it.js | 基本変換、GFM 拡張（tables, strikethrough）、プラグイン（tasklists, abbr 等） |
| 14 | marked | background/compilers/marked.js | 基本変換、GFM モード、linkify |
| 15 | remark | background/compilers/remark.js | 基本変換、GFM モード、sanitize |
| 16 | commonmark | background/compilers/commonmark.js | 基本変換、safe モード |
| 17 | showdown | background/compilers/showdown.js | 基本変換、github フレーバー |
| 18 | remarkable | background/compilers/remarkable.js | 基本変換、linkify |

各コンパイラテスト:
- 基本: 見出し、段落、リスト、コードブロック、リンク、画像
- GFM: テーブル、取り消し線、タスクリスト、autolink
- エッジケース: 空入力、巨大入力、特殊文字

---

## Part 2: 結合テスト (Integration Tests)

### 2.1 コンパイラ間互換テスト (`tests/integration/compiler-compat.test.js`)

同一 Markdown を全コンパイラでコンパイルし、主要 HTML 構造が一致することを検証:

| テストケース | 検証内容 |
|-------------|---------|
| 見出し | `<h1>`〜`<h6>` が含まれること |
| 段落 | `<p>` が含まれること |
| 強調 | `<em>`, `<strong>` が含まれること |
| リンク | `<a href="...">` が含まれること |
| 画像 | `<img src="...">` が含まれること |
| コードブロック | `<pre><code>` が含まれること |
| リスト | `<ul>`, `<ol>`, `<li>` が含まれること |
| テーブル | `<table>`, `<thead>`, `<tbody>` が含まれること（GFM対応コンパイラのみ） |
| 取り消し線 | `<del>` が含まれること（GFM対応コンパイラのみ） |

### 2.2 GFM 仕様準拠テスト (`tests/integration/gfm-compliance.test.js`)

`gfm-specifications/` の Examples を使ってコンパイラの出力を検証:

| テスト対象 | GFM セクション | テスト内容 |
|-----------|---------------|-----------|
| Tables | §4.10 | 基本テーブル、アライメント、繰り返し区切り行 |
| Task lists | §5.3 | チェックボックス、ネスト |
| Strikethrough | §6.5 | `~~text~~` → `<del>` |
| ATX headings | §4.2 | h1-h6、閉じる `#` |
| Fenced code blocks | §4.5 | バッククォート、チルダ、info string |
| Thematic breaks | §4.1 | `***`, `---`, `___` |
| Block quotes | §5.1 | ネスト、laziness |
| Emphasis | §6.4 | `*`, `**`, `_`, `__` |

---

## Part 3: テスト環境

### 3.1 必要なセットアップ
1. ルート `package.json` 作成（node:test テストスクリプト含む）
2. npm install でコンパイラ依存をインストール
3. コンパイラアダプタを Node.js から利用できるようラッパー作成

### 3.2 ファイル構成
```
tests/
├── unit/
│   ├── pure-functions.test.js    # 12個の純粋関数テスト
│   └── compilers.test.js         # 6個のコンパイラテスト
├── integration/
│   ├── compiler-compat.test.js   # コンパイラ間互換テスト
│   └── gfm-compliance.test.js    # GFM仕様準拠テスト
├── helpers/
│   ├── compiler-setup.js         # コンパイラグローバル設定
│   └── test-data.js              # 共通テストデータ
└── TEST-SPEC.md                  # 本仕様書
reports/
└── test-results-YYYY-MM-DD.md    # テスト結果レポート
```

### 3.3 成功基準
- 全単体テスト: PASS
- 全結合テスト: PASS
- テスト結果が `reports/` に出力されること
- カバレッジ: 対象21コンポーネント全てに最低1テストあること
