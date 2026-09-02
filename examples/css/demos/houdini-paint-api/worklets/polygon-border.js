/**
 * CSS Houdini Paint API — Polygon Border Worklet
 * 演示用 paint API 绘制可配置边数的多边形边框
 */

class PolygonBorderPaint {
  static get inputProperties() {
    return ['--polygon-sides', '--polygon-color', '--polygon-stroke-width'];
  }

  paint(ctx, geom, properties) {
    const sides = parseInt(properties.get('--polygon-sides')) || 6;
    const color = properties.get('--polygon-color')?.toString() || '#3b82f6';
    const strokeWidth = parseFloat(properties.get('--polygon-stroke-width')) || 3;
    const cx = geom.width / 2;
    const cy = geom.height / 2;
    const r = Math.min(cx, cy) * 0.8;

    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
}

registerPaint('polygon-border', PolygonBorderPaint);
