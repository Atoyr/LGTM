<script lang="ts">
  import { afterUpdate } from 'svelte';  import { onMount } from 'svelte';

  let imageUrl: string;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;

  function handleImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {

        if (typeof e.target?.result === 'string') {
          imageUrl = e.target?.result;
          drawImageWithText(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function drawImageWithText(src: string): void {
    const img = new Image();
    img.onload = () => {
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // LGTMテキストの設定
        const text = 'LGTM';
        const subtext = 'Looks Good To Me';
        const fontSize = img.width / 4;
        const subFontSize = fontSize / 8;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // テキストの位置を画像の中央に設定
        const x = img.width / 2;
        const y = img.height / 2;
        ctx.fillText(text, x, y);

        // Locks good to meのテキストを文字の下に追加
        ctx.font = `${subFontSize}px serif`;
        ctx.fillText(subtext, x, y + fontSize / 2);
      }
    };
    img.src = src;
  }

  afterUpdate((): void => {
    if (canvas && !ctx) {
      ctx = canvas.getContext('2d');
    }
  });
</script>

<style>
  .image-preview {
    max-width: 100%;
    max-height: 400px;
  }

  canvas {
    display: block;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
  }
</style>

<main>
  <h1>Image Upload Example with LGTM</h1>
  <input type="file" accept="image/*" on:change={handleImageUpload} />
  {#if imageUrl}
    <h2>Image with LGTM:</h2>
    <canvas bind:this={canvas}></canvas>
  {/if}
</main>
