<script>
    import { token_data, user_data, backend_adress } from "$lib/app";
    import { fade } from "svelte/transition";
    import { message_types } from "$lib/messages";
    import { flip } from "svelte/animate";
    import { onMount } from "svelte";
    import {
        reply_type,
        scrolltomessage,
        targetmessage,
        scroll_chat,
        reply_message,
        input_chat,
    } from "$lib/chat_service";
    export var message = {};
    export var task_data;

    onMount(() => {
 
        message.isNew = false;
    });     
    targetmessage.subscribe(async (value) => { 
        if (value == message.uuid && message.isPosted) {
            scrolltomessage(target_scroll);
        }
    });
    var reply = false;
    document.addEventListener("keydown", (event) => {
        if (event.keyCode == 16) reply = true;
    });
    document.addEventListener("keyup", (event) => {
        if (event.keyCode == 16) reply = false;
    });
    var target_scroll = undefined;
</script>

<div
    bind:this={target_scroll}
    class="relative transition-colors  {$reply_message && $reply_message.uuid == message.uuid
        ? '!bg-purple-950/60  '
        : ''} 
    {$targetmessage == message.uuid && message.isPosted? 'bg-blue-950/60 ' : ''}"
>
    <svelte:component
        this={message_types[message.message_type]}
        {task_data}
        {message}
    />
    {#if reply == true && message.isPosted}
        <div
            class="w-full hover:bg-white/10 h-full absolute left-0 top-0 cursor-pointer select-none"
            on:click={() => {
                reply_message.set(message);
                $input_chat.focus();
            }}
        />
    {/if}
</div>
