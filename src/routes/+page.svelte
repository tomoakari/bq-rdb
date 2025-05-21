<script lang="ts">
  import { onMount } from 'svelte';

  let users: Array<{
    id: number;
    name: string;
    group_id: number;
    group_name: string;
  }> = [];

  let error = '';

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

<main class="container">
  <h1>ユーザー一覧</h1>
  
  <div class="actions">
    <a href="/register" class="button">新規登録</a>
  </div>

  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>名前</th>
        <th>所属グループ</th>
      </tr>
    </thead>
    <tbody>
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

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  .actions {
    margin-bottom: 20px;
  }

  .button {
    display: inline-block;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .button:hover {
    background-color: #0056b3;
  }

  .error {
    color: #dc3545;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #dc3545;
    border-radius: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
</style>
