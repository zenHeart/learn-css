// ============================================================
// CSS Houdini Animation Worklet - 滚动驱动动画
// 加载方式: CSS.animationWorklet.addModule('worklets/scroll-animators.js')
// ============================================================

// 缩放动画: 0 -> 1 进度驱动 scale
// 用法: new WorkletAnimation('scale', element, scrollTimeline, {})
class ScaleAnimator {
  animate(currentTime, effect) {
    if (!effect.target) return;
    const scale = 0.3 + currentTime * 1.2;
    effect.target.style.transform = `scale(${scale})`;
    effect.target.style.opacity = 0.3 + currentTime * 0.7;
  }
}

// 旋转动画: 0 -> 1 进度驱动 rotate
// 用法: new WorkletAnimation('rotate', element, scrollTimeline, {})
class RotateAnimator {
  animate(currentTime, effect) {
    if (!effect.target) return;
    const rotate = currentTime * 360;
    effect.target.style.transform = `rotate(${rotate}deg)`;
  }
}

// 位移动画: 0 -> 1 进度驱动 translateX (-100px 到 +100px)
// 用法: new WorkletAnimation('translate', element, scrollTimeline, {})
class TranslateAnimator {
  animate(currentTime, effect) {
    if (!effect.target) return;
    const x = (currentTime - 0.5) * 200;
    effect.target.style.transform = `translateX(${x}px)`;
  }
}

// 视差图层动画器
// 用法: new WorkletAnimation('parallax-layer', element, scrollTimeline, { speed: 0.3 })
class ParallaxLayerAnimator {
  constructor(params) {
    this.speed = params.speed ?? 1.0;
    this.windowHeight = params.windowHeight ?? window.innerHeight;
  }

  animate(currentTime, effect) {
    if (!effect.target) return;
    const translateY = currentTime * this.windowHeight * (this.speed - 1);
    effect.target.style.transform = `translateY(${translateY}px)`;
  }
}

// 注册所有 animators
registerAnimator('scale', ScaleAnimator);
registerAnimator('rotate', RotateAnimator);
registerAnimator('translate', TranslateAnimator);
registerAnimator('parallax-layer', ParallaxLayerAnimator);
