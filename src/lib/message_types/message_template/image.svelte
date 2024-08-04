<script>
    export var image_path = ""; 
    export var index = 0;
    export var isLocal = false;
    export var original_aspect = false;
    var format = "";
    import {
        token_data,
        user_data,
        backend_adress,
        site_adress,
        target_image,
    } from "$lib/app";
    if (!isLocal) format = ".png";
    export var images; 
    export var full_path = [];  
    for (let index = 0; index < images.length; index++) {
        const image = images[index];
        full_path[index] = image_path + image ; 
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
 
<img
    on:click={() => {
        $target_image = {full_path,index};
    }}
    draggable="false"
    alt=""
    class="  {original_aspect
        ? 'h-[300px]'
        : 'w-full h-full absolute'} object-cover cursor-pointer"
    src={full_path[index] + format}
/>
