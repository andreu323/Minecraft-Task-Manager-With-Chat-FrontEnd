<script>
    import { task_name_colors, task_display_names,task_status_colors,task_status_names } from "$lib/task_info";
    import { token_data, user_data, backend_adress } from "$lib/app";
    import { date_to_characters } from "$lib/date";
    import { onMount } from "svelte";
    export var show_category_tag = true;

    export var task_data = {};
    var error;
    var isloading = true;
    var isOwner = false;
    var isWorker = false;
    onMount(async () => {
        isOwner = task_data.owner == $user_data.player_uuid;
        isWorker = task_data.workers.includes($user_data.player_uuid);
    });
    function set_as_readen() {
        const notify_fetch = fetch(
            backend_adress +
                "/new_messages/" +
                task_data.id +
                "/readthem" +
                "?token=" +
                $token_data.access_token
        ).then(async (response) => {
            if (response.status != 200) error = await response.text();
        });
    }
</script>

<div class="  w-full h-fit relative">
    <div class="relative">
        <div
            class=" 
            w-full flex bg_px_round"
        >
            <a href="#" class="w-[200px] relative hidden md:block">
                <div class="absolute top-0 left-0 w-full h-full bg-gray-500">
                    {#if task_data.images.length > 0}
                        <img
                            alt="task_screenshot"
                            src={backend_adress +
                                "/assets/images/task/" +
                                task_data.id +
                                "/" +
                                task_data.images[0] +
                                "-low.png"}
                            class="h-full w-full object-cover  object-center"
                        />
                    {/if}
                </div>
            </a>

            <a
                href="/task/{task_data.id}{task_data.workers.includes(
                    $user_data.player_uuid
                ) || task_data.owner == $user_data.player_uuid
                    ? '/chat'
                    : ''}"
                class="bg-blue-950
                transition-colors
              hover:bg-blue-900 grow p-6 flex flex-col md:flex-row h-full relative gap-3"
            >
                <div class="flex flex-col grow max-w-[400px] gap-2">
                    <p
                        class="text-[24px] grow h-full line-clamp-2"
                        style="font-family: minecraft_font_ten;   "
                    >
                        {task_data.title}
                    </p>
                    <p   style="color: {task_status_colors[task_data.status]};">{task_status_names[task_data.status]}</p>
                
                    {#if isWorker || isOwner}
                        {#if task_data.last_message}
                            <div class="flex flex-row space-x-2 items-center">
                                {#if task_data.notify}
                                    <a
                                        href="#"
                                        on:click={() => {
                                            task_data.notify = undefined;
                                            set_as_readen();
                                        }}
                                        class=" shrink-0  w-[50px] h-[30px]
                                "
                                    >
                                        <div class="w-full h-full">
                                            <p
                                                class="bg-cover w-full h-full text-[14px] flex justify-center
                                        items-center shrink-0 text-black
                                        hover:scale-125 active:scale-75 transition-transform
                                        pointer-events-auto relative"
                                                style="background-image: url(/images/profile/new_message_count_bg.png); image-rendering: pixelated;"
                                            >
                                                {task_data.notify.count}
                                            </p>
                                        </div>
                                    </a>
                                {/if}
                                <p
                                    class="text-gray-400 line-clamp-1 break-all h-min"
                                >
                                    {task_data.last_message}
                                </p>
                            </div>
                        {:else}
                            <div class="flex flex-row space-x-2 items-center">
                                <p
                                    class="text-gray-400 line-clamp-1 break-all h-min"
                                >
                                    нет сообщений
                                </p>
                            </div>
                        {/if}
                    {/if}
                    <p class="text-[14px] text-[#6F6F6F] md:w-[260px]">
                        {"создано " + date_to_characters(task_data.createdAt)}
                    </p>
                </div>
                <div
                    class="flex flex-col grow self-stretch space-y-2 justify-between items-end"
                >
                    <div class="flex flex-row space-x-3 items-center">
                        {#if show_category_tag}
                            <a
                                href="/?category={task_data.category}"
                                class="flex px-[20px] py-[10px] items-center space-x-[10px] bg-black/30 hover:bg-blue-700 bg_px_round"
                            >
                                <p
                                    class="text-[14px]"
                                    style="color: {task_name_colors[
                                        task_data.category
                                    ]};"
                                >
                                    {task_display_names[task_data.category]}
                                </p>
                            </a>
                        {/if}
                        <div class="  flex space-x-[10px]">
                            <div class="h-[30px] flex items-center">
                                <div class="w-[20px] h-[20px] bg-white" />
                            </div>
                            <div
                                class="text-white text-center text-[20px]"
                                style="font-family: minecraft_font_ten;"
                            >
                                {task_data.points}
                            </div>
                        </div>
                    </div>
                    <div class="  flex flex-row space-x-2 items-center">
                        <img
                            src="https://mc-heads.net/avatar/{task_data.owner}"
                            alt=""
                            width="32"
                            height="32"
                        />
                        <div
                            class="flex px-[20px] py-[10px] items-center space-x-[10px] bg-black/25 bg_px_round"
                        >
                            <p
                                class="text-[14px] self-stretch justify-center flex items-center"
                            >
                                {task_data.workers.length +
                                    "/" +
                                    task_data.max_workers}
                            </p>
                            <div
                                class="flex flex-row px-[5px] grow space-x-[10px]"
                            >
                                {#each task_data.workers as worker, i}
                                    {#if i < 4}
                                        <img
                                            src="https://mc-heads.net/avatar/{worker}"
                                            alt=""
                                            width="24"
                                        />
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</div>
