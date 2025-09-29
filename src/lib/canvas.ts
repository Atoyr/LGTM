export type Text = {
  content: string,

  fontFamily: string,
  fontColor: string, 
  textAlign?: CanvasTextAlign,
  textBaseline?: CanvasTextBaseline,
}

export type DrawTextOptions = {
  text: Text, 
  subText: Text, 
  subTextPosition: 'top' | 'bottom'
}

export function drawImageWithText(
  canvas: HTMLCanvasElement,
  src: string, 
  opts: DrawTextOptions
): { width: number; height: number } {
  const img = new Image();
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    let x = 0;
    let y = 0;
    let fontSize = 0;

    // Text
    fontSize = canvas.width / 4;
    x = canvas.width / 2;
    y = canvas.height / 2;

    setFont(ctx, opts.text, fontSize);
    ctx.fillText(opts.text.content, x, y);

    // subText
    x = canvas.width / 2;
    y = canvas.height / 2;
    // y位置を調整
    if (opts.subTextPosition === 'top') {
      y = y - fontSize / 2;
    } else if (opts.subTextPosition === 'bottom') {
      y = y + fontSize / 2;
    }
    fontSize = canvas.width / 32; // Text の1/8

    setFont(ctx, opts.subText, fontSize);
    ctx.fillText(opts.subText.content, x, y);
  }
  img.src = src;
}

function setFont(ctx: CanvasRenderingContext2D, text: Text, fontSize: number): void {
  ctx.font = `${fontSize}px ${text.fontFamily}`;
  ctx.fillStyle = text.fontColor;
  ctx.textAlign = text.textAlign ?? 'center';
  ctx.textBaseline = text.textBaseline ?? 'middle';
}
