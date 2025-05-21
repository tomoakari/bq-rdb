# User Management Application with BigQuery

このアプリケーションは、BigQueryを使用してユーザー情報を管理するシンプルなWebアプリケーションです。

## 機能

- ユーザー一覧の表示
- 新規ユーザーの登録
- グループ管理

## セットアップ手順

### 1. 必要条件

- Node.js (v16以上)
- Google Cloud Projectのアクセス権
- BigQueryのデータセット

### 2. インストール

```bash
npm install
```

### 3. BigQueryの設定

1. Google Cloud Consoleで新しいサービスアカウントを作成
2. BigQueryへのアクセス権を付与（BigQuery Admin権限推奨）
3. サービスアカウントキー（JSON）をダウンロード
4. プロジェクトのルートに`.env`ファイルを作成し、以下の環境変数を設定:

```env
GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"
GOOGLE_CLOUD_PROJECT="your-project-id"
BIGQUERY_DATASET="your-dataset-name"
```

### 4. テーブルの作成

1. BigQueryコンソールを開く
2. `sql/create_tables.sql`の内容を実行してテーブルを作成

### 5. アプリケーションの起動

開発モード:
```bash
npm run dev
```

本番ビルド:
```bash
npm run build
npm run preview
```

## 使用技術

- SvelteKit
- TypeScript
- Google BigQuery
- Node.js
