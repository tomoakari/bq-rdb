<!--
  ユーザー登録ページコンポーネント
  
  このコンポーネントは、新規ユーザーを登録するためのフォームを提供します。
  ユーザー名とグループを入力/選択し、APIを通じて登録を行います。

  主な機能：
  - グループ一覧の取得と表示
  - ユーザー情報の入力フォーム
  - 入力値のバリデーション
  - ユーザー登録処理
  - エラー処理と表示
  - 登録完了後のリダイレクト
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // フォームの入力値を管理する変数
  let name = '';  // ユーザー名
  let selectedGroupId = '';  // 選択されたグループID
  let error = '';  // エラーメッセージ
  let groups: Array<{ id: number; name: string }> = [];  // グループ一覧
  let isLoading = false;  // 登録処理中かどうかのフラグ

  /**
   * コンポーネントのマウント時の処理
   * 
   * ページ読み込み時にグループ一覧を取得します。
   * 取得したグループ情報はドロップダウンリストに表示されます。
   */
  onMount(async () => {
    try {
      const response = await fetch('/api/groups');
      if (!response.ok) throw new Error('Failed to fetch groups');
      groups = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load groups';
    }
  });

  /**
   * フォーム送信時の処理
   * 
   * 以下の手順でユーザー登録を行います：
   * 1. 入力値のバリデーション
   * 2. APIを使用してユーザーを登録
   * 3. 成功時はユーザー一覧ページにリダイレクト
   * 4. エラー時はエラーメッセージを表示
   */
  async function handleSubmit() {
    error = '';
    
    // 入力値のバリデーションチェック
    if (!name.trim()) {
      error = 'ユーザー名を入力してください';
      return;
    }
    if (!selectedGroupId) {
      error = 'グループを選択してください';
      return;
    }

    isLoading = true;
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          groupId: parseInt(selectedGroupId),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create user');
      }

      // 成功したら一覧ページに戻る
      await goto('/');
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred';
      isLoading = false;
    }
  }
</script>

<!-- メインコンテンツ部分 -->
<main class="container">
  <h1>新規ユーザー登録</h1>

  <!-- 
    登録フォーム
    preventDefault修飾子でフォームのデフォルトの送信動作を防止し、
    カスタムのhandleSubmit関数で処理を行います
  -->
  <form on:submit|preventDefault={handleSubmit}>
    <!-- エラーメッセージ表示領域 - エラーがある場合のみ表示 -->
    {#if error}
      <div class="error">
        {error}
      </div>
    {/if}

    <!-- ユーザー名入力フィールド -->
    <div class="form-group">
      <label for="name">ユーザー名</label>
      <input
        type="text"
        id="name"
        bind:value={name}
        placeholder="ユーザー名を入力"
        disabled={isLoading}
      />
    </div>

    <!-- グループ選択ドロップダウン -->
    <div class="form-group">
      <label for="group">所属グループ</label>
      <select
        id="group"
        bind:value={selectedGroupId}
        disabled={isLoading}
      >
        <option value="">選択してください</option>
        {#each groups as group}
          <option value={group.id}>{group.name}</option>
        {/each}
      </select>
    </div>

    <!-- アクションボタン領域 - キャンセルと登録ボタン -->
    <div class="actions">
      <a href="/" class="button secondary">キャンセル</a>
      <button type="submit" class="button" disabled={isLoading}>
        {isLoading ? '登録中...' : '登録'}
      </button>
    </div>
  </form>
</main>

<!-- スタイル定義 -->
<style>
  /* メインコンテナのスタイル - レスポンシブ対応のフォームレイアウト */
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  /* フォームグループのスタイル - 入力フィールドの間隔を調整 */
  .form-group {
    margin-bottom: 20px;
  }

  /* ラベルのスタイル - フォーム要素との関連付けを視覚的に明確に */
  label {
    display: block;
    margin-bottom: 5px;
    color: #555;
  }

  /* 入力フィールドとセレクトボックスの共通スタイル */
  input, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  /* フォーカス時のスタイル - 青色のボーダーで強調表示 */
  input:focus, select:focus {
    outline: none;
    border-color: #007bff;
  }

  /* エラーメッセージのスタイル - 赤色で警告表示 */
  .error {
    color: #dc3545;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #dc3545;
    border-radius: 4px;
  }

  /* ボタン配置領域のスタイル - 右寄せレイアウト */
  .actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }

  /* ボタンの基本スタイル - サイズと形状の定義 */
  .button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    text-decoration: none;
    display: inline-block;
  }

  .button {
    background-color: #007bff;
    color: white;
  }

  .button:hover {
    background-color: #0056b3;
  }

  /* 無効化状態のボタンスタイル - グレーアウトして操作不可を表現 */
  .button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  /* キャンセルボタンのスタイル - グレー系の配色 */
  .button.secondary {
    background-color: #6c757d;
    color: white;
  }

  .button.secondary:hover {
    background-color: #5a6268;
  }
</style>
