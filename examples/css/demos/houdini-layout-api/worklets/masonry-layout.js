/**
 * CSS Houdini Layout API — Masonry Layout Worklet
 */
class MasonryLayout {
  async layout(children, edges, constraints, styleMap) {
    const availableInlineSize = constraints.fixedInlineSize - edges.inline;
    const columnWidth = 150;
    const gap = 10;
    const columnCount = Math.max(1, Math.floor((availableInlineSize + gap) / (columnWidth + gap)));
    const actualColumnWidth = (availableInlineSize - gap * (columnCount - 1)) / columnCount;
    const columnHeights = new Array(columnCount).fill(0);
    const childFragments = [];
    for (const child of children) {
      const minHeightCol = columnHeights.indexOf(Math.min(...columnHeights));
      const fragment = await child.layoutNextFragment({ availableInlineSize: actualColumnWidth });
      if (fragment.inlineSize > actualColumnWidth) {
        const scale = actualColumnWidth / fragment.inlineSize;
        fragment.inlineSize = actualColumnWidth;
        fragment.blockSize = fragment.blockSize * scale;
      }
      fragment.inlineOffset = edges.inlineStart + minHeightCol * (actualColumnWidth + gap);
      fragment.blockOffset = edges.blockStart + columnHeights[minHeightCol];
      columnHeights[minHeightCol] += fragment.blockSize + gap;
      childFragments.push(fragment);
    }
    return { autoBlockSize: Math.max(...columnHeights) + edges.block, childFragments };
  }
}
registerLayout('masonry', MasonryLayout);
