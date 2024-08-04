<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { kick } from "$lib/task_tools";
    import { subpage, player,expire_date } from "./data";
    import { user_data, token_data, backend_adress } from "$lib/app";
    var isBlocked = false;
    onMount(async () => {
        await kick(
            $page.params.id,
            $expire_date ,
            $player.player_uuid
        );
        isBlocked = true;   
    });
</script>

{#if isBlocked}
<p>Пользователь Заблокирован</p>
{:else}
<p class="text-gray-500">Блокируеться...</p>
 
{/if}