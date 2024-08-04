<script>
    import { token_data, user_data, backend_adress } from "$lib/app";
    import Image from "./image.svelte";
    export var message;
    export var task_data;
    export var images = [];
    export var isLocal = true;
    var path = "";

    if (!isLocal) {
        path =
            backend_adress +
            "/assets/images/task/" +
            task_data.id +
            "/message/" +
            message.uuid +
            "/";
    }
    // backend_adress +
    //             "/assets/images/task/" +
    //             task_data.id +
    //             "/message/" +
    //             message.uuid +
    //             "/" +
    //             message.images[0] +
    //             ".png"
</script>

{#if images.length == 1}
    <div class="bg_px_round">
        <Image
            original_aspect={true}
            image_path={path}
            images={[...images]} 
            {isLocal}
        />
    </div>
{:else if images.length == 2}
    <div class="w-[400px] flex flex-row aspect-square bg_px_round gap-2">
        <div class="grow relative">
            <Image image_path={path} images={[...images]} {isLocal} />
        </div>
        <div class="grow relative">
            <Image image_path={path} images={[...images]} index={1} {isLocal} />
        </div>
    </div>
{:else if images.length >= 3}
    <div
        class="w-[400px] flex flex-col aspect-square bg_px_round gap-2 justify-center items-center"
    >
        <div class="flex flex-row grow gap-2 w-full">
            <div class="grow relative">
                <Image image_path={path} images={[...images]} {isLocal} />
            </div>
            <div class="grow relative">
                <Image image_path={path} images={[...images]} index={1} {isLocal} />
            </div>
        </div>
        {#if images.length > 4}
            <div class="bg_px_round bg-zinc-950 absolute p-5 z-10 text-xl">
                {images.length - 4}+
            </div>
        {/if}
        <div class="flex flex-row grow gap-2 w-full">
            <div class="grow relative">
                <Image image_path={path} images={[...images]} index={2} {isLocal} />
            </div>
            {#if images.length >= 4}
                <div class="grow relative">
                    <Image image_path={path} images={[...images]} index={3} {isLocal} />
                </div>
            {/if}
        </div>
    </div>
{/if}
