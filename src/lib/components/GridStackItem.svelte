<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getContext } from 'svelte';
	import { GRIDSTACK_KEY, type GridStackGetter } from '../context.js';
	import type { GridStackItemProps } from '../types.js';
	import { itemPropsToWidget } from '../types.js';
	import type { GridStack as GridStackInstance } from 'gridstack';

	let {
		id,
		x,
		y,
		w,
		h,
		autoPosition,
		minW,
		maxW,
		minH,
		maxH,
		noResize,
		noMove,
		locked,
		sizeToContent,
		children
	}: GridStackItemProps & { children?: import('svelte').Snippet } = $props();

	const getGrid = getContext<GridStackGetter>(GRIDSTACK_KEY);

	let itemEl: HTMLElement;
	let registered = false;

	function buildAttrs(): Record<string, string | undefined> {
		const attrs: Record<string, string | undefined> = {};
		if (id !== undefined) attrs['gs-id'] = String(id);
		if (x !== undefined) attrs['gs-x'] = String(x);
		if (y !== undefined) attrs['gs-y'] = String(y);
		if (w !== undefined) attrs['gs-w'] = String(w);
		if (h !== undefined) attrs['gs-h'] = String(h);
		if (autoPosition) attrs['gs-auto-position'] = 'true';
		if (minW !== undefined) attrs['gs-min-w'] = String(minW);
		if (maxW !== undefined) attrs['gs-max-w'] = String(maxW);
		if (minH !== undefined) attrs['gs-min-h'] = String(minH);
		if (maxH !== undefined) attrs['gs-max-h'] = String(maxH);
		if (noResize) attrs['gs-no-resize'] = 'true';
		if (noMove) attrs['gs-no-move'] = 'true';
		if (locked) attrs['gs-locked'] = 'true';
		if (sizeToContent !== undefined) attrs['gs-size-to-content'] = String(sizeToContent);
		return attrs;
	}

	function applyAttrs() {
		if (!itemEl) return;
		const attrs = buildAttrs();
		for (const [key, val] of Object.entries(attrs)) {
			if (val !== undefined) {
				itemEl.setAttribute(key, val);
			} else {
				itemEl.removeAttribute(key);
			}
		}
	}

	function registerItem(grid: GridStackInstance) {
		if (registered || !itemEl) return;
		applyAttrs();
		const widgetOpts = itemPropsToWidget({ id, x, y, w, h, autoPosition, minW, maxW, minH, maxH, noResize, noMove, locked, sizeToContent });
		grid.makeWidget(itemEl, widgetOpts);
		registered = true;
	}

	$effect(() => {
		const grid = getGrid();
		if (grid && itemEl && !registered) {
			registerItem(grid);
		}
	});

	$effect(() => {
		if (!registered) return;
		void id; void x; void y; void w; void h;
		void autoPosition; void minW; void maxW; void minH; void maxH;
		void noResize; void noMove; void locked; void sizeToContent;

		const grid = getGrid();
		if (grid && itemEl) {
			applyAttrs();
			const widgetOpts = itemPropsToWidget({ id, x, y, w, h, autoPosition, minW, maxW, minH, maxH, noResize, noMove, locked, sizeToContent });
			grid.update(itemEl, widgetOpts);
		}
	});

	onDestroy(() => {
		const grid = getGrid();
		if (grid && itemEl) {
			try {
				grid.removeWidget(itemEl, false, false);
			} catch {
			}
		}
	});
</script>

<div class="grid-stack-item" bind:this={itemEl}>
	<div class="grid-stack-item-content">
		{@render children?.()}
	</div>
</div>
