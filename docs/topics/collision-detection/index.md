# 碰撞检测 (Collision Detection)

## 概述

碰撞检测是计算两个或多个对象是否在空间上重叠的技术，广泛应用于游戏开发、图形界面交互、物理模拟等领域。

## 碰撞检测算法分类

### 1. AABB (Axis-Aligned Bounding Box) 矩形碰撞

最基础的碰撞检测算法，适用于轴对齐的矩形对象。

```javascript
function rectIntersect(r1, r2) {
  return !(
    r1.x + r1.width <= r2.x ||
    r2.x + r2.width <= r1.x ||
    r1.y + r1.height <= r2.y ||
    r2.y + r2.height <= r1.y
  );
}
```

**适用场景**：贪吃蛇、俄罗斯方块、UI 拖拽检测

### 2. 圆形碰撞检测

基于圆心距离判断碰撞。

```javascript
function circleIntersect(c1, c2) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}
```

**适用场景**：球类游戏、弹珠、雷达检测

### 3. 点与矩形碰撞

```javascript
function pointInRect(px, py, rect) {
  return (
    px >= rect.x &&
    px <= rect.x + rect.width &&
    py >= rect.y &&
    py <= rect.y + rect.height
  );
}
```

### 4. 鼠标点击检测

```javascript
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // 检测点击了哪个对象
  for (const obj of objects) {
    if (pointInRect(x, y, obj)) {
      console.log('点击了对象:', obj.id);
    }
  }
});
```

### 5. Separating Axis Theorem (SAT) 分离轴定理

适用于凸多边形碰撞检测。

**核心原理**：如果两个凸多边形不重叠，必然存在一条能将它们分开的轴。

```javascript
function getAxes(polygon) {
  const axes = [];
  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    // 计算边的垂直向量作为候选轴
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    const normal = { x: -edge.y, y: edge.x };
    axes.push(normal);
  }
  return axes;
}

function project(polygon, axis) {
  let min = Infinity, max = -Infinity;
  for (const p of polygon) {
    const proj = p.x * axis.x + p.y * axis.y;
    min = Math.min(min, proj);
    max = Math.max(max, proj);
  }
  return { min, max };
}

function polygonsIntersect(poly1, poly2) {
  const axes = [...getAxes(poly1), ...getAxes(poly2)];
  
  for (const axis of axes) {
    const proj1 = project(poly1, axis);
    const proj2 = project(poly2, axis);
    
    // 检查投影是否重叠
    if (proj1.max < proj2.min || proj2.max < proj1.min) {
      return false; // 分离，检测到碰撞
    }
  }
  return true; // 所有轴都重叠，碰撞
}
```

### 6. 空间分区 (Spatial Partitioning)

当对象数量增多时，使用空间数据结构提升效率。

#### 网格分区 (Grid)

```javascript
class Grid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }
  
  getKey(x, y) {
    return `${Math.floor(x / this.cellSize)},${Math.floor(y / this.cellSize)}`;
  }
  
  insert(obj) {
    const key = this.getKey(obj.x, obj.y);
    if (!this.cells.has(key)) this.cells.set(key, []);
    this.cells.get(key).push(obj);
  }
  
  query(x, y, radius) {
    const results = [];
    const checked = new Set();
    const cellRadius = Math.ceil(radius / this.cellSize);
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    
    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = `${cx + dx},${cy + dy}`;
        const cell = this.cells.get(key);
        if (cell) {
          for (const obj of cell) {
            if (!checked.has(obj.id)) {
              checked.add(obj.id);
              const dist = Math.hypot(obj.x - x, obj.y - y);
              if (dist <= radius + (obj.radius || 0)) {
                results.push(obj);
              }
            }
          }
        }
      }
    }
    return results;
  }
}
```

### 7. 射线投射 (Ray Casting)

用于检测从一点发出的射线与对象的交点。

```javascript
function rayRectIntersect(ray, rect) {
  const t1 = (rect.x - ray.x) / ray.dx;
  const t2 = (rect.x + rect.width - ray.x) / ray.dx;
  const t3 = (rect.y - ray.y) / ray.dy;
  const t4 = (rect.y + rect.height - ray.y) / ray.dy;
  
  const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
  const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
  
  if (tmax < 0 || tmin > tmax) return null; // 无交点
  
  return {
    x: ray.x + ray.dx * tmin,
    y: ray.y + ray.dy * tmin,
    t: tmin
  };
}
```

## 常见应用场景

| 场景 | 推荐算法 | 说明 |
|------|----------|------|
| 贪吃蛇/俄罗斯方块 | AABB | 矩形网格对齐，简单高效 |
| 弹珠/球类游戏 | 圆形碰撞 | 基于距离判断 |
| 复杂多边形游戏 | SAT | 通用凸多边形 |
| UI 拖拽 | 点与矩形 | 检测鼠标是否在元素上 |
| 射击游戏 | 射线投射 | 检测弹道是否命中 |
| 大量对象游戏 | 空间分区 | 四叉树/网格优化 |

## 性能优化技巧

1. **Broad Phase (粗检测)**：先用 AABB 或空间分区快速排除不可能碰撞的对象对
2. **Narrow Phase (精检测)**：对通过粗检测的对象使用精确算法
3. **脏矩形渲染**：只重绘发生变化的区域
4. **对象池**：复用对象，避免频繁创建销毁
5. **分层检测**：按类型分层，同层对象互检，跨层不检

## CSS 层叠与碰撞

CSS 中的 `z-index` 和层叠上下文也会影响"碰撞"表现：

- **视觉遮挡**：`z-index` 大的元素会遮挡小的，但不等于碰撞
- **pointer-events**：可以控制哪些层叠元素响应鼠标事件
- **transform: relative**：创建新的层叠上下文，影响 DOM 顺序

```css
/* 避免 transform 创建的层叠上下文干扰点击检测 */
.layer {
  transform: translateZ(0); /* 创建新层叠上下文 */
  pointer-events: auto;
}

/* 让底层元素也可点击 */
.overlay {
  pointer-events: none;
}
.overlay button {
  pointer-events: auto;
}
```

## 参考资料

- [MDN: 2D collision detection](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
- [Game Development: Collision Detection](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Collision_detection)
- [SAT (Separating Axis Theorem)](https://www.seb.ly/posts/2010/09/sat-separating-axis-theorem-for-2d-collision-detection/)
