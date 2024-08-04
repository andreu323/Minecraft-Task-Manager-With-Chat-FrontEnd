<script>
    import { goto } from "$app/navigation";

    import { user_data, token_data, backend_adress } from "$lib/app";

    import { onMount } from "svelte";
    var progress = false;
 
    async function onSubmit() {
 
        progress = true; 
        const fetch_data = await fetch(backend_adress + "/user_data/add/"+uuid+"?token="+$token_data.access_token).then((res) => {
            return res.text();
        }); 

        goto("/moderation/user_data/" + uuid);
    }
    var uuid = "";
    $: if(uuid != undefined) uuid = uuid.replace("-","");
</script>
<p class="p-4">
    добавление игрока
</p>
<div class="w-full h-full overflow-auto pb-[120px] scrollbar flex flex-col gap-4">
    <input type="text" bind:value={uuid} name="player_uuid" placeholder="uuid игрока" required /> 
    <button
        disabled={progress}
        on:click={onSubmit}
        type="submit"
        class=" bg-gray-300 text-black w-full p-3 bg_px_round"
        style="font-family: minecraft_font_ten; font-size: 20px;"
        >Создать</button
    >
</div>

<style lang="postcss">
    input {
        @apply p-3 text-xl w-full bg-transparent    border-2 border-gray-600 text-[16px]  text-white !outline-none;
    }
</style>
