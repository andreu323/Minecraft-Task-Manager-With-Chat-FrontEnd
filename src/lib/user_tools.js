import { get } from "svelte/store";
import { token_data, user_data, backend_adress } from "$lib/app";
export async function edit_user(data, player_uuid) {
    await fetch(
        backend_adress +
        "/user_data/edit/" +
        player_uuid +
        "?token=" +
        get(token_data).access_token,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                ...data
            }),
        }
    );
}
export async function remove_user( player_uuid) {
    await fetch(
        backend_adress +
        "/user_data/remove/" +
        player_uuid +
        "?token=" +
        get(token_data).access_token, 
    );
    
}