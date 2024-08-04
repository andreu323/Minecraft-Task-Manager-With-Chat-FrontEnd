<script>
    import DefaultTemplate from "./message_template/default_template.svelte";
    import { formatDate } from "$lib/date.js";
    export var message;
    export var task_data;
    var reply = false;
    document.addEventListener("keydown", (event) => {
        if (event.keyCode == 16) reply = true;
    });
    document.addEventListener("keyup", (event) => {
        if (event.keyCode == 16) reply = false;
    });
    import {
        reply_type,
        scrolltomessage,
        targetmessage,
        scroll_chat,
        reply_message,
        input_chat,
    } from "$lib/chat_service";
    targetmessage.subscribe(async (value) => {
        if (value == message.uuid) {
            scrolltomessage(target_scroll);
        }
    });
    var target_scroll;
</script>

<div
    bind:this={target_scroll}
    class="text-[16px] min-w-[200px] break-words relative flex flex-row items-center gap-2 flex-wrap bg_px_round text-red-500 p-3"
>
    <div class="flex flex-row items-center gap-3 shrink-0">
        <img
            alt=""
            width="30"
            height="30"
            src="https://mc-heads.net/avatar/{message.widget.to}"
        />
        <p class="text-[16px] relative">
            {message.widget.to}
        </p>
    </div>

    {#if message.widget.expire_date == "forever"}
        <p class="text-[16px] shrink-0 relative">был кикнут Навсегда,</p>
    {:else if message.widget.expire_date }
        <p class="text-[16px] shrink-0 relative">
            был кикнут до: {formatDate(
                new Date(message.widget.expire_date)
            )},
        </p>
    {:else}
    <p class="text-[16px] shrink-0 relative">
        был кикнут,
    </p>
    {/if}
    <div class="flex flex-row items-center gap-3 shrink-0">
        <p class="text-[16px] shrink-0 relative">кикнул:</p>
        <img
            alt=""
            width="30"
            height="30"
            src="https://mc-heads.net/avatar/{message.widget.from}"
        />
        <p class="text-[16px] relative">
            {message.widget.from}
        </p>
    </div>
    {#if reply == true}
        <div
            class="w-full hover:bg-white/10 h-full absolute left-0 top-0 cursor-pointer select-none"
            on:click={() => {
                reply_message.set(message);
                $input_chat.focus();
            }}
        />
    {/if}
</div>
