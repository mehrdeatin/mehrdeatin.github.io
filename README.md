# メイドアイティシュの群像 ― サイト骨格

Jekyll + GitHub Pages(GitHub Actionsビルド)で動く構成です。
日常の更新はターミナルなしで、GitHubのWeb画面上で完結します。

## 1. 最初の1回だけやること

1. このフォルダの中身を、GitHubの新しいリポジトリにアップロードする
   (リポジトリを作成 → 「Add file」→「Upload files」で、このフォルダの中身を
   まるごとドラッグ&ドロップ。`.github`フォルダも隠さず含めてアップロードしてください)
2. リポジトリの `Settings` → `Pages` を開く
3. `Build and deployment` の `Source` を **`GitHub Actions`** に変更する
   (`Deploy from a branch` ではないので注意)
4. `Actions` タブを開いて、ワークフローが動くのを待つ(数分)
5. 緑のチェックが付いたら、`Settings > Pages` に表示されるURLでサイトが見られます

以降、mainブランチに何かpush(=Web画面でファイルを追加・編集してコミット)するたびに、
自動でビルド・公開されます。

## 2. キャラクターを1人追加したい時

1. `_characters/` フォルダに、新しいMarkdownファイルを追加する
   (`rune.md` をコピーして中身を書き換えるのが早いです)
2. 立ち絵画像があれば `assets/images/characters/originals/` にアップロード
   (ファイル名は front matter の `portrait:` と合わせる。拡張子は自動で最適化後の
   ものに揃うので、`.jpg` のまま置いてOKです)
3. コミットすると、自動でリサイズ・WebP変換されて反映されます

## 3. 作品を1本追加したい時

`_works/` フォルダに新しいファイルを追加してください。色・時間軸上の位置・
ポータルのセクション構成は、すべてそのファイルの front matter で指定します。
**CSSやレイアウトのファイルは一切触らなくて大丈夫です。**

```yaml
---
title: "新しい作品名"
title_en: "NEW WORK TITLE"
slug: new-work-slug
accent_color: "#XXXXXX"
timeline_type: axis        # 主軸に乗る場合。乗らない場合は satellite
timeline_position: 100
timeline_label: "◯◯年後"
summary: "一言あらすじ"
key_visual: /assets/images/works/new-work-slug/key.jpg
sections:
  - { number: "01", label: "STORY", jp: "物語", target: "story" }
  # ...必要なだけ追加
---
```

## 4. 用語を1つ追加したい時

`_terms/` フォルダに新しいファイルを追加。`related_characters` / `related_terms` /
`related_works` に他のコンテンツの `slug` を書くと、自動でリンクされます。
**slugのtypoはビルドエラーにならず、静かにリンクが表示されないだけ**なので、
反映されない時はまずtypoを疑ってください。

## 6. SEOについて

`jekyll-seo-tag` と `jekyll-sitemap` を組み込み済みです(どちらもGitHub Pages公式の
安全なプラグイン一覧に入っているものなので、追加の許可なども不要です)。

- ページのタイトル・meta description・OGP・Twitter Card・構造化データは自動生成されます
- `_works` / `_characters` / `_terms` は `summary:` を書いておけば、そのままSEOの説明文にも使われます
- `sitemap.xml` は自動生成されます(`/sitemap/` という人間向けの一覧ページとは別物です)

**1つだけ必ずやること**: `_config.yml` の `url` を、実際に公開されるGitHub PagesのURLに
書き換えてください(空のままだとsitemap・OGPのURLが正しく生成されません)。

```yaml
url: "https://ユーザー名.github.io"
baseurl: ""   # プロジェクトページ(https://ユーザー名.github.io/リポジトリ名/)の場合は "/リポジトリ名"
```

## 7. まだ作られていないもの(次のステップ)

- 各作品ポータルの STORY / WORLD / TIMELINE / TERMS / EXTRA ページ
  (CHARACTERSページだけ `/works/nemophila-reversi/characters/` にサンプルがあります。
  同じやり方で他のセクション・他の作品にも展開できます)
- 個別の章(ストーリー本文)ページ
- 画像の実データ(今はプレースホルダーの背景色のみ)

ここから先は、このサンプルの書き方を真似しながら増やしていくフェーズです。

## 4.5 お話(各話)の本文を書き始めた時

1. `_chapters/` フォルダに、新しいMarkdownファイルを追加する
   (`nemophila-reversi-06.md` をコピーして書き換えるのが早いです)
2. front matter の `work_slug`(作品のslug)と `order`(何話目か)を、
   `_works/` 側の `chapters:` の番号と合わせる
3. `permalink:` は `/works/作品slug/story/話数2桁/` の形にする

これだけで、STORYの一覧のその話のタイトルが**自動でクリックできるリンク**になります。
本文ファイルが無い話は、今まで通りタイトルの表示だけ(クリック不可)です。
タイトルを変えたい時は、`_works/` 側と本文ファイル側の両方を同じにしてください。

