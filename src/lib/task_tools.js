
import { token_data, user_data, backend_adress } from "$lib/app";
import { get } from "svelte/store";

export const leave_task = async (task_id) => {
    const leave_task_status = await fetch(
        backend_adress +
        "/task/leave/" +
        task_id +
        "?token=" +
        get(token_data).access_token
    ).then((response) => {
        return response.text();
    });
    return leave_task_status;
}
export const accept_task = async (task_id) => {
    const accept_task_status = await fetch(
        backend_adress +
        "/task/accept/" +
        task_id +
        "?token=" +
        get(token_data).access_token
    ).then((response) => {
        return response.text();
    });
    return accept_task_status;
}

export const delete_task = async (task_id) => {
    const accept_task_status = await fetch(
        backend_adress +
        "/task/delete/" +
        task_id +
        "?token=" +
        get(token_data).access_token
    ).then((response) => {
        return response.text();
    });
    return accept_task_status;
}

export const give_points = async (task_id, count, player_uuid) => {

    const data = fetch(
        backend_adress +
        "/task/points/reward/" +
        task_id + "/" + count + "/" + player_uuid +
        "?token=" +
        get(token_data).access_token
    )
        .then(async (response) => {
            if (response.status == 200) return response.text();
        });


    return data;
}
export const get_task = async (task_id) => {
    const data = await fetch(
        backend_adress +
        "/task/" +
        task_id +
        "?token=" +
        get(token_data).access_token
    ).then(async (response) => {
        if (response.status == 200) return response.json();
        else return { error: await response.text() };
    });
    return data;
}
 
export const kick = async (task_id, expire_date, player_uuid) => {

    var url = backend_adress +
        "/task/block/" +
        task_id + "/" + player_uuid +
        "?token=" +
        get(token_data).access_token; 
    if (expire_date != undefined && expire_date != "none") {
        url = url + "&expire_date=" + expire_date;
    }
    const data = fetch(
        url
    )
        .then(async (response) => {
            if (response.status == 200) return response.text();
        });


    return data;
}
