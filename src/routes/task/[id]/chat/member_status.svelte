<script>
    export var player_uuid;
    export var nickname;
    export var isOnline = false;
</script>

<div class="flex flex-row gap-4 items-end  p-4 w-full bg-zinc-950">
    <div class="relative shrink-0">
        <img width="32" height="32" alt="" src="https://minotar.net/helm/{player_uuid}/32.png" />
        <div class="w-3 h-3 border-4 border-black/40  {isOnline?  "bg-green-600  ": "bg-red-900"} absolute -bottom-1 -right-1" />
    </div>
    <p class="grow line-clamp-1 break-words">
        {nickname}
    </p>
</div>