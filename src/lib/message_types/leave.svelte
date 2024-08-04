<script>
    import DefaultTemplate from "./message_template/default_template.svelte";

    export var message;
    export var task_data;
</script>

<DefaultTemplate {message} {task_data} message_color="#270018">
    <p class="text-[16px] min-w-[200px] max-w-[450px] break-words relative">
        {message.widget.nickname} покинул задание.
    </p>
    <div
        class="flex px-[20px] py-[10px] items-center space-x-[10px] bg-black/25 bg_px_round relative"
    >
        <p class="text-[14px] self-stretch justify-center flex items-center">
            {message.widget.workers.length + "/" + message.widget.max_workers}
        </p>
        <div class="flex flex-row px-[5px] grow space-x-[10px]">
            {#each message.widget.workers as worker, i}
                {#if i < 4}
                    <img
                        src="https://mc-heads.net/avatar/{worker}"
                        alt=""
                        width="24"
                    />
                {/if}
            {/each}
        </div>
    </div>
</DefaultTemplate>
