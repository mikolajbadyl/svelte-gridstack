<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { setContext } from 'svelte';
	import { GridStack } from 'gridstack';
	import type { GridStack as GridStackInstance, GridStackNode } from 'gridstack';
	import { GRIDSTACK_KEY, type GridStackGetter } from '../context.js';
	import type { GridStackEvents, GridStackProps } from '../types.js';

	let {
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
	}: GridStackProps & { children?: import('svelte').Snippet } = $props();

	let gridEl: HTMLElement;
	let grid: GridStackInstance | undefined = $state();

	const getGrid: GridStackGetter = () => grid;
	setContext(GRIDSTACK_KEY, getGrid);

	onMount(() => {
		const g = GridStack.init({ ...options, auto: false }, gridEl);
		grid = g;

		const bindings: [string, Function | undefined][] = [
			['change', onchange],
			['added', onadded],
			['removed', onremoved],
			['dragstart', ondragstart],
			['drag', ondrag],
			['dragstop', ondragstop],
			['resizestart', onresizestart],
			['resize', onresize],
			['resizestop', onresizestop],
			['dropped', ondropped],
		];

		for (const [eventName, handler] of bindings) {
			if (handler) {
				g.on(eventName, (event: Event, ...args: unknown[]) => {
					(handler as (...a: unknown[]) => void)(event, ...args);
				});
			}
		}
	});

	$effect(() => {
		if (grid && options) {
			grid.updateOptions(options);
		}
	});

	/** Get the underlying GridStack instance. */
	export function getGridInstance(): GridStackInstance | undefined {
		return grid;
	}

	export function addWidget(w: Parameters<GridStackInstance['addWidget']>[0]): ReturnType<GridStackInstance['addWidget']> {
		return grid!.addWidget(w);
	}

	export function removeWidget(
		el: Parameters<GridStackInstance['removeWidget']>[0],
		removeDOM?: boolean,
		triggerEvent?: boolean
	): void {
		grid!.removeWidget(el, removeDOM, triggerEvent);
	}

	export function update(
		el: Parameters<GridStackInstance['update']>[0],
		opt: Parameters<GridStackInstance['update']>[1]
	): void {
		grid!.update(el, opt);
	}

	export function save(
		saveContent?: boolean,
		saveGridOpt?: boolean
	): ReturnType<GridStackInstance['save']> {
		return grid!.save(saveContent, saveGridOpt);
	}

	export function load(
		items: Parameters<GridStackInstance['load']>[0]
	): ReturnType<GridStackInstance['load']> {
		return grid!.load(items);
	}

	export function compact(): void {
		grid!.compact();
	}

	export function column(n: number): void {
		grid!.column(n);
	}

	export function float(val: boolean): void {
		grid!.float(val);
	}

	export function cellHeight(val?: number | string): void {
		grid!.cellHeight(val);
	}

	export function destroy(removeDOM = true): void {
		grid?.destroy(removeDOM);
		grid = undefined;
	}

	export function enable(): void {
		grid!.enable();
	}

	export function disable(): void {
		grid!.disable();
	}

	export function setStatic(val: boolean): void {
		grid!.setStatic(val);
	}

	export function batchUpdate(flag = true): void {
		grid!.batchUpdate(flag);
	}

	export function removeAll(removeDOM = true): void {
		grid!.removeAll(removeDOM);
	}

	export function makeWidget(
		el: Parameters<GridStackInstance['makeWidget']>[0],
		opt?: Parameters<GridStackInstance['makeWidget']>[1]
	): ReturnType<GridStackInstance['makeWidget']> {
		return grid!.makeWidget(el, opt);
	}
</script>

<div class="grid-stack" bind:this={gridEl}>
	{@render children?.()}
</div>
