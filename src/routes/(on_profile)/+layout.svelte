<script>
    import { page } from "$app/stores";
    import { fly } from "svelte/transition";
    var page_name = "";
    var category = "";
    $: {
        page_name = $page.url.pathname;
        category = $page.url.searchParams.get("category");
    } 
</script>

<div class="items-center h-full flex flex-col">
    <!-- <div class="max-w-[1024px] w-full    flex items-center bg-blue-600 p-6">
        <p >С добрым утром!!!</p>
    </div> -->
    <div class="max-w-[1024px] h-full w-full flex flex-col">
        <div class="shrink-0 w-full h-[55px] flex flex-row">
            <a
                href="/?category=take"
                class=" cat_profile {category == 'take'
                    ? ' !border-opacity-100'
                    : 'hover:!border-opacity-40 '} transition-all duration-200"
            >
                взять
            </a>
            <a
                href="/"
                class=" cat_profile {category == null && page_name == '/'
                    ? '!border-opacity-100'
                    : 'hover:!border-opacity-40 '} transition-all duration-200"
            >
                активные
            </a>
            <a
                href="/?category=forme"
                class=" cat_profile {category == 'forme'
                    ? ' !border-opacity-100'
                    : 'hover:!border-opacity-40 '} transition-all duration-200"
            >
                выполняю
            </a>
            <a
                href="/?category=own"
                class=" cat_profile {category == 'own'
                    ? ' !border-opacity-100'
                    : 'hover:!border-opacity-40 '} transition-all duration-200"
            >
                созданные
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
        <slot />
    </div>
</div>

<style>
    .cat_profile {
        @apply px-5 flex items-center border-b-2 border-white border-opacity-0;
    }
</style>
