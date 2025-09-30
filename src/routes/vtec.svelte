<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import FontSelect from '../components/FontSelect.svelte';
  import { drawImageWithText } from '../lib/canvas';

  let imageUrl: string = $state('');
  let canvas: HTMLCanvasElement;
  
  let textFontFamily: string = $state('sans-serif');
  let subtextFontFamily: string = $state('serif');
  let fontColor = $state('#ffffff');

  let fileName: string;

  let isDragging: boolean = $state(false);

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
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function draw() {
    let text = {
      content: 'VTEC',
      fontFamily: textFontFamily,
      fontColor: fontColor,
    }

    let subText = {
      content: 'DOHC',
      fontFamily: subtextFontFamily,
      fontColor: fontColor,
    }

    drawImageWithText(
      canvas, 
      imageUrl, 
      { text, subText, subTextPosition: 'top' });
  }

  $effect(() => {
    if (canvas && imageUrl) {
      draw();
    }
  });

  function updateCanvas() {
    if (canvas && imageUrl) {
      draw();
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

<main>
  <h1>More Power VTEC</h1>
  <label 
    for="fileInput"
    class="dropzone {isDragging ? 'dragging' : ''}"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    {#if isDragging}
      ドロップして描画
    {:else}
      ここにファイルをドラッグ＆ドロップ
    {/if}
    <input
      id="fileInput"
      type="file"
      accept="image/*"
      class="sr-only"
      onchange={handleImageUpload}
    />
  </label>
  <p class="instructions">または、ページ内で Ctrl+V (Windows) / Cmd+V (Mac) でペースト</p>
  <canvas bind:this={canvas}></canvas>
  {#if imageUrl}
    <h2>Image with LGTM:</h2>
    <button onclick={downloadImage}>Download Image</button>
    <details>
      <summary>Detail settings</summary>
      <div>
        <label for="font-family">VTEC Text Font Family:</label>
        <FontSelect bind:value={textFontFamily} onChange={updateCanvas} />
      </div>
      <div>
        <label for="font-family">DOHC Text Font Family:</label>
        <FontSelect bind:value={subtextFontFamily} onChange={updateCanvas} />
      </div>
      <div>
        <label for="font-color">Font Color:</label>
        <input type="color" id="font-color" bind:value={fontColor} oninput={updateCanvas}>
      </div>
    </details>
  {/if}
</main>

<style>
  .sr-only{
    position:absolute;width:1px;height:1px;padding:0;margin:-1px;
    overflow:hidden;clip:rect(0,0,1px,1px);white-space:nowrap;border:0;
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
</style>

