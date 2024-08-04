import { writable } from "svelte/store";

export var popup_type = writable(undefined);
export var popup_callback = writable(() => {});
export var popup_data = writable(undefined);

export const clear_popup_data = () => {
    popup_type.set(undefined);
    popup_data.set(undefined);
}