# 小山市公園・トイレマップ

小山市の公園とトイレの場所を地図上で確認できる Web アプリケーションです。

## 機能

### 地図表示

- 小山市内の公園とトイレの位置をマーカーで表示
- 公園とトイレを異なるアイコンで区別
- 選択中の施設は赤色のマーカーで強調表示
- OpenStreetMap を使用した詳細な地図表示

### 施設情報

- 施設名
- 住所
- 施設の詳細情報
- 施設の写真（利用可能な場合）
- 施設情報のクリップボードへのコピー機能

### フィードバック機能

- 各施設に対する利用者からのフィードバックを表示
- フィードバックの投稿日時表示

### 使いやすさ

- URL で特定の施設を直接共有可能
- モバイル対応のレスポンシブデザイン
- 施設数の表示（公園数・トイレ数）

## 技術スタック

- フレームワーク: Next.js
- 地図ライブラリ: Leaflet (React Leaflet)
- UI コンポーネント: Material-UI
- 言語: TypeScript

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/OHMORIYUSUKE/oyama-park-toilet-review.git

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

[http://localhost:3000](http://localhost:3000)にアクセスして開発版を確認できます。

## ライセンス

/data ディレクトリ以外は MIT ライセンスの下で公開されています。
だたし、/data 以下のデータは [小山市のオープンデータ](https://www.city.oyama.tochigi.jp/opendata.php) から取得しており、そのデータの利用については [小山市のオープンデータ利用規約](https://www.city.oyama.tochigi.jp/opendata.php?mode=kiyaku) ([CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja))に従っています。

## コントリビューション

バグ報告や機能改善の提案は、GitHub の Issue や Pull Requests で受け付けています。
