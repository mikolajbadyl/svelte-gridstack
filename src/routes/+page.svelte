<script lang="ts">
  import 'gridstack/dist/gridstack.min.css';
  import { GridStack, GridStackItem } from '$lib';
  import type { GridStackNode } from 'gridstack';

  let gridRef: GridStack;
  let staticMode = $state(false);

  interface StaticWidget {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    noResize?: boolean;
    noMove?: boolean;
    color: string;
  }

  const staticWidgets: StaticWidget[] = [
    { id: 'a', x: 0, y: 0, w: 12, h: 1, minW: 6, noResize: true, color: '#334155' },
    { id: 'b', x: 0, y: 1, w: 3,  h: 3, minW: 2, minH: 2,         color: '#1e40af' },
    { id: 'c', x: 3, y: 1, w: 6,  h: 3, minW: 3, minH: 2,         color: '#065f46' },
    { id: 'd', x: 9, y: 1, w: 3,  h: 3, minW: 2, minH: 2,         color: '#92400e' },
    { id: 'e', x: 0, y: 4, w: 12, h: 1, minW: 6, noResize: true,  color: '#334155' },
  ];

  function handleSave() {
    const layout = gridRef.save();
    console.log(JSON.stringify(layout, null, 2));
  }

  function handleCompact() {
    gridRef.compact();
  }

  function handleToggleStatic() {
    staticMode = !staticMode;
    gridRef.setStatic(staticMode);
  }
</script>

<GridStack
  bind:this={gridRef}
  options={{
    column: 12,
    cellHeight: 80,
    float: true,
    animate: true,
    margin: 8,
    acceptWidgets: true,
  }}
  onchange={(nodes: GridStackNode[]) => console.log(nodes)}
>
  {#each staticWidgets as w (w.id)}
    <GridStackItem
      id={w.id}
      x={w.x}
      y={w.y}
      w={w.w}
      h={w.h}
      minW={w.minW}
      minH={w.minH}
      noResize={w.noResize}
      noMove={w.noMove}
    >
      <div class="widget" style="background: {w.color};"></div>
    </GridStackItem>
  {/each}
</GridStack>

<div class="toolbar">
  <button onclick={handleSave}>Save</button>
  <button onclick={handleCompact}>Compact</button>
  <button onclick={handleToggleStatic} class:active={staticMode}>
    {staticMode ? 'Unlock' : 'Lock'}
  </button>
</div>

<style>
  :global(body) {
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    background: #0f172a;
    color: #e2e8f0;
  }

  :global(.grid-stack-item-content) {
    inset: 0 !important;
  }

  :global(.grid-stack > .grid-stack-item > .grid-stack-item-content) {
    overflow: hidden;
  }

  :global(.grid-stack-placeholder > .placeholder-content) {
    border: 2px dashed rgba(148, 163, 184, 0.4) !important;
    background-color: rgba(148, 163, 184, 0.08) !important;
    border-radius: 8px;
  }

  .widget {
    border-radius: 8px;
    height: 100%;
    width: 100%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .toolbar {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  button {
    padding: 0.4rem 0.75rem;
    background: #1e293b;
    color: #94a3b8;
    border: 1px solid #334155;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.8rem;
  }

  button:hover {
    background: #334155;
    color: #e2e8f0;
  }

  button.active {
    background: #7c3aed;
    border-color: #7c3aed;
    color: white;
  }
</style>
