import {writable} from "svelte/store";
import type {Writable} from "svelte/store"
import type {GraphLine, GraphNode} from "$lib/index";

export const enum AppAction {
    addingNode, addingLink, removing, editing, default
}
export const action:Writable<AppAction>=writable(AppAction.default);
export const graphNodes:Writable<GraphNode[]>=writable([]);
export const graphLines:Writable<GraphLine[]>=writable([]);
export const diameter:Writable<number>=writable(50);
export const selectedLine:Writable<number>=writable(-1)
export const selectedNode:Writable<number>=writable(-1)