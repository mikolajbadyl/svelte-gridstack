<script lang="ts" generics="T extends Record<string, unknown>">
	import { setContext } from 'svelte';
	import { GridStack } from 'gridstack';
	import type { GridStack as GridStackInstance, GridStackOptions, GridStackWidget } from 'gridstack';
	import { onMount, tick } from 'svelte';
	import { GRIDSTACK_KEY, type GridStackGetter } from '../context.js';
	import type { GridStackChangeHandler, GridStackDragResizeHandler, GridStackDragResizeMoveHandler, GridStackDropHandler } from '../types.js';

	type EventCallback = ((...args: unknown[]) => void) | undefined;

	let {
		widgets = [],
		options = {},
		onchange,
		onadded,
		onremoved,
		ondragstart,
		ondrag,
		ondragstop,
		onresizestart,
		onresize,
		onresizestop,
		ondropped,
		children
	}: {
		widgets: T[];
		options?: GridStackOptions;
		onchange?: GridStackChangeHandler;
		onadded?: GridStackChangeHandler;
		onremoved?: GridStackChangeHandler;
		ondragstart?: GridStackDragResizeHandler;
		ondrag?: GridStackDragResizeMoveHandler;
		ondragstop?: GridStackDragResizeHandler;
		onresizestart?: GridStackDragResizeHandler;
		onresize?: GridStackDragResizeMoveHandler;
		onresizestop?: GridStackDragResizeHandler;
		ondropped?: GridStackDropHandler;
		children: import('svelte').Snippet<[T, number]>;
	} = $props();

	let gridEl: HTMLElement;
	let grid: GridStackInstance | undefined = $state();
	const getGrid: GridStackGetter = () => grid;
	setContext(GRIDSTACK_KEY, getGrid);

	onMount(async () => {
		await tick();
		const g = GridStack.init({ ...options, auto: false }, gridEl);
		grid = g;

		const bindings: [string, EventCallback][] = [
			['change', onchange as EventCallback],
			['added', onadded as EventCallback],
			['removed', onremoved as EventCallback],
			['dragstart', ondragstart as EventCallback],
			['drag', ondrag as EventCallback],
			['dragstop', ondragstop as EventCallback],
			['resizestart', onresizestart as EventCallback],
			['resize', onresize as EventCallback],
			['resizestop', onresizestop as EventCallback],
			['dropped', ondropped as EventCallback],
		];

		for (const [eventName, handler] of bindings) {
			if (handler) {
				g.on(eventName, (event: Event, ...args: unknown[]) => {
					handler(event, ...args);
				});
			}
		}
	});

	$effect(() => {
		if (grid && options) {
			grid.updateOptions(options);
		}
	});

	export function getGridInstance() { return grid; }
	export function save() {
		const saved = grid?.save();
		if (!saved) return saved;
		// gridstack's removeInternalForSave deletes w when w===1 or w===minW.
		// Merge back widget data so consumers get complete layout info.
		return saved.map((item, i) => {
			const src = widgets[i];
			if (!src) return item;
			return { ...src, ...item, id: item.id ?? (src as Record<string, unknown>).id };
		});
	}
	export function load(items: GridStackWidget[]) { return grid?.load(items); }
	export function compact() { grid?.compact(); }
	export function float(val: boolean) { grid?.float(val); }
	export function column(n: number) { grid?.column(n); }
	export function cellHeight(val?: number | string) { grid?.cellHeight(val); }
	export function destroy(removeDOM = true) { grid?.destroy(removeDOM); grid = undefined; }
	export function enable() { grid?.enable(); }
	export function disable() { grid?.disable(); }
	export function setStatic(val: boolean) { grid?.setStatic(val); }
	export function batchUpdate(flag = true) { grid?.batchUpdate(flag); }
	export function removeAll(removeDOM = true) { grid?.removeAll(removeDOM); }
</script>

<div class="grid-stack" bind:this={gridEl}>
	{#each widgets as widget, i (widget.id as string | number)}
		{@render children(widget, i)}
	{/each}
</div>

