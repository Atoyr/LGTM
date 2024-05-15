<script lang="ts">
  import { afterUpdate } from 'svelte';

  let imageUrl: string;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  
  let textFontFamily: string = 'sans-serif';
  let subtextFontFamily: string = 'serif';
  let fontColor = '#ffffff';

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
        ctx.font = `${fontSize}px ${textFontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // テキストの位置を画像の中央に設定
        const x = img.width / 2;
        const y = img.height / 2;
        ctx.fillText(text, x, y);

        // Locks good to meのテキストを文字の下に追加
        ctx.font = `${subFontSize}px ${subtextFontFamily}`;
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

  function updateCanvas() {
    if (imageUrl && typeof imageUrl === 'string') {
      drawImageWithText(imageUrl);
    }
  }
</script>

<style>
  canvas {
    display: block;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }
</style>

<main>
  <h1>LGTM Generator</h1>
  <input type="file" accept="image/*" on:change={handleImageUpload} />
  {#if imageUrl}
    <h2>Image with LGTM:</h2>
    <canvas bind:this={canvas}></canvas>
    <details>
      <summary>Detail settings</summary>
      <div>
        <label for="font-family">Main Text Font Family:</label>
        <select id="font-family" bind:value={textFontFamily} on:change={updateCanvas}>
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-serif</option>         
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Brush Script MT">Brush Script MT</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
        </select>
      </div>
      <div>
        <label for="font-family">Sub Text Font Family:</label>
        <select id="font-family" bind:value={subtextFontFamily} on:change={updateCanvas}>
          <option value="serif">Serif</option>
          <option value="sans-serif">Sans-serif</option>
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Brush Script MT">Brush Script MT</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
        </select>
      </div>
      <div>
        <label for="font-color">Font Color:</label>
        <input type="color" id="font-color" bind:value={fontColor} on:input={updateCanvas}>
      </div>
    </details>
  {/if}
</main>
