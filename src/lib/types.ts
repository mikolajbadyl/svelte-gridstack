import type { GridStackNode, GridStackOptions, GridStackWidget } from 'gridstack';

/** Event handler for grid change events (nodes changed position/size) */
export type GridStackChangeHandler = (nodes: GridStackNode[]) => void;

/** Event handler for drag/resize start/stop events */
export type GridStackDragResizeHandler = (event: Event, el: HTMLElement, node: GridStackNode) => void;

/** Event handler for drag/resize move events */
export type GridStackDragResizeMoveHandler = (event: Event, el: HTMLElement, node: GridStackNode) => void;

/** Event handler for dropped event */
export type GridStackDropHandler = (event: Event, previousNode: GridStackNode, newNode: GridStackNode) => void;

/** Event handler for element events (added/removed) */
export type GridStackElementHandler = (event: Event, el: HTMLElement) => void;

/** Callback props exposed by GridStack container component */
export interface GridStackEvents {
	/** Fired when widgets change their position/size */
	onchange?: GridStackChangeHandler;
	/** Fired when a widget is added */
	onadded?: GridStackChangeHandler;
	/** Fired when a widget is removed */
	onremoved?: GridStackChangeHandler;
	/** Fired when drag starts */
	ondragstart?: GridStackDragResizeHandler;
	/** Fired during drag */
	ondrag?: GridStackDragResizeMoveHandler;
	/** Fired when drag stops */
	ondragstop?: GridStackDragResizeHandler;
	/** Fired when resize starts */
	onresizestart?: GridStackDragResizeHandler;
	/** Fired during resize */
	onresize?: GridStackDragResizeMoveHandler;
	/** Fired when resize stops */
	onresizestop?: GridStackDragResizeHandler;
	/** Fired when a widget is dropped from another grid */
	ondropped?: GridStackDropHandler;
}

/** Props for the GridStack container component */
export interface GridStackProps extends GridStackEvents {
	/** GridStack options. Will be applied on mount and reactively updated. */
	options?: GridStackOptions;
}

/** Props for the GridStackItem component */
export interface GridStackItemProps {
	/** Widget ID (mapped to gs-id) */
	id?: string;
	/** X position */
	x?: number;
	/** Y position */
	y?: number;
	/** Width in columns */
	w?: number;
	/** Height in rows */
	h?: number;
	/** Auto-position this widget */
	autoPosition?: boolean;
	/** Minimum width */
	minW?: number;
	/** Maximum width */
	maxW?: number;
	/** Minimum height */
	minH?: number;
	/** Maximum height */
	maxH?: number;
	/** Disable resizing for this item */
	noResize?: boolean;
	/** Disable moving for this item */
	noMove?: boolean;
	/** Lock the item in place (won't be pushed by other items) */
	locked?: boolean;
	/** Resize to fit content */
	sizeToContent?: boolean | number;
}

/**
 * Convert GridStackItemProps to GridStackWidget format for gridstack API calls.
 */
export function itemPropsToWidget(props: GridStackItemProps): GridStackWidget {
	const widget: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(props)) {
		if (value !== undefined) {
			widget[key] = value;
		}
	}
	return widget as GridStackWidget;
}
