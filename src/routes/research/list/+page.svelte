<script lang="ts">
  import { onMount } from 'svelte';
  import Header from '$lib/Header.svelte';

  interface Research {
    id: number;
    name1: string;
    name2: string;
    name3: string;
    name4: string;
    name5: string;
    name6: string;
    name7: string;
    name8: string;
    name9: string;
  }

  let research: Research[] = [];
  let error = '';
  let isLoading = true;
  let latency = '';
  let dataSize = '';

  onMount(async () => {
    try {
      const startTime = performance.now();
      const response = await fetch('/api/research');
      if (!response.ok) {
        throw new Error('リサーチの取得に失敗しました');
      }
      const responseData = await response.json();
      research = responseData;
      const endTime = performance.now();
      latency = ((endTime - startTime) / 1000).toFixed(3);
      
      // データサイズの計算
      const responseSize = new Blob([JSON.stringify(responseData)]).size;
      dataSize = (responseSize / 1024).toFixed(2); // KBに変換
    } catch (e) {
      console.error('Error:', e);
      error = 'データの取得中にエラーが発生しました';
    } finally {
      isLoading = false;
    }
  });
</script>

<Header />
<div class="container">
  <h1>リサーチ一覧</h1>
  {#if latency}
    <p class="latency">
      読み込み時間: {latency} 秒
      {#if dataSize}
        / データ容量: {dataSize} KB
      {/if}
    </p>
  {/if}

  {#if isLoading}
    <p>読み込み中...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else if research.length === 0}
    <p>データがありません</p>
  {:else}
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>name1</th>
            <th>name2</th>
            <th>name3</th>
            <th>name4</th>
            <th>name5</th>
            <th>name6</th>
            <th>name7</th>
            <th>name8</th>
            <th>name9</th>
          </tr>
        </thead>
        <tbody>
          {#each research as item}
            <tr>
              <td>{item.id}</td>
              <td>{item.name1}</td>
              <td>{item.name2}</td>
              <td>{item.name3}</td>
              <td>{item.name4}</td>
              <td>{item.name5}</td>
              <td>{item.name6}</td>
              <td>{item.name7}</td>
              <td>{item.name8}</td>
              <td>{item.name9}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    color: #333;
    margin-bottom: 20px;
  }

  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background: white;
  }

  th, td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }

  th {
    background: #f5f5f5;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background: #f9f9f9;
  }

  tr:hover {
    background: #f5f5f5;
  }

  .error {
    color: #f44336;
    margin-top: 10px;
  }

  .latency {
    color: #666;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
