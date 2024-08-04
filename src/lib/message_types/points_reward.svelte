<script>
    import { token_data, user_data, backend_adress } from "$lib/app";
    import {
        send_message,
        reply_type,
        scrolltomessage,
        targetmessage,
        scroll_chat,
        reply_message,
        input_chat,
    } from "$lib/chat_service";
    import { formatDate } from "$lib/date.js";
    export var message;
    export var task_data;
    var isUsed = false;
    import { popup_callback, popup_data, popup_type } from "$lib/popup_data";
</script>

<div
    class="gap-[10px] w-full flex {message.player_uuid == $user_data.player_uuid
        ? 'flex-row-reverse'
        : 'flex-row '} items-end"
>
    <div
        class="  grow overflow-hidden relative flex {message.player_uuid ==
        $user_data.player_uuid
            ? 'flex-row-reverse'
            : 'flex-row '}"
    >
        <div class=" w-full h-fit max-w-full relative">
            <!-- {#key message["isnew"]}
                <div 
                    style="background-color: {message_color};"
                    class=" w-full h-full absolute left-0 top-0 blur-[100px] -z-10"
                />
            {/key} -->
            <button
                class="group p-[18px] w-full max-w-[300px] h-fit flex flex-col gap-[15px] items-center relative bg_px_round"
            >
                <div
                    style="background-image: url(/images/gradients/purple.png);  "
                    alt=""
                    class="absolute group-hover:scale-110 transition-transform w-full h-full left-0 top-0 pointer-events-none bg-cover"
                />

                <div
                    style="background-image: url(/images/noise.png);"
                    alt=""
                    class="absolute w-full h-full left-0 top-0 opacity-10 pointer-events-none"
                />
                <div
                    class="flex flex-col gap-[15px] items-center relative group-hover:scale-110 transition-transform"
                >
                    <div class="flex flex-row items-center gap-6 relative">
                        <img
                            alt=""
                            width="64"
                            src="https://mc-heads.net/avatar/{message.widget
                                .uuid}"
                            class="border-4 {task_data.owner ==
                            message.player_uuid
                                ? 'border-orange-500'
                                : 'border-white '}"
                        />
                        <p
                            style="font-family: minecraft_font_ten; font-size: 48px;  text-shadow: -4px 4px 0px #56148f;"
                            class="input bg-transparent focus:outline-none w-fit"
                        >
                            {"+" + message.widget.count}
                        </p>
                    </div>
                    <p class="text-[16px] break-words relative">
                        {message.widget.nickname}
                    </p>
                    <p class="text-[14px] text-white/60 relative">
                        {formatDate(new Date(message.createdAt))}
                    </p>
                </div>
                <button
                    class="group w-full h-full absolute"
                    on:click={() => {
                        popup_data.set({ ...message.widget });
                        popup_type.set("points_card");
                    }}
                />
            </button>

            {#if isUsed == false && message.widget.uuid != $user_data.player_uuid}
                <br />
                <div class="group w-fit h-fit max-w-full relative">
                    <button
                        on:click={() => {
                            isUsed = true;

                            send_message(
                                "Поздравляю " +
                                    message.widget.nickname +
                                    "! 🥳🎉🎊",
                                { reply: message },
                            );
                        }}
                        class="p-[18px] w-fit max-w-full group-active:scale-90 transition-transform h-fit relative bg_px_round flex flex-col gap-[15px]"
                    >
                        <div
                            alt=""
                            class="absolute group-hover:bg-slate-800 transition-colors w-full h-full left-0 top-0 pointer-events-none"
                        />
                        <div
                            style="background-image: url(/images/noise.png);"
                            alt=""
                            class="absolute w-full h-full left-0 top-0 opacity-10 pointer-events-none"
                        />
                        <p
                            class="text-[16px] min-w-[200px] max-w-[450px] break-words relative text-left"
                        >
                            Поздравьте {message.widget.nickname} с вознаграждением!
                            🥳
                        </p>
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>
