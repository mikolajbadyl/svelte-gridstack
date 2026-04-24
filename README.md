# svelte-gridstack

Svelte 5 wrapper for [gridstack.js](https://gridstackjs.com/) - a TypeScript-first, reactive dashboard layout library with drag-and-drop and resize support.

## Installation

```sh
npm install svelte-gridstack gridstack
```

> `gridstack` is a **peer dependency** - you control the version.

## Quick Start

```svelte
<script lang="ts">
  import 'gridstack/dist/gridstack.min.css';
  import { GridStack, GridStackItem } from 'svelte-gridstack';
</script>

<GridStack options={{ cellHeight: 70, float: true }}>
  <GridStackItem id="a" x={0} y={0} w={2} h={2}>
    <h2>Widget A</h2>
    <p>Drag and resize me!</p>
  </GridStackItem>

  <GridStackItem id="b" x={2} y={0} w={2} h={1}>
    <h2>Widget B</h2>
  </GridStackItem>

  <GridStackItem id="c" x={4} y={0} w={2} h={3} autoPosition>
    <h2>Widget C</h2>
  </GridStackItem>
</GridStack>
```

## Dynamic Widgets

Use `GridStackDynamic` when widgets come from an array. It uses Svelte's `{#each}` with keyed blocks for proper lifecycle management.

```svelte
<script lang="ts">
  import { GridStackDynamic, GridStackItem } from 'svelte-gridstack';

  let widgets = $state([
    { id: 'w1', x: 0, y: 0, w: 2, h: 2, title: 'Chart' },
    { id: 'w2', x: 2, y: 0, w: 3, h: 1, title: 'Stats' },
    { id: 'w3', x: 5, y: 0, w: 2, h: 3, title: 'Table' },
  ]);

  function handleRemove(id: string) {
    widgets = widgets.filter(w => w.id !== id);
  }
</script>

<GridStackDynamic
  {widgets}
  options={{ cellHeight: 80, float: true }}
  onchange={(nodes) => console.log('changed:', nodes)}
>
  {#snippet children(widget, i)}
    <GridStackItem id={widget.id} x={widget.x} y={widget.y} w={widget.w} h={widget.h}>
      <div class="widget">
        <h3>{widget.title}</h3>
        <button onclick={() => handleRemove(widget.id)}>Remove</button>
      </div>
    </GridStackItem>
  {/snippet}
</GridStackDynamic>
```

## API Reference

### `<GridStack>`

Main grid container component.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `GridStackOptions` | `{}` | GridStack configuration options |

**Events (callback props):**

| Prop | Type | Description |
|------|------|-------------|
| `onchange` | `(nodes: GridStackNode[]) => void` | Widgets changed position/size |
| `onadded` | `(nodes: GridStackNode[]) => void` | Widget(s) added |
| `onremoved` | `(nodes: GridStackNode[]) => void` | Widget(s) removed |
| `ondragstart` | `(event, el, node) => void` | Drag started |
| `ondrag` | `(event, el, node) => void` | Dragging |
| `ondragstop` | `(event, el, node) => void` | Drag stopped |
| `onresizestart` | `(event, el, node) => void` | Resize started |
| `onresize` | `(event, el, node) => void` | Resizing |
| `onresizestop` | `(event, el, node) => void` | Resize stopped |
| `ondropped` | `(event, prevNode, newNode) => void` | Widget dropped from another grid |

**Imperative methods (via `bind:this`):**

```svelte
<script lang="ts">
  import { GridStack } from 'svelte-gridstack';
  let grid: GridStack;
</script>

<GridStack bind:this={grid} />

<button onclick={() => grid.save()}>Save Layout</button>
<button onclick={() => grid.compact()}>Compact</button>
<button onclick={() => grid.setStatic(true)}>Lock</button>
```

Available methods: `addWidget()`, `removeWidget()`, `update()`, `save()`, `load()`, `compact()`, `float()`, `column()`, `cellHeight()`, `enable()`, `disable()`, `setStatic()`, `batchUpdate()`, `removeAll()`, `destroy()`, `makeWidget()`, `getGridInstance()`.

### `<GridStackItem>`

Individual widget wrapper. Must be a direct child of `<GridStack>` or `<GridStackDynamic>`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Widget ID |
| `x` | `number` | - | Column position |
| `y` | `number` | - | Row position |
| `w` | `number` | - | Width in columns |
| `h` | `number` | - | Height in rows |
| `autoPosition` | `boolean` | - | Auto-place the widget |
| `minW` / `maxW` | `number` | - | Min/max width |
| `minH` / `maxH` | `number` | - | Min/max height |
| `noResize` | `boolean` | - | Disable resize |
| `noMove` | `boolean` | - | Disable drag |
| `locked` | `boolean` | - | Lock in place |
| `sizeToContent` | `boolean \| number` | - | Auto-size to content |

All props are reactive - changing them will update the widget in the grid.

### `<GridStackDynamic>`

Keyed-each grid container for data-driven widget lists.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `widgets` | `T[]` | Array of widget data (must have `id`) |
| `options` | `GridStackOptions` | Grid options |
| `children` | `Snippet<[T, number]>` | Render snippet for each widget |

Supports the same event callbacks as `<GridStack>`.

## Complete Options Example

```svelte
<script lang="ts">
  import { GridStack, GridStackItem } from 'svelte-gridstack';
  import type { GridStackOptions } from 'svelte-gridstack';

  const gridOpts: GridStackOptions = {
    column: 12,
    cellHeight: 'auto',
    float: true,
    animate: true,
    margin: 10,
    disableDrag: false,
    disableResize: false,
    minRow: 1,
    staticGrid: false,
    acceptWidgets: true,
  };

  let grid: GridStack;

  function handleSave() {
    const layout = grid.save();
    localStorage.setItem('grid-layout', JSON.stringify(layout));
  }

  function handleLoad() {
    const raw = localStorage.getItem('grid-layout');
    if (raw) {
      grid.load(JSON.parse(raw));
    }
  }
</script>

<button onclick={handleSave}>Save</button>
<button onclick={handleLoad}>Load</button>

<GridStack
  bind:this={grid}
  options={gridOpts}
  onchange={(nodes) => console.log('Layout changed', nodes)}
  ondragstop={(_, el, node) => console.log('Dropped', node)}
  onresizestop={(_, el, node) => console.log('Resized', node)}
>
  <GridStackItem id="chart" x={0} y={0} w={6} h={4} minW={3}>
    <MyChart />
  </GridStackItem>

  <GridStackItem id="table" x={6} y={0} w={6} h={4}>
    <MyTable />
  </GridStackItem>
</GridStack>
```

## Notes

- You must import GridStack CSS yourself: `import 'gridstack/dist/gridstack.min.css'`
- All `GridStackOptions` and `GridStackWidget` types are re-exported from `gridstack` for convenience.
- The library uses Svelte 5 runes (`$props`, `$state`, `$effect`). Svelte 4 is not supported.

## License

MIT
