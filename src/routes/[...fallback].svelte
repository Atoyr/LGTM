<script lang="ts">
  let { status, error } = $props();
  let imageUrl = '/404_NotFound.png'; 
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
  }

  img {
    max-width: 65%;
    max-height: 65%;
    height: auto;
  }
  h1 {
    display: none;
  }
  .error {
    display: none;
  }
</style>

<div class="container">
  <h1>{status || 404}</h1>
  <p class="error">{error?.message || 'Page not found'}</p>
  <img src={imageUrl} alt="404 Not Found" />
  <p>Powerd By <a href="https://github.com/SAWARATSUKI/KawaiiLogos">KawaiiLogos</a></p>
  <a href="/">Go to LGTM Generator</a>
</div>
