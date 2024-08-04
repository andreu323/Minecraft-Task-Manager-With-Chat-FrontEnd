<script>
    import { token_data, user_data, backend_adress } from "$lib/app";
    import { onMount } from "svelte";
    import { player, subpage } from "./data";
    var users = [];
    var search = "";
    onMount(async () => {
        users = await fetch(
            backend_adress + "/user_data/get?token=" + $token_data.access_token
        ).then((res) => {
            return res.json();
        });
    });
</script>

<div class="flex flex-col gap-4">
    <p>выберите пользователя</p>
    <input
        type="text"
        name="title"
        required
        maxlength="100"
        bind:value={search}
        placeholder="поиск по нику или uuid"
    /> 
    <div class="w-full flex flex-col gap-6">
        {#each users as user}
            {#if user.player_uuid != $user_data.player_uuid}
                {#if search.length == 0 || user.nickname
                        .toLowerCase()
                        .includes(search.toLowerCase())}
                    <button
                        on:click={() => {
                            $player = user;
                            $subpage = 2;
                        }}
                        class="w-full p-5 bg-white/20 bg_px_round flex flex-row flex-wrap justify-between items-center gap-4"
                    >
                        <div
                            href="new/{user.player_uuid}"
                            class="flex h-full flex-row gap-4 items-center"
                        >
                            <img
                                src={`https://minotar.net/helm/${user.player_uuid}/32.png`}
                            />
                            <p>{user.nickname}</p>
                        </div>
                        <div class="w-full flex flex-wrap gap-2">
                            {#each user.roles as role}
                                <div class="flex flex-row gap-2">
                                    <div class="flex flex-col space-y-5">
                                        <div class="flex gap-2.5">
                                            <div
                                                class="w-fit h-fit py-[10px] px-[20px] text-sm bg_px_round bg-black/60"
                                            >
                                                {role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                        <p>{user.player_uuid}</p>
                    </button>
                {/if}
            {/if}
        {/each}
    </div>
</div>
 