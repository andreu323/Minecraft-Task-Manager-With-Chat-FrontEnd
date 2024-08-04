<script>
    import { token_data, user_data, backend_adress } from "$lib/app";
    import { onMount } from "svelte";
    import { user } from "./data";
    import { page } from "$app/stores";
    var all_roles = [];
    onMount(async () => {
        all_roles = await fetch(
            backend_adress +
                "/user_data/roles/get?token=" +
                $token_data.access_token
        ).then((res) => {
            return res.json();
        });
    });
    var show_roles = false;
</script>

<div class="relative">
    {#if show_roles}
        <div
            class="absolute -bottom-2 flex flex-col w-full h-0 overflow-visible z-10"
        >
            <div
                class="  bg-zinc-600/40 w-[300px] backdrop-blur-xl max-h-[200px] shrink-0 bg_px_round p-4 flex flex-col gap-3 overflow-auto scrollbar-light"
            >
                {#each Object.keys(all_roles) as role}
                    {#if !$user.roles.includes(role)}
                        <button
                            on:click={async () => {
                                $user.roles.push(role);
                                $user.roles = [...$user.roles]; 
                                show_roles = false; 
 
                            }}
                            class="bg-zinc-950/40 py-4 flex justify-center items-center w-full bg_px_round"
                        >
                            {role}
                        </button>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}
    <button
        on:click={() => {
            show_roles = !show_roles;
        }}
        class="flex flex-col items-center justify-center relative"
    >
        <div class="flex gap-2.5">
            <div
                class="w-fit h-fit py-[10px] px-[20px] text-sm bg_px_round bg-purple-800/60"
            >
                добавить роль
            </div>
        </div>
    </button>
</div>
