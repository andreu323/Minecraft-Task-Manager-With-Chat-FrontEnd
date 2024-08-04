<script>
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    import {get_task_data,task_data} from "./edit";
    import { onMount } from "svelte";
    var page_name = "";
    var thepath = "";
    $: {
        const str = $page.url.pathname;
        const keyword = "edit";
        const startIndex = str.indexOf(keyword);

        thepath = str.slice(1, startIndex);
        page_name = str.slice(startIndex + keyword.length);
    }
    onMount(async ()=>{
         get_task_data();
    })
</script>

<div class="items-center h-full flex flex-col">
    <div class="w-full h-full max-w-[1024px] flex flex-col ">
        <div class="px-5 py-2 flex flex-row gap-4 items-center">
            <a href="/{thepath}" style="background-image: url(/icons/back_icon.png); image-rendering: pixelated;" class="w-10 h-10 bg-contain" /> 
            <p style="font-family: minecraft_font_ten; font-size: 24px;">Редакция задачи</p>
        </div>
        <div class="h-full w-full flex flex-col  ">
            <div class="shrink-0 w-full h-[55px] flex flex-row">
                <a
                    href="/{thepath}edit"
                    class=" cat_profile {page_name == ''
                        ? '!border-opacity-100'
                        : 'hover:!border-opacity-40 '} transition-all duration-200"
                >
                    страница
                </a>
                <a
                    href="/{thepath}edit/block"
                    class=" cat_profile {page_name == '/block'
                        ? ' !border-opacity-100'
                        : 'hover:!border-opacity-40 '} transition-all duration-200"
                >
                    блокировка
                </a>
            </div>
            <!-- {#key data.url}
                <div
                    class="grow flex flex-col"
                    in:fly={{ x: -200, duration: 500 ,delay:500}}
                    out:fly={{duration: 500 }}
                >
                    <slot />
                </div>
            {/key} -->
            <div
                class="w-full shrink-0 flex justify-center relative overflow-hidden grow"
            >
                <div
                    class=" w-full absolute top-0 left-0 h-full p-[15px] justify-center overflow-auto pb-[120px] scrollbar items-center pt-4"
                >
                    <slot />
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .cat_profile {
        @apply px-5 flex items-center border-b-2 border-white border-opacity-0;
    }
</style>
