<script>
    import Task from "$lib/task_components/task.svelte";
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import { token_data, user_data, backend_adress } from "$lib/app";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    // export var title = "Построй свой собственный замок из кубиков и защити его от монстров";
    // export var image = "/images/verden_task_screenshot.png";
    // export var category = "forme";
    // export var points = 200;
    // export var player_max_count = 99;
    // export var player_count = 50;
    var tasks = [];
    var page_name = "";
    var category;
    var error = undefined;
    function fetch_tasks() {
        if (!browser || !$token_data) return;
        tasks = [];
        fetch(backend_adress + "/tasks?token=" + $token_data.access_token)
            .then((response) => {
                if (response.status != 200) return response.status;
                return response.json();
            })
            .then((fetch_tasks) => {
                if ("number" != typeof fetch_tasks) {
                    for (let index = 0; index < fetch_tasks.length; index++) {
                        const task = fetch_tasks[index];
                        var task_category = "take";
                        if (task.owner == $user_data.player_uuid)
                            task_category = "own";
                        else if (task.workers.includes($user_data.player_uuid))
                            task_category = "forme";
                        tasks.push({ ...task, category: task_category });
                    }
                    tasks.sort(function (a, b) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });

                    const customOrder = [2, 0, 1, 3]; // Define the custom order of statuses

                    tasks.sort(
                        (a, b) =>
                            customOrder.indexOf(a.status) -
                            customOrder.indexOf(b.status),
                    );

                    if (category == null)
                        tasks.sort(function (a, b) {
                            if (!a.last_active) return 1;
                            if (!b.last_active) return -1;

                            return (
                                new Date(b.last_active) -
                                new Date(a.last_active)
                            );
                        });

                    if (category == null)
                        tasks.sort(function (a, b) {
                            if (!a.notify) return 1;
                            if (!b.notify) return -1;
                            return b.notify.count - a.notify.count;
                        });
                    tasks = [...tasks];
                } else {
                    error = fetch_tasks;
                    console.log(error);
                }
            });
    }
    $: category, fetch_tasks();
    $: {
        page_name = $page.url.pathname;

        category = $page.url.searchParams.get("category");
        if ($user_data != undefined)
            can_create =
                $user_data.permissions.includes("*") ||
                $user_data.permissions.includes("task_create") ||
                $user_data.permissions.includes("task_manager");
    }

    var can_create = false;
</script>

{#if !$token_data}
    <div
        class="w-full shrink-0 flex justify-center items-center relative overflow-hidden grow"
    >
        <p>u should login first.</p>
    </div>
{:else if error == undefined}
    <div
        class="w-full shrink-0 flex justify-center relative overflow-hidden grow"
    >
        {#key category}
            <div
                class=" w-full absolute h-full p-[15px] justify-center overflow-auto pb-[120px] scrollbar items-center"
                in:fly={{ x: -200, duration: 500, delay: 500 }}
                out:fly={{ x: 200, duration: 500 }}
            >
                <div class=" space-y-3 w-full">
                    {#if category == "own" && can_create}
                        <a
                            href="/create/task"
                            class=" 
                transition-colors
            p-6 text-black
            w-full flex relative bg_px_round group"
                        >
                            <div
                                style="background-image: url(/images/gradients/purple.png);"
                                class="absolute top-0 left-0 w-full h-full opacity-40 group-hover:opacity-100 bg-cover bg-center transition-opacity"
                            />
                            <p
                                class="text-[24px] grow h-full line-clamp-2 relative"
                                style="font-family: minecraft_font_ten;   "
                            >
                                создать задание
                            </p>
                        </a>
                    {/if}

                    {#each tasks as task}
                        {#if category == task.category || (category == null && task.category != "take")}
                            {#key category}
                                <Task
                                    show_category_tag={category == null}
                                    task_data={task}
                                />
                            {/key}
                        {/if}
                    {/each}
                </div>
            </div>
        {/key}
    </div>
{:else}
    <div
        class="w-full shrink-0 flex justify-center items-center relative overflow-hidden grow"
    >
        <p>вы не имеете личных прав.</p>
    </div>
{/if}
