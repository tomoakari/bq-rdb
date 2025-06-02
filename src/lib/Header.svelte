<script lang="ts">
  const links = [
    { href: '/', label: 'ホーム' },
    { href: '/register', label: 'ユーザー登録' },
    { href: '/research/add', label: 'リサーチ登録' },
    { href: '/research/list', label: 'リサーチ一覧' }
  ];
</script>

<header>
  <nav>
    {#each links as link}
      <a href={link.href} class="nav-link">{link.label}</a>
    {/each}
  </nav>
</header>

<style>
  header {
    background: #333;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  nav {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    gap: 1rem;
  }

  .nav-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .nav-link:hover {
    background: #444;
  }
</style>
