
import { token_data, user_data, backend_adress } from "$lib/app";
import { io } from 'socket.io-client';
import { get, writable } from "svelte/store";
import { browser } from "$app/environment";

export const socket = writable(undefined);

export const task_connection = (task_id) => {
    if (get(socket)) {
        get(socket).disconnect();
    }
    socket.set(io(backend_adress, {
        transports: ["websocket"],
        reconnectionDelayMax: 10000,
        query: {
            portal: "chat",
            task: task_id
        },
        auth: { token: get(token_data).access_token }
    }));
};
export var onSendMessage = writable(() => { });
export var reply_message = writable(undefined);

export var cooldown_manager = writable({})

export const send_message = (value, options = {}) => {
    const index = get(messages).length;
    if (value.replaceAll(" ", "").length == 0 && options.images.length == 0) return;

    if (value.charAt(0) == "/") {
        get(socket).emit("command", value.substr(1, value.length - 1));

        return;
    }
    const callback = (callback_data) => {
        const message_callback = { ...obj, ...callback_data.message_obj, isPosted: true }
        get(messages)[index] = message_callback;
        console.log(callback_data)
        cooldown_manager.set(callback_data.cooldown_manager)
         
        messages.set([...get(messages)])
    }
    const obj = { message_type: "default", text: value, player_uuid: get(user_data).player_uuid, isPosted: false, isNew: true, nickname: get(user_data).nickname };
    const obj_remote = { message_type: "default", text: value }
    if (options.images && options.images.length > 0) {
        var remote_images = []
        var local_images = []
        for (let index = 0; index < options.images.length; index++) {
            const image = options.images[index];
            remote_images.push(image.file);
            local_images.push(image.preview)
        }
        obj.local_images = local_images;
        obj_remote.images = remote_images;
    }
    if (get(reply_message) && !options.reply) {
        obj.reply = get(reply_message);
        obj_remote.reply = get(reply_message).uuid;

    }
    else if (options.reply) {
        obj_remote.reply = options.reply.uuid;
    }
    get(socket).emit("send_message", obj_remote, callback);
    can_auto_scroll.set(true)
    messages.set([
        ...get(messages),
        obj,
    ]);
    return obj;
}

export const input_chat = writable(undefined);
export const scroll_chat = writable(undefined);
export var targetmessage = writable(undefined);
export var can_auto_scroll = writable(false)
export const scrolltomessage = (target) => {

    get(scroll_chat).addEventListener("scrollend", () => {
        setTimeout(() => {
            targetmessage.set(undefined);
        }, 500);
    });
    target.scrollIntoView({
        behavior: "smooth",
        block: 'center',
        inline: 'center'
    });

}

export const reply_type = (message) => {

    if (message.message_type == "points_reward") {
        return "Вознагрождение " + message.widget.nickname
    }
    else if (message.message_type == "join") {
        return message.widget.nickname + " вступил в задание."
    }
    else if (message.message_type == "leave") {
        return message.widget.nickname + " покинул в задание."
    }
    else if (message.message_type == "kick") {
        return message.widget.to + " был кикнут"
    }
    else { return message.nickname + ": " + message.text }

}


export var messages = writable([])