<!--
  メインページコンポーネント
  
  このコンポーネントは、アプリケーションのメインページを表示します。
  ユーザー一覧を表形式で表示し、新規ユーザー登録ページへのリンクを提供します。

  主な機能：
  - ページ読み込み時にユーザー一覧を取得
  - ユーザーデータをテーブル形式で表示
  - 新規ユーザー登録ページへのナビゲーション
  - エラー状態の表示
-->

<script lang="ts">
  import { onMount } from 'svelte';

  // TypeScriptの型定義
  // ユーザー情報の配列の型を定義
  let users: Array<{
    id: number;
    name: string;
    group_id: number;
    group_name: string;
  }> = [];

  // エラーメッセージを保持する変数
  let error = '';

  /**
   * コンポーネントのマウント時の処理
   * 
   * Svelteのライフサイクル関数onMountを使用して、
   * コンポーネントが画面に表示される時にユーザー一覧を取得します。
   * 
   * 処理の流れ：
   * 1. APIエンドポイントにGETリクエストを送信
   * 2. レスポンスをJSONとしてパース
   * 3. 取得したデータをusers変数に設定
   * 4. エラーが発生した場合はエラーメッセージを表示
   */
  onMount(async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      users = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred';
    }
  });
</script>

<!-- メインコンテンツ部分 -->
<main class="container">
  <h1>ユーザー一覧</h1>
  
  <!-- アクションボタン領域 - 新規登録ページへのリンクを配置 -->
  <div class="actions">
    <a href="/register" class="button">新規登録</a>
    <a href="/research/add" class="button">リサーチ登録</a>
    <a href="/research/list" class="button">リサーチ一覧</a>
  </div>

  <!-- エラーメッセージ表示領域 - エラーが発生した場合のみ表示 -->
  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  <!-- ユーザー一覧テーブル - ユーザーデータを表形式で表示 -->
  <table>
    <!-- テーブルヘッダー - 各列の見出し -->
    <thead>
      <tr>
        <th>ID</th>
        <th>名前</th>
        <th>所属グループ</th>
      </tr>
    </thead>
    <!-- テーブルボディ - ユーザーデータを1行ずつ表示 -->
    <tbody>
      <!-- Svelteのeachブロックを使用してユーザー配列を繰り返し処理 -->
      {#each users as user}
        <tr>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td>{user.group_name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</main>

<!-- スタイル定義 -->
<style>
  /* メインコンテナのスタイル - レスポンシブ対応の中央寄せレイアウト */
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  /* ページタイトルのスタイル - 適度な余白とテキストカラー */
  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  /* アクションボタン領域のスタイル - ボタンの上下の余白確保 */
  .actions {
    margin-bottom: 20px;
  }

  /* ボタンのスタイル - 青色の背景と角丸、ホバー時の色変更アニメーション */
  .button {
    display: inline-block;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.2s;
    margin-right: 10px;
  }

  .button:hover {
    background-color: #0056b3;
  }

  /* エラーメッセージのスタイル - 赤色の枠と文字色で警告表示 */
  .error {
    color: #dc3545;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #dc3545;
    border-radius: 4px;
  }

  /* テーブルのスタイル - 全幅表示と行間の調整 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  /* テーブルセルの共通スタイル - パディングとボーダーライン */
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  /* テーブルヘッダーのスタイル - 薄い背景色と太字で見出しを強調 */
  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }

  /* テーブル行のホバーエフェクト - マウスオーバー時に背景色変更 */
  tr:hover {
    background-color: #f5f5f5;
  }
</style>
