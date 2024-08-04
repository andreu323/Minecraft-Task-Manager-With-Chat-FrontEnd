<script>
    import { fade,fly } from "svelte/transition";
    import { goto } from '$app/navigation';
    var height = 0;
    export var canManage = false;
    export var isWorker = false;

    export var ondelete = () => {};
    export var ongivepoints = () => {};
    export var onkick = () => {};
    export var onleave = () => {};
    export var onedit = () => {goto("edit")};
</script>

<div
    bind:clientHeight={height}
    transition:fly={{y:-10,duration:100}}
    
    id="tools"
    class="w-[240px] h-fit bg-zinc-700 absolute right-5 z-10 flex flex-col bg_px_round"
    style="bottom: {-height-10}px;"
>
    {#if canManage}
        <button on:click={ondelete}>удалить задачу</button>
        <button on:click={onkick}>кикнуть участника</button>
        <button on:click={ongivepoints}>выдать баллы</button>
        <button on:click={onedit}>редакция</button>
    {/if}
    {#if isWorker}
        <button on:click={onleave}>покинуть задачу</button>
    {/if}
</div>

<style lang="postcss">
    #tools > button {
        @apply p-2 hover:bg-black/10;
    }
</style>
