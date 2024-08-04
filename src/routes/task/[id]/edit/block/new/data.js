import { writable } from "svelte/store";
export const subpage = writable(1);
export const player = writable(undefined);
export const expire_date = writable(undefined);