<script lang="ts">
  let value = '';
  let message = '';
  let isLoading = false;
  let latency = '';

  async function handleSubmit() {
    if (!value) {
      message = '値を入力してください';
      return;
    }

    isLoading = true;
    message = '';

    try {
      const startTime = performance.now();
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) {
        throw new Error('リサーチの登録に失敗しました');
      }

      const endTime = performance.now();
      latency = ((endTime - startTime) / 1000).toFixed(3);
      value = '';
      message = 'リサーチを登録しました';
    } catch (error) {
      console.error('Error:', error);
      message = 'エラーが発生しました';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="container">
  <h1>リサーチ登録</h1>
  {#if latency}
    <p class="latency">処理時間: {latency} 秒</p>
  {/if}

  <form on:submit|preventDefault={handleSubmit} class="form">
    <div class="form-group">
      <label for="value">値を入力してください（name1~name9に同じ値が設定されます）</label>
      <input
        type="text"
        id="value"
        bind:value
        disabled={isLoading}
        placeholder="値を入力"
        class="input"
      />
    </div>

    <button type="submit" disabled={isLoading} class="button">
      {#if isLoading}
        登録中...
      {:else}
        登録
      {/if}
    </button>

    {#if message}
      <p class={message.includes('エラー') ? 'error' : 'success'}>
        {message}
      </p>
    {/if}
  </form>
</div>

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

  .form {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: #666;
  }

  .input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  .button {
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  .button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }

  .error {
    color: #f44336;
    margin-top: 10px;
  }

  .success {
    color: #4CAF50;
    margin-top: 10px;
  }

  .latency {
    color: #666;
    font-size: 14px;
    margin-bottom: 20px;
  }
</style>
