import { get, writable } from "svelte/store";
import { user_data, token_data, backend_adress } from "$lib/app";
import { page } from "$app/stores";
export const task_data = writable(undefined)


export async function get_task_data() {
  
    task_data.set( await fetch(
        backend_adress+
            "/task/" +
            get(page).params.id +
            "?token=" +
            get(token_data).access_token
    ).then(async (response) => {
        if (response.status == 200) return response.json();
    }));
}