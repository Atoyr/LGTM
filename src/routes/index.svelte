<script lang="ts">
  import { afterUpdate ,onMount, onDestroy } from 'svelte';
  import FontSelect from '../components/FontSelect.svelte';

  let imageUrl: string;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  
  let textFontFamily: string = 'sans-serif';
  let subtextFontFamily: string = 'serif';
  let fontColor = '#ffffff';

  let fileName: string;

  let isDragging: boolean = false;

  // Add event listener for clipboard paste
  function handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          fileName = 'clipboard-image';
          loadImage(blob);
          break;
        }
      }
    }
  }

  // Add this function to initialize the paste event listener
  function initPasteEventListener() {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }

  // Initialize paste event listener when component is mounted
  
  let cleanupPasteListener: () => void;
  
  onMount(() => {
    cleanupPasteListener = initPasteEventListener();
  });
  
  onDestroy(() => {
    if (cleanupPasteListener) {
      cleanupPasteListener();
    }
  });


  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;

    const files = event.dataTransfer?.files;
    const file = files ? files[0] : null;
    if (file) {
      loadImage(file);
    }
  }

  function openFileDialog() {
    document.getElementById('fileInput')?.click();
  }

  function handleImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      loadImage(file);
    }
  }

  function loadImage(file: File){
    if (file) {
      fileName = file.name.replace(/\.[^/.]+$/, "");
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

  function downloadImage() {
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = fileName ? `${fileName}-lgtm.png` : 'lgtm.png';
      link.click();
    }
  }
</script>

<style>
  .canvas-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  canvas {
    display: block;
  }

  details {
    margin-top: 20px;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 120px; /* フッターの高さを考慮 */
  }


  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }

  .dropzone {
    border: 2px dashed #ccc;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    position: relative;
    width: 40vw;
  }
  .dropzone.dragging {
    border-color: #333;
    background-color: #f9f9f9;
  }

  .hidden {
    display: none;
  }
</style>

<main>
  <h1>LGTM Generator</h1>
  <input 
    id="fileInput" 
    type="file" 
    accept="image/*" 
    class="hidden" 
    on:change={handleImageUpload} />
  <div 
    class="dropzone {isDragging ? 'dragging' : ''}"
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
    on:click={openFileDialog}
  >
    {#if isDragging}
      ドロップして描画
    {:else}
      ここにファイルをドラッグ＆ドロップ
    {/if}
  </div>
  <p class="instructions">または、ページ内で Ctrl+V (Windows) / Cmd+V (Mac) でペースト</p>
  {#if imageUrl}
    <h2>Image with LGTM:</h2>
    <canvas bind:this={canvas}></canvas>
    <button on:click={downloadImage}>Download Image</button>
    <details>
      <summary>Detail settings</summary>
      <div>
        <label for="font-family">Main Text Font Family:</label>
        <FontSelect bind:value={textFontFamily} onChange={updateCanvas} />
      </div>
      <div>
        <label for="font-family">Sub Text Font Family:</label>
        <FontSelect bind:value={subtextFontFamily} onChange={updateCanvas} />
      </div>
      <div>
        <label for="font-color">Font Color:</label>
        <input type="color" id="font-color" bind:value={fontColor} on:input={updateCanvas}>
      </div>
    </details>
  {/if}
</main>

