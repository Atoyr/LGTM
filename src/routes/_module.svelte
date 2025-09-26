<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

{@render children?.()}
<footer>
  <a href="https://github.com/atoyr/LGTM" target="_blank">
  <img src="/github-mark.svg" alt="GitHub" />
  </a>
  <span>&copy; 2024 UCHIYAMA Ryota</span>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 20px;
    background-color: #f1f1f1;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 80px;
  }

  footer a {
    text-decoration: none;
    color: #007acc;
    margin-bottom: 5px; /* 適度な間隔を追加 */
  }

  footer img {
    height: 32px;
    width: 32px;
    fill: #007acc;
    margin-right: 8px;
  }
</style>
