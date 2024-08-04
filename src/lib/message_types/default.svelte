<script>
    import DefaultTemplate from "./message_template/default_template.svelte";

    export var message;
    export var task_data;
</script>

<DefaultTemplate {message} {task_data}>
    <div class="flex flex-row items-center gap-3">
        <img
            alt=""
            width="30"
            height="30"
            src="https://mc-heads.net/avatar/{message.player_uuid}"
            class="border-2 {task_data.owner == message.player_uuid
                ? 'border-orange-500'
                : 'border-white '}"
        />
        <p class="text-[16px] min-w-[200px] max-w-[450px] break-words relative">
            {message.nickname}
        </p>
    </div>
    <p class="text-[16px] min-w-[200px] max-w-[450px] break-words relative">
        {message.text}
    </p>
    
</DefaultTemplate>