<script>
    import { token_data,   target_image, user_data, backend_adress } from "$lib/app";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { beforeNavigate } from "$app/navigation";

    import { socket, task_connection } from "$lib/chat_service";
    import { clear_popup_data } from "$lib/popup_data";
    import "../style.css";
    var page_name = "";
    $: {
        page_name = $page.url.pathname;
    }
    const url = $page.url;

    onMount(async () => {
     
        if (url.searchParams.get("code") != undefined) {
            console.log("test")
            const token_data_fetch = await fetch(
                backend_adress + "/login?code=" + url.searchParams.get("code"),
            ).then((response) => {
                return response.json();
            });

            token_data.set(token_data_fetch);

            goto("/");
        }
    });
    beforeNavigate(() => {
        if ($socket != undefined) {
            $socket.disconnect();
            clear_popup_data();
        }
    });
</script>

<div class="w-full h-screen flex flex-col">
    <div class="w-full  h-[50px] flex justify-center">
        <div
            class="   h-full flex flex-row items-center relative gap-2"
            style="font-family:minecraft_font_ten ; "
        >
            

            {#if $user_data != undefined}
                <a
                    class="px-5 flex flex-row space-x-[15px]
            {page_name == "/"
                        ? ' opacity-80'
                        : 'hover:opacity-80 opacity-40  '}
            "
                    href={"/"}
                >
                    <div
                        class="grow overflow-hidden flex flex-row justify-center items-center items-center space-x-[5px]"
                    >
                        <div class="shrink-0 w-[16px] h-[16px] bg-white" />
                        <p
                            class="flex-1 text-[16px]"
                            style="font-family: minecraft_font_ten;"
                        >
                            {$user_data.points}
                        </p>
                    </div>

                    <img
                        width="30"
                        height="30"
                        style=" border: 2px solid rgba(255, 255, 255, 1); "
                        src="https://mc-heads.net/avatar/{$user_data.nickname}"
                        alt="мой кабинет"
                    />
                </a>
                {#if $user_data.permissions.includes("*") ||  $user_data.permissions.includes("citizens_manage") }
                    <a
                        class="{page_name == '/moderation'
                            ? ' '
                            : 'hover:opacity-80 opacity-40 '} hover:opacity-100 text-[20px]"
                        href="/moderation"
                    >
                        модерация
                    </a>
                {/if}
            {:else}
                <a
                    class="hover:opacity-80 opacity-40 bt text-orange-300 !text-[24px]"
                    href="{backend_adress}/login"
                >
                    войти
                </a>
            {/if}
        </div>
    </div>
  
    <div id="content" class="overflow-auto grow flex relative flex-col">
        <slot />
    </div>
    {#if $target_image}
        <div
            class="absolute w-full h-full bg-black/40 backdrop-blur-lg z-30 flex flex-col items-center justify-center p-20"
        >
            <div class="w-full max-w-[1024px] h-full flex flex-col">
                <div class=" w-full flex-1 grow relative">
                    <div>
                        <img
                            src={$target_image.full_path[$target_image.index] +
                                ".png"}
                            alt=""
                            class=" absolute top-0 left-0 w-full h-full object-contain"
                        />
                    </div>
                    <button
                        type="button"
                        on:click={() => {
                            $target_image = undefined;
                        }}
                        class="w-10 h-10 absolute top-2 right-2 bg-contain"
                        style="background-image: url(/images/close_icon.png); image-rendering: pixelated;"
                    />
                </div>
                <div
                    class="p-[10px] shrink-0 h-[100px] w-full bg-gray-700/40 backdrop-blur-[100px] space-x-[10px] flex flex-row overflow-x-auto relative items-center"
                >
                    {#each $target_image.full_path as image_path, i}
                        <div
                            class="shrink-0 h-full aspect-video relative group"
                        >
                            <img
                                alt=""
                                on:click={() => {
                                    $target_image.index = i;
                                }}
                                src={image_path + "-low.png"}
                                loading="lazy"
                                draggable="false"
                                class="w-full h-full object-cover relative group-hover:opacity-75 cursor-pointer border-4 {$target_image.index ==
                                i
                                    ? '  border-white'
                                    : 'border-transparent'}"
                            />
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        @apply bg-gray-950;
    }
    .bt {
        @apply h-full w-[140px]  flex items-center justify-center text-[20px]  transition-[font-size]   transition-all;
    }
    .bt > * {
        @apply pointer-events-none select-none;
    }
</style>
