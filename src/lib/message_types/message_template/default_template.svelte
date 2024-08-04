<script>
    import { formatDate } from "$lib/date.js";
    export var message;
    export var task_data;
    import { token_data, user_data, backend_adress } from "$lib/app";

    import {
        reply_type,
        scrolltomessage,
        targetmessage,
        scroll_chat,
        reply_message,
        input_chat,
    } from "$lib/chat_service";
    import { scale } from "svelte/transition";
    import Images from "./images.svelte";
    export var message_color = "";
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key message.isNew == true}
    <div
        id={message.uuid}
        class="gap-[10px] w-full flex {message.player_uuid ==
        $user_data.player_uuid
            ? 'flex-row-reverse'
            : 'flex-row '} items-end"
        in:scale
    >
        <div
            class=" 
                grow overflow-hidden transition-colors bg_px_round relative flex {message.player_uuid ==
            $user_data.player_uuid
                ? 'flex-row-reverse'
                : 'flex-row '}"
        >
            <div
                class="w-fit h-fit max-w-full relative flex {message.player_uuid ==
                    $user_data.player_uuid
                        ? 'items-end'
                        : ' '} flex-col"
            >
                <!-- {#key message["isnew"]}
                <div 
                    
                    class="bg-white w-full h-full absolute left-0 top-0 blur-[100px] -z-10"
                />
            {/key} -->
                {#if message.reply}
                    <div
                        on:click={() => {
                            targetmessage.set(message.reply.uuid);
                        }}
                        class=" py-2 px-5 max-w-[400px] cursor-pointer pointer-events-auto relative flex justify-end overflow-hidden text-zinc-600"
                    >
                        <p class=" select-none line-clamp-1 break-all">
                            {reply_type(message.reply)}
                        </p>
                    </div>
                {/if}

                <div
                    class="   w-fit max-w-full h-fit relative bg_px_round flex flex-col"
                >
                    <div
                        style="background-color: {message_color};"
                        alt=""
                        class="absolute w-full h-full left-0 top-0 pointer-events-none"
                    />

                    <div
                        style="background-image: url(/images/noise.png);"
                        alt=""
                        class="absolute w-full h-full left-0 top-0 opacity-10 pointer-events-none"
                    />

                    <div class="p-[18px] flex flex-col gap-[15px]">
                        <slot />

                        {#if message.images && message.images.length > 0}
                            <Images
                                images={message.images}
                                isLocal={false}
                                {task_data}
                                {message}
                            />
                        {:else if message.local_images}
                            <Images
                                images={message.local_images}
                                {task_data}
                                {message}
                            />
                        {/if}
                        {#if message.isPosted}
                            <p class="text-[14px] text-white/[0.15] relative">
                                {formatDate(new Date(message.createdAt))}
                            </p>
                        {:else}
                            <p
                                class="text-[14px] text-orange-500/[0.15] relative"
                            >
                                публикуеться..
                            </p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/key}
