# GFM Compliance Gap Analysis — Markdown Viewer v5.3

## 概要

Markdown Viewer 拡張機能と GitHub Flavored Markdown (GFM) v0.29-gfm 仕様との差異を分析し、未実装機能・仕様違反・実装優先度をまとめたもの。

GFM は CommonMark の strict superset であり、以下の 5 つの拡張を定義:
1. **Tables** (§4.10)
2. **Task list items** (§5.3)
3. **Strikethrough** (§6.5)
4. **Autolinks (extended)** (§6.9)
5. **Disallowed Raw HTML / tagfilter** (§6.11)

---

## 1. 各コンパイラの GFM 拡張対応状況

### markdown-it（デフォルトコンパイラ）

| GFM 拡張 | 対応状況 | 備考 |
|-----------|----------|------|
| Tables | **非公開** | markdown-it v13 はコアで `markdown-it-table` を含むが、拡張オプションとして UI に未公開 |
| Task lists | **プラグインで対応** | `md.tasklists` プラグイン。UI で `tasklists: false` がデフォルト。GFM 互換 |
| Strikethrough | **非公開** | markdown-it はコアで `~text~` をサポートするが、拡張オプションとして UI に未公開 |
| Autolinks (extended) | **部分的** | `linkify: true` で URL-like テキストをリンク化するが、GFM の www autolink / email autolink の完全な仕様には未準拠 |
| Disallowed Raw HTML | **未実装** | tagfilter に相当する機能なし |

### marked

| GFM 拡張 | 対応状況 | 備考 |
|-----------|----------|------|
| Tables | **デフォルト有効** | `gfm: true` で有効。GFM 互換 |
| Task lists | **デフォルト有効** | `gfm: true` で有効。`<input type="checkbox">` 出力 |
| Strikethrough | **デフォルト有効** | `gfm: true` で `~~text~~` → `<del>` 変換 |
| Autolinks (extended) | **部分的** | linkify プラグインで URL 自動リンク化。extended www autolink は未対応 |
| Disallowed Raw HTML | **未実装** | tagfilter に相当する機能なし |

### remark

| GFM 拡張 | 対応状況 | 備考 |
|-----------|----------|------|
| Tables | **デフォルト有効** | `remark-gfm` プラグインで有効。GFM 互換 |
| Task lists | **デフォルト有効** | `remark-gfm` プラグインで有効 |
| Strikethrough | **デフォルト有効** | `remark-gfm` プラグインで有効 |
| Autolinks (extended) | **未対応** | remark-gfm は基本的な autolink のみ |
| Disallowed Raw HTML | **未実装** | tagfilter に相当する機能なし |

### commonmark

| GFM 拡張 | 対応状況 | 備考 |
|-----------|----------|------|
| 全ての GFM 拡張 | **未対応** | CommonMark 仕様のみ。GFM 拡張は一切含まない。設計上正しい |

### showdown

| GFM 拡張 | 対応状況 | 備考 |
|-----------|----------|------|
| Tables | **`github` フレーバーで有効** | GFM 互換 |
| Task lists | **`github` フレーバーで有効** | GFM 互換 |
| Strikethrough | **`github` フレーバーで有効** | GFM 互換 |
| Autolinks (extended) | **`simplifiedAutoLink` で部分的** | www autolink は対応。email autolink は未対応 |
| Disallowed Raw HTML | **未実装** | tagfilter に相当する機能なし |

### remarkable

| GFM 拡張 | 対応状況 | 備考 |
|-----------|----------|------|
| Tables | **デフォルト有効** | remarkable はデフォルトでテーブル対応 |
| Task lists | **未対応** | プラグイン要 |
| Strikethrough | **未対応** | プラグイン要 |
| Autolinks (extended) | **`linkify: true` で部分的** | URL-like テキストの自動リンク化のみ |
| Disallowed Raw HTML | **未実装** | tagfilter に相当する機能なし |

---

## 2. 未実装機能・差異の詳細リスト

### P0 — 高優先度（GFM コア拡張、GitHub での利用に必須）

| # | 機能 | GFM セクション | 状況 | 影響 |
|---|------|---------------|------|------|
| 1 | **Strikethrough の UI トグル** | §6.5 | markdown-it は非公開。marked/remark は gfm オプションで一括制御 | デフォルトコンパイラで `~~text~~` がユーザー制御できない |
| 2 | **Tables の UI トグル** | §4.10 | markdown-it は非公開。marked/remark は gfm オプションで一括制御 | デフォルトコンパイラでテーブルがユーザー制御できない |
| 3 | **markdown-it の GFM 拡張を個別公開** | §4.10, §5.3, §6.5 | markdown-it は tables/strikethrough を含むが UI に未公開 | デフォルトコンパイラの GFM 拡張が隠れている |

### P1 — 中優先度（GFM 仕様準拠、セキュリティ関連）

| # | 機能 | GFM セクション | 状況 | 影響 |
|---|------|---------------|------|------|
| 4 | **Disallowed Raw HTML (tagfilter)** | §6.11 | 全コンパイラで未実装 | `<script>`, `<iframe>` 等の危険な HTML タグがフィルタされない。GitHub.com ではサニタイズ処理で対応しているが、ローカルファイル閲覧時は無防備 |
| 5 | **Extended Autolinks** | §6.9 | linkify は URL-like テキストのみ。`www.` からの autolink、email autolink は未対応 | `www.example.com` がリンクとして認識されない（linkify は `http://` 付きのみ対応） |

### P2 — 低優先度（互換性向上）

| # | 機能 | GFM セクション | 状況 | 影響 |
|---|------|---------------|------|------|
| 6 | **Markdown-it の GFM プラグイン統合** | 全体 | 現在 plugins は個別だが、GFM 全拡張を1トグルで有効化する convenience オプションがない | ユーザーが GFM 互換モードをワンクリックで選択できない |
| 7 | **marked の extended autolink** | §6.9 | marked v12 は `extendedAutolink` をサポートするが、拡張として未統合 | marked ユーザーが extended autolink を利用できない |
| 8 | **remark の autolink 拡張** | §6.9 | remark-gfm は extended autolink を含むが、拡張として未統合 | remark ユーザーが extended autolink を利用できない |

---

## 3. 各コンパイラ別の実装推奨事項

### markdown-it（デフォルト — 最も重要）

```javascript
// 現在の defaults（非公開の GFM 拡張あり）
var defaults = {
  breaks: false,
  html: true,
  linkify: true,
  // ... 以下はプラグインとして個別公開
  tasklists: false,
  // 未公開: tables (コア内蔵), strikethrough (コア内蔵)
}

// 推奨: GFM 拡張を個別公開
var defaults = {
  // 既存
  breaks: false,
  html: true,
  linkify: true,
  typographer: false,
  xhtmlOut: false,
  // 新規: GFM 拡張
  tables: true,        // §4.10 — コア内蔵、デフォルト有効
  strikethrough: true,  // §6.5 — コア内蔵、デフォルト有効
  // 既存プラグイン
  tasklists: false,
  // ... 他のプラグイン
}
```

### marked

```javascript
// 現在
var defaults = {
  gfm: true,       // GFM 全拡張を一括制御
  breaks: false,
  // 未公開: extendedAutolink
}

// 推奨: extended autolink を公開
var defaults = {
  gfm: true,
  breaks: false,
  extendedAutolink: true,  // §6.9 — marked v12 でサポート
}
```

### remark

```javascript
// 現在
var defaults = {
  gfm: true,       // remark-gfm で全拡張を一括制御
  breaks: false,
}

// 推奨: extended autolink を個別制御可能に
// remark-gfm の extendedAutolink オプションを公開
```

---

## 4. GFM 仕様 §1.4 「About this document」 の補足

GFM 仕様自体が注記している重要な制約:

> GitHub.com and GitHub Enterprise perform additional **post-processing and sanitization** after GFM is converted to HTML to ensure security and consistency of the website.

つまり:
- GFM 仕様は Markdown → HTML 変換の構文のみを定義
- GitHub.com はさらにサニタイズ（HTML タグのフィルタ、XSS 対策等）を適用
- Markdown Viewer はブラウザ拡張として動作するため、このポストプロセシングは別途実装が必要

---

## 5. 実装優先度サマリー

| 優先度 | 実装内容 | 推定工数 | 理由 |
|--------|---------|---------|------|
| **P0** | markdown-it の `tables` / `strikethrough` を UI に公開 | 小（各1行追加） | デフォルトコンパイラで GFM 拡張が隠れている問題。最も簡単な改善 |
| **P0** | marked の `extendedAutolink` を UI に公開 | 小（1行追加） | marked v12 がサポートしているが未公開 |
| **P1** | Disallowed Raw HTML (tagfilter) の実装 | 中（コンパイラ横断のフィルタ層追加） | セキュリティ上の懸念。ローカルファイル閲覧時に `<script>` 等が実行される可能性 |
| **P1** | remark の extended autolink 統合 | 小 | remark-gfm が拡張 autolink を含むが未統合 |
| **P2** | markdown-it の GFM 全拡張 One-Toggle | 小 | UX 向上。GFM 互換モードをワンクリックで |
| **P2** | 各コンパイラの GFM 拡張カバレッジ統一 | 中 | コンパイラ間の機能差を埋める |

---

## 6. テスト方針

各 GFM 拡張の動作確認は以下のように実施可能:

1. **markdown-it の GFM 拡張公開**: `tables: true` / `strikethrough: true` をデフォルトに設定し、`gfm-specifications/04-tables-extension.md` および `06-inlines.md` の Example を参照して動作確認
2. **extended autolink**: `www.example.com` を含む Markdown をコンパイルし、`<a href="http://www.example.com">` が出力されることを確認
3. **tagfilter**: `<script>alert(1)</script>` を含む Markdown をコンパイルし、`&lt;script>` にエスケープされることを確認
