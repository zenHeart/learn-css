/**
 * CSS Houdini Animation Worklet — Scroll-Linked Animator
 */
class ScrollAnimator {
  animate(currentTime, effect) {
    // 获取滚动位置
    const scrollY = this.scrollOffset || 0;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    // 视差层 1: 移动速度 0.3
    const layer1 = this.layers && this.layers[0];
    if (layer1) {
      const y = progress * 300 * 0.3;
      layer1.style.transform = `translateY(${y}px)`;
    }

    // 视差层 2: 移动速度 0.5
    const layer2 = this.layers && this.layers[1];
    if (layer2) {
      const y = progress * 300 * 0.5;
      layer2.style.transform = `translateY(${y}px)`;
    }

    // 视差层 3: 移动速度 0.8
    const layer3 = this.layers && this.layers[2];
    if (layer3) {
      const y = progress * 300 * 0.8;
      layer3.style.transform = `translateY(${y}px)`;
    }

    // 进度指示器
    if (this.progressBar) {
      this.progressBar.style.width = `${progress * 100}%`;
    }
  }
}
registerAnimator('scroll', ScrollAnimator);
