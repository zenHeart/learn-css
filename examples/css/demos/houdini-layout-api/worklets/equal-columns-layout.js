/**
 * CSS Houdini Layout API — Equal Columns Layout Worklet
 * 演示水平等分布局
 */

class EqualColumnsLayout {
  async layout(children, edges, constraints, styleMap) {
    const availableInlineSize = constraints.fixedInlineSize - edges.inline;
    const gap = 10;
    const childCount = children.length;

    if (childCount === 0) {
      return { autoBlockSize: 0, childFragments: [] };
    }

    const columnWidth = (availableInlineSize - gap * (childCount - 1)) / childCount;
    const childFragments = [];
    let maxBlockSize = 0;

    for (let i = 0; i < children.length; i++) {
      const fragment = await children[i].layoutNextFragment({
        availableInlineSize: columnWidth
      });

      fragment.inlineOffset = edges.inlineStart + i * (columnWidth + gap);
      fragment.blockOffset = edges.blockStart;
      fragment.inlineSize = columnWidth;

      maxBlockSize = Math.max(maxBlockSize, fragment.blockSize);
      childFragments.push(fragment);
    }

    return {
      autoBlockSize: maxBlockSize + edges.block,
      childFragments
    };
  }
}

registerLayout('equal-columns', EqualColumnsLayout);
