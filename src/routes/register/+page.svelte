<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let name = '';
  let selectedGroupId = '';
  let error = '';
  let groups: Array<{ id: number; name: string }> = [];
  let isLoading = false;

  onMount(async () => {
    try {
      const response = await fetch('/api/groups');
      if (!response.ok) throw new Error('Failed to fetch groups');
      groups = await response.json();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load groups';
    }
  });

  async function handleSubmit() {
    error = '';
    
    // バリデーション
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

<main class="container">
  <h1>新規ユーザー登録</h1>

  <form on:submit|preventDefault={handleSubmit}>
    {#if error}
      <div class="error">
        {error}
      </div>
    {/if}

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

    <div class="actions">
      <a href="/" class="button secondary">キャンセル</a>
      <button type="submit" class="button" disabled={isLoading}>
        {isLoading ? '登録中...' : '登録'}
      </button>
    </div>
  </form>
</main>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    color: #555;
  }

  input, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #007bff;
  }

  .error {
    color: #dc3545;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #dc3545;
    border-radius: 4px;
  }

  .actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }

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

  .button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .button.secondary {
    background-color: #6c757d;
    color: white;
  }

  .button.secondary:hover {
    background-color: #5a6268;
  }
</style>
