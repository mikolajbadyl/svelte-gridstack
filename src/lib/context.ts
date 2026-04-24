import type { GridStack } from 'gridstack';

/**
 * Context key for sharing the GridStack instance between container and items.
 * Stores a getter function so items can always retrieve the latest grid reference.
 */
export const GRIDSTACK_KEY = Symbol('gridstack');

export type GridStackGetter = () => GridStack | undefined;
