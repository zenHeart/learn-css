/**
 * CSS Houdini Layout API — Centering Layout Worklet
 */
class CenteringLayout {
  async intrinsicSizes() {}
  async layout(children, edges, constraints, styleMap) {
    const availableInlineSize = constraints.fixedInlineSize - edges.inline;
    const availableBlockSize = constraints.fixedBlockSize - edges.block;
    const childFragments = [];
    for (const child of children) {
      const fragment = await child.layoutNextFragment({ availableInlineSize, availableBlockSize });
      fragment.inlineOffset = edges.inlineStart + (availableInlineSize - fragment.inlineSize) / 2;
      fragment.blockOffset = edges.blockStart + (availableBlockSize - fragment.blockSize) / 2;
      childFragments.push(fragment);
    }
    return { autoBlockSize: availableBlockSize, childFragments };
  }
}
registerLayout('centering', CenteringLayout);
