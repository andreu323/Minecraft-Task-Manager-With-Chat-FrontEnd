<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    import {
        token_data,
        user_data,
        backend_adress,
        site_adress,
    } from "$lib/app";
    import { beforeNavigate } from "$app/navigation";
    import AddRole from "./add_role.svelte";
    import { user } from "./data";
    import { edit_user, remove_user } from "$lib/user_tools";
    import { date_to_characters } from "$lib/date";
    onMount(async () => {
        $user = await fetch(
            backend_adress +
                "/user_data/get/" +
                $page.params.id +
                "?token=" +
                $token_data.access_token
        ).then((res) => {
            return res.json();
        });
    });
    beforeNavigate(() => {
        $user = undefined;
    });
    var progress = false;
    async function update() {
        progress = true;
        await edit_user(
            { points: $user.points, roles: $user.roles },
            $user.player_uuid
        );
        progress = false;
    }

    var remove_progress = false;
    async function remove() {
        if (!confirm("Вы уверены что хотите удалить данного игрока?")) return;
        remove_progress = true;
        await remove_user($user.player_uuid);
        goto("/moderation/user_data");
    }
</script>
<p class="p-4">
    Модерация Игрока { $page.params.id }
</p>
 
{#if $user}
    <div class="flex flex-col gap-6 p-4 w-full">
        <div class="flex flex-col gap-10 p-4">
            <div class="flex flex-col gap-4">
                <div class="flex flex-row gap-4 items-center flex-wrap w-full ">
                    <img
                        src={`https://minotar.net/helm/${$user.player_uuid}/32.png`}
                    />
                    <p>{$user.nickname}</p>

                    <p class="text-zinc-500 break-words grow max-w-full">{$user.player_uuid}</p>
                </div>
                <div class="flex flex-col gap-2">
                    <p>Очки:</p>
                    <input
                        type="number"
                        name="points"
                        bind:value={$user.points}
                        required
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <p>Роли:</p>
                    <div class="w-full flex flex-wrap gap-2">
                        {#each $user.roles as role, i}
                            <div class="flex flex-col space-y-5">
                                <div class="flex gap-2.5">
                                    <div
                                        class="w-fit h-fit py-[10px] px-[20px] text-sm bg_px_round bg-purple-950/60 flex flex-row gap-2 items-center"
                                    >
                                        <p>
                                            {role}
                                        </p>
                                        <button
                                            type="button"
                                            on:click={async () => {
                                                $user.roles.splice(i, 1);
                                                $user.roles = [...$user.roles];
                                            }}
                                            class="w-4 h-4 bg-contain"
                                            style="background-image: url(/images/close_icon.png); image-rendering: pixelated;"
                                        />
                                    </div>
                                </div>
                            </div>
                        {/each}
                        <AddRole />
                    </div>
                </div>
                <button
                    type="submit"
                    on:click={update}
                    disabled={progress || remove_progress}
                    class="    w-full p-3 bg_px_round {progress
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-black'}"
                    style="font-family: minecraft_font_ten; font-size: 20px;"
                    >{progress ? "Обновляем" : "Изменить"}</button
                >
                <button
                    type="button"
                    on:click={remove}
                    disabled={progress || remove_progress}
                    class="    w-full p-3 bg_px_round {remove_progress
                        ? 'bg-red-300 text-white'
                        : 'bg-red-950 text-white'}"
                    style="font-family: minecraft_font_ten; font-size: 20px;"
                    >{remove_progress ? "Удаляем" : "Удалить"}</button
                >
            </div>
            <div class="flex flex-col gap-2">
                статистика:
                <div class="flex flex-row gap-4">
                    <div
                        class="bg_px_round bg-pink-950 w-[500px] h-[300px] flex flex-col p-4 gap-4"
                    >
                        <p>Награды:</p>
                        <div
                            class="flex flex-col gap-2 overflow-auto scrollbar-light"
                        >
                            {#each $user.rewards as reward}
                                <div
                                    class="flex flex-col flex-wrap gap-4 p-4 bg-black/20 bg_px_round"
                                >
                                    <div
                                        class=" flex flex-row gap-2 items-center"
                                    >
                                        от:
                                        <img
                                            src={`https://minotar.net/helm/${reward.from}/32.png`}
                                        />
                                        {reward.from_nickname}
                                    </div>
                                    <p>
                                        {reward.count} балла
                                    </p>
                                    <p>
                                        выданно: {date_to_characters(
                                            reward.createdAt
                                        )}
                                    </p>
                                    <a
                                        href="{site_adress}/profile/task/{reward.reason}"
                                        class="text-gray-300"
                                    >
                                        айди задачи:
                                        {reward.reason}
                                    </a>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div
                        class="bg_px_round bg-green-950 w-[500px] h-[300px] flex flex-col p-4 gap-4"
                    >
                        <p>Последние активы:</p>
                        <div
                            class="flex flex-col gap-2 overflow-auto scrollbar-light"
                        >
                            {#each $user.last_active as task}
                                <div
                                    class="flex flex-col flex-wrap gap-4 p-4 bg-black/20 bg_px_round"
                                >
                                    <p>
                                        "{task.title}"
                                    </p>
                                    <p>
                                        {date_to_characters(
                                            task.last_active[$user.player_uuid]
                                        )}
                                    </p>

                                    <a
                                        href="{site_adress}/profile/task/{task.id}"
                                        class="text-gray-300"
                                    >
                                        айди задачи:
                                        {task.id}
                                    </a>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
                основатель:
                <div class="flex flex-row gap-4">
                    <div
                        class="bg_px_round bg-red-950 w-[500px] h-[300px] flex flex-col p-4 gap-4"
                    >
                        <p>Выдал Награды:</p>
                        <div
                            class="flex flex-col gap-2 overflow-auto scrollbar-light"
                        >
                            {#each $user.own_rewards as reward}
                                <div
                                    class="flex flex-col flex-wrap gap-4 p-4 bg-black/20 bg_px_round"
                                >
                                    <div
                                        class=" flex flex-row gap-2 items-center"
                                    >
                                        для:
                                        <img
                                            src={`https://minotar.net/helm/${reward.player_uuid}/32.png`}
                                        />
                                        {reward.nickname}
                                    </div>
                                    <p>
                                        {reward.count} балла
                                    </p>
                                    <p>
                                        выданно: {date_to_characters(
                                            reward.createdAt
                                        )}
                                    </p>
                                    <a
                                        href="{site_adress}/profile/task/{reward.reason}"
                                        class="text-gray-300"
                                    >
                                        айди задачи:
                                        {reward.reason}
                                    </a>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <div
                        class="bg_px_round bg-lime-950 w-[500px] h-[300px] flex flex-col p-4 gap-4"
                    >
                        <p>Владеет задачами:</p>
                        <div
                            class="flex flex-col gap-2 overflow-auto scrollbar-light"
                        >
                            {#each $user.owner_of as task}
                                <div
                                    class="flex flex-col flex-wrap gap-4 p-4 bg-black/20 bg_px_round"
                                >
                                    <p>
                                        "{task.title}"
                                    </p>
                                    <p>
                                        созданно: {date_to_characters(
                                            task.createdAt
                                        )}
                                    </p>
                                    <p>
                                        баллы: {task.points}
                                    </p>
                                    <a
                                        href="{site_adress}/profile/task/{task.id}"
                                        class="text-gray-300"
                                    >
                                        айди задачи:
                                        {task.id}
                                    </a>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
