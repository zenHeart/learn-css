/**
 * CSS Houdini Animation Worklet — Frame-Sync Animator
 * 演示基于时间的帧同步动画
 */
class FrameAnimator {
  animate(currentTime, effect) {
    const duration = 3000; // 3秒循环
    const cycleTime = currentTime % duration;
    const progress = cycleTime / duration;

    // 阶段 1 (0-25%): 从左侧滑入
    // 阶段 2 (25-50%): 停留
    // 阶段 3 (50-75%): 向右移动一点
    // 阶段 4 (75-100%): 淡出并重置

    let x, opacity;

    if (progress < 0.25) {
      // 滑入
      const t = progress / 0.25;
      const eased = 1 - Math.pow(1 - t, 3);
      x = (eased - 1) * 100; // -100% -> 0
      opacity = eased;
    } else if (progress < 0.5) {
      // 停留
      x = 0;
      opacity = 1;
    } else if (progress < 0.75) {
      // 向右移动
      const t = (progress - 0.5) / 0.25;
      const eased = 1 - Math.pow(1 - t, 3);
      x = eased * 30;
      opacity = 1;
    } else {
      // 淡出
      const t = (progress - 0.75) / 0.25;
      const eased = 1 - Math.pow(1 - t, 2);
      x = 30 + eased * 20;
      opacity = 1 - eased;
    }

    effect.target.style.transform = `translateX(${x}px)`;
    effect.target.style.opacity = opacity;
  }
}
registerAnimator('frame', FrameAnimator);
