<script>
    import { page } from "$app/stores";
    import BlockDuration from "./block_duration.svelte";
    import { subpage, player,expire_date } from "./data";
    import Done from "./done.svelte";
    import SelectUser from "./select_user.svelte";
    import { beforeNavigate } from "$app/navigation";
    beforeNavigate(()=>{
        $player = undefined;
        $expire_date = undefined;
        $subpage = 1;
    })
</script>

<div class="flex flex-col gap-4">
    {#if $player}
        <div
            href="new/{$player.player_uuid}"
            class="flex h-full flex-row gap-4 items-center"
        >
            <img
                src={`https://minotar.net/helm/${$player.player_uuid}/32.png`}
            />
            <p>{$player.nickname}</p>
        </div>
    {/if}
    {#if $expire_date}
        <div
            href="new/{$player.player_uuid}"
            class="flex h-full flex-row gap-4 items-center"
        >
            <p class="text-gray-500">блокировка до:</p>
            <p>{$expire_date}</p>
        </div>
    {/if}
    <p>
        Этапы Блокировки
    </p>
    <div class="flex flex-row items-center">
        <button
            on:click={() => {
                $subpage = 1;
            }}
            class="bg-pink-700 w-[42px] h-[42px] circle_px_round"
        >
            1
        </button>
        <div
            class=" {$subpage >= 2
                ? 'bg-pink-700'
                : 'bg-pink-950'}  h-[8px] w-[100px]"
        />
        <button
            on:click={() => {
                $subpage = 2;
            }}
            class=" {$subpage >= 2
                ? 'bg-pink-700'
                : 'bg-pink-950'} w-[42px] h-[42px] circle_px_round"
        >
            2
        </button>
        <div
            class=" {$subpage == 3
                ? 'bg-pink-700'
                : 'bg-pink-950'}  h-[8px] w-[100px]"
        />
        <button
            class=" {$subpage == 3
                ? 'bg-pink-700'
                : 'bg-pink-950'} w-[42px] h-[42px] circle_px_round"
        >
            3
        </button>
    </div>
    {#if $subpage == 1}
        <SelectUser />
    {:else if $subpage == 2}
        <BlockDuration />
    {:else}
        <Done/>
    {/if}
    
</div>
