/**
 * CSS Houdini Paint API — Blob Animation Worklet
 * 演示如何通过 @property 自定义属性驱动 worklet 重绘
 */

// 定义可动画的 blob 半径
class BlobPaint {
  static get inputProperties() {
    return ['--blob-radius', '--blob-color'];
  }

  paint(ctx, geom, properties) {
    const radius = parseFloat(properties.get('--blob-radius')) || 50;
    const color = properties.get('--blob-color')?.toString() || '#6366f1';
    const cx = geom.width / 2;
    const cy = geom.height / 2;

    ctx.fillStyle = color;
    ctx.beginPath();

    // 用多个圆弧组合成 blob 形状
    const points = 8;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      // 通过正弦函数让半径随角度变化，产生不规则 blob 形状
      const r = radius + Math.sin(angle * 3) * (radius * 0.3);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

registerPaint('blob', BlobPaint);
