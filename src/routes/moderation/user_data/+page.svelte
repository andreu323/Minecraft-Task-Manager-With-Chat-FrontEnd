<script>
    import { onMount } from "svelte";
    import { token_data, user_data, backend_adress } from "$lib/app";
    var users = [];
    onMount(async () => {
        users = await fetch(
            backend_adress + "/user_data/get?token=" + $token_data.access_token
        ).then((res) => {
            return res.json();
        });
    });
    var search = "";
</script>
<p class="p-4">
    Модерация Пользовательских данных
</p>
<div class="p-2 flex flex-col gap-4">
    <input
        type="text"
        name="title"
        required
        maxlength="100"
        bind:value={search}
        placeholder="поиск по нику или uuid"
    />
    <div class="w-full flex flex-wrap gap-4">
        <a
            href="./user_data/new"
            class="w-[300px] p-5 bg-white/40 bg_px_round flex flex-col flex-wrap gap-4 items-center justify-center"
        >
            добавить игрока
        </a>
        {#each users as user}
            {#if search.length == 0 || user.nickname
                    .toLowerCase()
                    .includes(search.toLowerCase())}
                <a
                    href="./user_data/{user.player_uuid}"
                    class="w-[300px] p-5 bg-white/20 bg_px_round flex flex-col flex-wrap gap-4"
                >
                    <div class="flex flex-row gap-4 items-center">
                        <img
                            src={`https://minotar.net/helm/${user.player_uuid}/32.png`}
                        />
                        <p>{user.nickname}</p>
                    </div>
                    <p
                        class="flex-1 text-[16px]"
                        style="font-family: minecraft_font_ten;"
                    >
                        {user.points}
                    </p>
                    <div class="w-full flex flex-wrap gap-2">
                        {#each user.roles as role, i}
                            {#if i < 3}
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
                            {/if}
                        {/each}
                        {#if user.roles.length > 3}
                            <div class="flex flex-row gap-2">
                                <div class="flex flex-col space-y-5">
                                    <div class="flex gap-2.5">
                                        <div
                                            class="w-fit h-fit py-[10px] px-[20px] text-sm bg_px_round bg-black/60"
                                        >
                                            +{user.roles.length - 3}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    </div>
                </a>
            {/if}
        {/each}
    </div>
</div>
