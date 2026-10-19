/**
 * CSS Houdini Paint API — Checkerboard Blend Worklet
 * 演示用 paint API 创建棋盘格混合效果（适合做图片遮罩）
 */

class CheckerboardPaint {
  static get inputProperties() {
    return ['--checkerboard-size', '--checkerboard-color', '--checkerboard-opacity'];
  }

  paint(ctx, geom, properties) {
    const size = parseInt(properties.get('--checkerboard-size')) || 16;
    const color = properties.get('--checkerboard-color')?.toString() || 'rgba(0,0,0,0.3)';
    const opacity = parseFloat(properties.get('--checkerboard-opacity')) || 0.3;

    ctx.clearRect(0, 0, geom.width, geom.height);

    // 解析颜色并应用透明度
    ctx.fillStyle = color;

    for (let x = 0; x < geom.width; x += size) {
      for (let y = 0; y < geom.height; y += size) {
        if ((x / size + y / size) % 2 === 0) {
          ctx.fillRect(x, y, size, size);
        }
      }
    }
  }
}

registerPaint('checkerboard', CheckerboardPaint);
