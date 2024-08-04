<script>
    import { goto, afterNavigate, invalidateAll } from "$app/navigation";
    import { task_name_colors, task_display_names,task_status_colors,task_status_names } from "$lib/task_info";
    import { onMount } from "svelte";
    import { date_to_characters, formatDate } from "$lib/date.js";
    import { token_data, user_data, backend_adress } from "$lib/app";
    import { accept_task, leave_task, get_task } from "$lib/task_tools";
    import { page } from "$app/stores";
    import { fade, fly } from "svelte/transition";

    var canManage = false;
    var isOwner = false;
    var isKicked = false;
    var x = 0;

    var previousPage = "/profile";
    afterNavigate(({ from }) => {
        if (from) previousPage = from.url.pathname;
    });
    var error = undefined;
    var active = 0;
    export var task_data = undefined;
    var desc_element;
    function jsonToHtml(json) {
        if (json.tagName == "script") return;
        var element = document.createElement(json.tagName);
        if (json.attributes) {
            for (var name in json.attributes) {
                if (name !== "class") {
                    element.setAttribute(name, json.attributes[name]);
                }
            }
        }
        if (json.childNodes) {
            for (var i = 0; i < json.childNodes.length; i++) {
                var childNode = json.childNodes[i];

                if (typeof childNode === "string") {
                    element.appendChild(document.createTextNode(childNode));
                } else {
                    element.appendChild(jsonToHtml(childNode));
                }
            }
        }
        return element;
    }
    function getdesc() {
        const desc_json = JSON.parse(task_data.description);
        const html = jsonToHtml(desc_json);
        return html.innerHTML;
    }
    async function get_task_data() {
        task_data = await get_task($page.params.id);
        isOwner = task_data.owner == $user_data.player_uuid;
        canManage =
            $user_data.permissions.includes("*") ||
            $user_data.permissions.includes("task_manage");
        isKicked =
            (task_data.kick &&
                new Date(task_data.kick.expire_date) > new Date()) ||
            (task_data.kick && task_data.kick.expire_date == "forever");
    }
    var high_img = undefined;
    var controller;

    function reload_img() {
        controller = new AbortController();

        high_img = undefined;
        fetch(
            backend_adress +
                "/assets/images/task/" +
                $page.params.id +
                "/" +
                task_data.images[active] +
                ".png",
            { signal: controller.signal }
        )
            .then(async (res) => res.blob())
            .then((blob) => (high_img = blob));
    }
    onMount(async () => {
        function animateBackground() {
            x += 0.02;
            requestAnimationFrame(animateBackground);
        }
        animateBackground();
        await get_task_data();
        setTimeout(() => {
            glow_visible = true;
        }, 500);
    });
    var glow_visible = false;

    async function onaccept_task() {
        await accept_task($page.params.id);
        await get_task_data();
    }
    async function onleave_task() {
        await leave_task($page.params.id);
        await get_task_data();
    }
    $: if (active != undefined && task_data) {
        if (controller) controller.abort();
        if (task_data.images.length > 0) reload_img();
    }
</script>

{#if task_data != undefined}
    <div
        transition:fly
        class="w-full h-full shrink-0  grow flex justify-center mt-3"
    >
        <div class="w-full relative max-w-[1024px] space-y-[25px]">
            <div class="w-full md:px-[50px] space-y-[15px] pb-[180px]">
                <!-- <div class="h-[45px] bg-cover bg-center relative bg-purple-800">
                    <div
                        class="bg-center bg-contain bg-repeat-x w-full h-full"
                        style="background-size:150px 27px; background-position-x: {x}%; background-image: url(/images/task/task_title.svg);"
                    />
                </div> -->
                <div class="w-full space-y-[10px] relative">
                    {#if task_data.images.length > 0}
                        {#key active || glow_visible}
                            <img
                                transition:fade={{ duration: 2000 }}
                                src={backend_adress +
                                    "/assets/images/task/" +
                                    $page.params.id +
                                    "/" +
                                    task_data.images[active] +
                                    "-low.png"}
                                alt=""
                                draggable="false"
                                class=" h-[400px] -z-10 blur-[100px] absolute top-0 left-0 w-full object-cover"
                                class:hidden={!glow_visible}
                            />
                        {/key}
                    {/if}
                    <div
                        class="w-full h-fit bg_px_round relative overflow-hidden"
                    >
                        <div
                            class="w-full h-[400px] bg-black overflow-hidden bg-cover bg-center relative"
                        >
                            {#if task_data.images.length > 0}
                                {#key active}
                                    <div
                                        class="w-full h-full"
                                        in:fade={{ duration: 300 }}
                                        out:fade={{ duration: 300 }}
                                    >
                                        <img
                                            src={backend_adress +
                                                "/assets/images/task/" +
                                                $page.params.id +
                                                "/" +
                                                task_data.images[active] +
                                                "-low.png"}
                                            alt=""
                                            draggable="false"
                                            class=" absolute top-0 left-0 w-full h-full object-cover"
                                        />
                                        <div
                                            class="bg-black/60 backdrop-blur-[8px] absolute top-0 left-0 w-full h-full"
                                        />

                                        <img
                                            src={high_img != undefined
                                                ? URL.createObjectURL(high_img)
                                                : backend_adress +
                                                  "/assets/images/task/" +
                                                  $page.params.id +
                                                  "/" +
                                                  task_data.images[active] +
                                                  "-low.png"}
                                            alt=""
                                            class=" absolute top-0 left-0 w-full h-full object-contain"
                                        />
                                    </div>
                                {/key}
                            {:else}
                                <div
                                    class="absolute w-full h-full flex justify-center items-center"
                                >
                                    <p
                                        style="font-family: minecraft_font_ten; font-size: 20px;"
                                    >
                                        нет картинок
                                    </p>
                                </div>
                            {/if}
                        </div>
                        <div
                            class="p-[10px] w-full bg-gray-700/40 backdrop-blur-[100px] space-x-[10px] flex flex-row overflow-x-auto relative"
                        >
                            {#each task_data.images as image, i}
                                <button
                                    class="w-[140px] h-[90px] relative group shrink-0"
                                    on:click={() => {
                                        active = i;
                                    }}
                                >
                                    <div class="bg_px_round w-full h-full">
                                        <img
                                            alt=""
                                            src={backend_adress +
                                                "/assets/images/task/" +
                                                $page.params.id +
                                                "/" +
                                                image +
                                                "-low.png"}
                                            loading="lazy"
                                            draggable="false"
                                            class="w-full h-full object-cover cursor-pointer relative {active ==
                                            i
                                                ? ' '
                                                : '  opacity-40  '} transition-opacity"
                                        />
                                    </div>

                                    <div
                                        style="background-image: url(/images/gradients/purple.png);"
                                        class="absolute top-0 left-0 w-full h-full outline_px_rouned {active ==
                                        i
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-40'} bg-cover bg-center"
                                    />
                                </button>
                            {/each}
                        </div>
                    </div>
                    <p
                        class="w-full text-[24px] relative"
                        style="font-family: minecraft_font_ten;"
                    >
                        {task_data.title}
                    </p>
                </div>
                <div
                    class="gap-5 md:space-y-0 w-full flex flex-col md:flex-row"
                >
                    <div
                        class="space-y-[15px] shrink-0 w-[260px] backdrop-blur-md"
                    >
                        <p class="text-[14px]">задание от:</p>
                        <div class="space-x-[15px] flex flex-row items-center">
                            <img
                                src="https://mc-heads.net/avatar/{task_data.owner_nickname}"
                                alt=""
                                width="30"
                            />
                            <p
                                class="  text-[20px]"
                                style="font-family: minecraft_font_ten;"
                            >
                                {task_data.owner_nickname}
                            </p>
                        </div>
                        <p    style="color: {task_status_colors[task_data.status]};">{task_status_names[task_data.status]}</p> 
                    </div>
                    
                    <div
                        class="flex grow flex-col justify-end space-y-2 items-end"
                    >
                        <div
                            class="flex min-w-[200px] w-fit h-fit px-[20px] py-[10px] justify-center items-center gap-[10px] bg_px_round"
                        >
                            <p class="text-[14px]">
                                {task_data.workers.length +
                                    "/" +
                                    task_data.max_workers}
                            </p>
                            {#each task_data.workers as worker, i}
                                {#if i < 4}
                                    <img
                                        src="https://mc-heads.net/avatar/{worker}"
                                        alt=""
                                        width="30"
                                    />
                                {/if}
                            {/each}
                        </div>
                   
                        <div
                            class="w-[410px] relative flex items-center flex-col gap-2"
                        >
                           
                            {#if (task_data.workers.includes($user_data.player_uuid) && !task_data.kick) || isOwner || canManage}
                                <a
                                    href="./{$page.params.id}/chat"
                                    class="w-full h-[60px] p-[15px] flex justify-center items-center bg-orange-900 hover:bg-orange-800 bg-cover bg-center space-x-[10px] active:!shadow-none active:mt-[4px] bg_px_round"
                                >
                                    <p
                                        style="font-family: minecraft_font_ten;"
                                        class="text-[20px]"
                                    >
                                        открыть чат
                                    </p>
                                </a>
                            {/if}
                            {#if isOwner || canManage}
                                <div
                                    class="w-[410px] h-fit relative flex items-center flex-col space-y-2 !mt-1"
                                >
                                    <a
                                        href="./{$page.params.id}/edit"
                                        on:click={onleave_task}
                                        class="w-full h-[60px] p-[10px] flex justify-center items-center bg-gray-300 hover:bg-gray-200 bg-cover bg-center space-x-[10px] active:!shadow-none active:mt-[4px] bg_px_round"
                                    >
                                        <p
                                            style="font-family: minecraft_font_ten;"
                                            class="text-[20px] text-black"
                                        >
                                            редакция
                                        </p>
                                    </a>
                                </div>
                            {/if}
                            {#if isKicked}
                                <p  class="w-[410px] h-[60px] p-[15px] text-center">
                                    {#if task_data.kick.expire_date == "expire_date"}
                                        вы кикнуты до: {formatDate(
                                            new Date(task_data.kick.expire_date)
                                        )}
                                    {:else}
                                        вы кикнуты навсегда.
                                    {/if}
                                </p>
                            {/if}
                            {#if !task_data.workers.includes($user_data.player_uuid) && !isKicked && !isOwner}
                                <div
                                    class="w-[410px] h-fit relative flex items-center flex-col space-y-2 !mt-1"
                                >
                                    <button
                                        on:click={onaccept_task}
                                        class="w-[410px] h-[60px] p-[15px] flex justify-center items-center bg-purple-800 hover:bg-purple-700 bg-cover bg-center space-x-[10px] active:!shadow-none active:mt-[4px] bg_px_round"
                                    >
                                        <p
                                            style="font-family: minecraft_font_ten;"
                                            class="text-[20px]"
                                        >
                                            Взять задачу за
                                        </p>
                                        <div
                                            class="space-x-[5px] flex flex-row"
                                        >
                                            <div
                                                class="h-[30px] flex items-center"
                                            >
                                                <div
                                                    class="w-[20px] h-[20px] bg-white"
                                                />
                                            </div>
                                            <div
                                                class="text-white text-center text-[20px]"
                                                style="font-family: minecraft_font_ten;"
                                            >
                                                {task_data.points}
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            {/if}

                            {#if task_data.workers.includes($user_data.player_uuid)}
                                <div
                                    class="w-[410px] h-fit relative flex items-center flex-col space-y-2 !mt-1"
                                >
                                    <button
                                        on:click={onleave_task}
                                        class="w-full h-[60px] p-[10px] flex justify-center items-center bg-red-800 hover:bg-red-700 bg-cover bg-center space-x-[10px] active:!shadow-none active:mt-[4px] bg_px_round"
                                    >
                                        <p
                                            style="font-family: minecraft_font_ten;"
                                            class="text-[20px]"
                                        >
                                            Покинуть задачу
                                        </p>
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>

                    <!-- <div
                            class="text-[#FFA800] text-[24px]"
                            style="font-family: minecraft_font_ten; text-shadow: -2px 2px 0px #9A2E00;"
                        >
                            выполняется
                        </div> -->
                </div>
                <p class="text-[14px] text-[#6F6F6F] md:w-[260px]">
                    {"создано " + date_to_characters(task_data.createdAt)}
                </p>
                <div>
                    {@html getdesc()}
                </div>
            </div>
        </div>
    </div>
{:else}
    <div
        transition:fly
        class="w-full h-full shrink-0 overflow-auto grow flex justify-center bg-fixed"
    >
        <div
            class="w-full h-full relative max-w-[1024px] space-y-[25px] pb-[100px]"
        >
            <div
                class="w-full h-full md:px-[50px] space-y-[15px] flex flex-col justify-center items-center"
            >
                <div
                    class="h-[45px] w-full bg-cover bg-center relative bg-purple-800"
                >
                    <div
                        class="bg-center bg-contain bg-repeat-x w-full h-full"
                        style="background-size:150px 27px; background-position-x: {x}%; background-image: url(/images/task/task_title.svg);"
                    />
                </div>
                <div
                    class="text-[#FFA800] text-[24px]"
                    style="font-family: minecraft_font_ten; text-shadow: -2px 2px 0px #9A2E00;"
                >
                    {error ? error : "загрузка"}
                </div>
            </div>
        </div>
    </div>
{/if}
