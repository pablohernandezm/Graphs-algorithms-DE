import {writable} from "svelte/store";
import type {Writable} from "svelte/store"

export const enum AppAction {
    addingNode, addingLink, removing,default
}
export const action:Writable<AppAction>=writable(AppAction.default);
export const setAction=(newAction:AppAction)=>{
    action.set(newAction);
}