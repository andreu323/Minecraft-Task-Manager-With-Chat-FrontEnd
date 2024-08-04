<script>
    var kicked_users = {};
    import { user_data, token_data, backend_adress } from "$lib/app";
    import { page } from "$app/stores";

    import { formatDate } from "$lib/date";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    async function get_kicked_users() {
        kicked_users = await fetch(
            backend_adress +
                "/task/block/list/get/" +
                $page.params.id +
                "?token=" +
                $token_data.access_token
        ).then((response) => {
            return response.json();
        });
        $kicked_users_uuid = Object.keys(kicked_users);
    }
    onMount(() => {
        get_kicked_users();
    });
    async function unblock(player_uuid) {
        await fetch(
            backend_adress +
                "/task/unblock/" +
                $page.params.id +
                "/" +
                player_uuid +
                "?token=" +
                $token_data.access_token
        );
        delete kicked_users[player_uuid];
        $kicked_users_uuid = Object.keys(kicked_users);
    }
    var kicked_users_uuid = writable([]);
</script>

<div class="flex flex-col gap-2">
    <a
        href="block/new"
        class="w-full block p-5 bg-pink-600/20 hover:bg-pink-600/40 bg_px_round"
    >
        <p>заблокировать</p>
    </a>
    {#each $kicked_users_uuid as player_uuid}
        {#if kicked_users[player_uuid].expire_date == "forever" ||new Date(kicked_users[player_uuid].expire_date) > new Date() }
        <div
        class="w-full p-4 px-10 bg-red-600/20 bg_px_round flex flex-row justify-between items-center"
    >
        <div class="flex flex-row items-center gap-4">
            <img src={`https://minotar.net/helm/${player_uuid}/32.png`} />
            <p>
                {kicked_users[player_uuid].nickname}
            </p>
        </div>
        <p>
            {kicked_users[player_uuid].expire_date == "forever" ? "Навсегда" : formatDate(new Date(kicked_users[player_uuid].expire_date))}
        </p>
        <button
            on:click={() => {
                unblock(player_uuid);
            }}
            class="w-7 h-7 opacity-60 hover:opacity-100 bg-contain"
            style="background-image: url(/images/close_icon.png); image-rendering: pixelated;"
        />
    </div>
        {/if}
    {/each}
</div>
