// ============================================================
// CSS Houdini Animation Worklet - 时间线驱动动画
// 加载方式: CSS.animationWorklet.addModule('worklets/timeline-animators.js')
// ============================================================

// 滑动画廊动画: 0 -> 1 驱动 translateX (从左外滑入)
// 用法: new WorkletAnimation('slide', element, document.timeline, {})
class SlideAnimator {
  animate(currentTime, effect) {
    if (!effect.target) return;
    const x = (1 - currentTime) * -200;
    effect.target.style.transform = `translateX(${x}px)`;
  }
}

// 渐变动画: 0 -> 1 驱动 opacity (0.2 到 1.0)
// 用法: new WorkletAnimation('fade', element, document.timeline, {})
class FadeAnimator {
  animate(currentTime, effect) {
    if (!effect.target) return;
    const opacity = 0.2 + currentTime * 0.8;
    effect.target.style.opacity = opacity;
  }
}

// 计数器动画: 0 -> 1 驱动数字变化
// 用法: new WorkletAnimation('counter', element, document.timeline, { maxValue: 999, decimals: 0 })
class CounterAnimator {
  constructor(params) {
    this.maxValue = params.maxValue || 999;
    this.decimals = params.decimals || 0;
  }

  animate(currentTime, effect) {
    if (!effect.target) return;
    const value = currentTime * this.maxValue;
    effect.target.textContent = value.toFixed(this.decimals);
  }
}

// 脉冲动画: 使用正弦函数实现循环缩放
// 用法: new WorkletAnimation('pulse', element, document.timeline, {})
class PulseAnimator {
  animate(currentTime, effect) {
    if (!effect.target) return;
    const scale = 1.0 + Math.sin(currentTime * Math.PI * 2) * 0.2;
    effect.target.style.transform = `scale(${scale})`;
  }
}

// 注册所有 animators
registerAnimator('slide', SlideAnimator);
registerAnimator('fade', FadeAnimator);
registerAnimator('counter', CounterAnimator);
registerAnimator('pulse', PulseAnimator);
