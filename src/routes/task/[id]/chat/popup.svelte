<script>
    import PointsInput from "./points_input.svelte";
    import { token_data, user_data, backend_adress } from "$lib/app";
    import { popup_callback, popup_data, popup_type } from "$lib/popup_data";
    import { get_task } from "$lib/task_tools";
    import { page } from "$app/stores";
    import { fade, scale } from "svelte/transition";
    import { onMount } from "svelte";
    import DateInput from "$lib/task_components/date_input.svelte";
    async function points_data() {
        popup_data.set(await get_task($page.params.id));
        if (!$popup_data || ($popup_data && $popup_data.workers.length == 0))
            return cancel();

        $popup_data.active = 0;
    }

    async function get_kick_data() {
        popup_data.set({ task_data: await get_task($page.params.id) });

        if (
            !$popup_data ||
            ($popup_data && $popup_data.task_data.workers.length == 0)
        )
            return cancel();
        $popup_data.banDuration = "none";
        $popup_data.active = 0;
    }
    $: {
        if ($popup_type != undefined) {
            if ($popup_type == "give_points") points_data();
            if ($popup_type == "kick") get_kick_data();
        } else $popup_data = undefined;
    }

    function cancel() {
        popup_type.set(undefined);
        popup_callback.set(() => {});
    }

    let constrain = 100;

    function transforms(x, y, el) {
        let box = el.getBoundingClientRect();
        let calcX = -(y - box.y - box.height / 2) / constrain;
        let calcY = (x - box.x - box.width / 2) / constrain;

        return (
            "perspective(100px) " +
            "   rotateX(" +
            calcX +
            "deg) " +
            "   rotateY(" +
            calcY +
            "deg) "
        );
    }

    function transformElement(el, xyEl) {
        el.style.transform = transforms.apply(null, xyEl);
    }
    var card;
    var showup = false;
    $: if ($popup_type == undefined) show_player_list = false;
    $:if(card != undefined){
        card.animate(
            [{
                scale:0
            },
            {
                scale:1
            }],{duration:200}

        )
    }
    onMount(() => {
        
        document.onmousemove = function (e) {
            if (!card) return; 
            let xy = [e.clientX, e.clientY];
            let position = xy.concat([card]);

            window.requestAnimationFrame(function () {
                transformElement(card, position);
            });
        };
    });
    var show_player_list = false;
    function datepicked(e) {
        $popup_data.expire_date = e.detail.datepicked;
    }
 
</script>

{#if $popup_type}
    <div
        class="w-full h-full absolute bg-black/40 backdrop-blur-lg flex justify-center items-center"
    >
        {#if $popup_type == "delete"}
            <div
                class="w-[600px] h-[380px] bg-gray-200 text-black bg_px_round p-4 px-10 flex gap-3 flex-col"
            >
                <p
                    style="font-family: minecraft_font_ten; font-size: 48px;  "
                    class="w-full flex justify-center"
                >
                    Вы уверены что вы хотите удалить задачу?
                </p>
                <div
                    class="w-full grow flex flex-row gap-5 justify-center items-center text-white"
                >
                    <button
                        on:click={cancel}
                        class="w-fit px-20 p-[10px] flex justify-center items-center bg-zinc-800 hover:bg-zinc-900 bg-cover bg-center space-x-[10px] active:!shadow-none active:mt-[4px] bg_px_round"
                    >
                        <p
                            style="font-family: minecraft_font_ten;"
                            class="text-[20px]"
                        >
                            Отменить
                        </p>
                    </button>
                    <button
                        on:click={$popup_callback}
                        class="w-fit px-20 p-[10px] flex justify-center items-center bg-zinc-600 hover:bg-zinc-900 bg-cover bg-center space-x-[10px] active:!shadow-none active:mt-[4px] bg_px_round"
                    >
                        <p
                            style="font-family: minecraft_font_ten;"
                            class="text-[20px]"
                        >
                            Удалить
                        </p>
                    </button>
                </div>
            </div>
        {:else if $popup_type == "give_points" && $popup_data != undefined}
            <div class="flex flex-col items-center">
                <div class="flex flex-col items-center">
                    <img
                        draggable="false"
                        width="140"
                        alt=""
                        src="/images/task/points_cart_part.png"
                        style="image-rendering: pixelated;"
                    />
                    <div
                        class="w-[400px] h-[400px] bg-purple-700 bg_px_round p-4 px-10 flex flex-col items-center relative"
                    >
                        <p
                            style="font-family: minecraft_font_ten; font-size: 48px; "
                            class="w-full flex justify-center items-center"
                        >
                            Баллы
                        </p>
                        <div
                            class="w-full flex flex-col 5 justify-center gap-3"
                        >
                            <p class="w-full flex justify-center">для:</p>
                            <div class="relative">
                                <button
                                    on:click={() => {
                                        show_player_list = !show_player_list;
                                    }}
                                    class="w-full hover:bg-black/50 h-[55px] bg_px_round flex flex-row gap-2 px-6 items-center justify-center"
                                >
                                    <img
                                        alt=""
                                        width="30"
                                        height="30"
                                        src="https://mc-heads.net/avatar/{$popup_data
                                            .workers[$popup_data.active]}"
                                        class="border-2"
                                    />
                                    <p
                                        style="font-size: 18px;  text-shadow: -4px 4px 0px #56148f;"
                                    >
                                        {$popup_data.worker_nicknames[
                                            $popup_data.active
                                        ]}
                                    </p>
                                </button>
                                {#if show_player_list}
                                    <div class="absolute bottom-0 w-full z-10">
                                        <div
                                            class="w-full max-h-[200px] overflow-auto scrollbar absolute top-0 left-0 bg-black/60 backdrop-blur-xl bg_px_round"
                                        >
                                            {#each $popup_data.worker_nicknames as nickname, i}
                                                {#if i != $popup_data.active}
                                                    <button
                                                        on:click={() => {
                                                            $popup_data.active =
                                                                i;
                                                            show_player_list = false;
                                                        }}
                                                        class="w-full h-[55px] hover:bg-white/50 bg_px_round flex flex-row gap-2 px-6 items-center justify-center"
                                                    >
                                                        <img
                                                            alt=""
                                                            width="30"
                                                            height="30"
                                                            src="https://mc-heads.net/avatar/{nickname}"
                                                            class="border-2"
                                                        />
                                                        <p
                                                            style="font-size: 18px;   "
                                                        >
                                                            {nickname}
                                                        </p>
                                                    </button>
                                                {/if}
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                        <div
                            class="w-full grow flex flex-row justify-center mt-20"
                            style="line-height: 78px; font-family: minecraft_font_ten; font-size: 98px;  "
                        >
                            <p
                                class="w-fit"
                                style="text-shadow: -8px 8px 0px #56148f;"
                            >
                                +
                            </p>
                            <PointsInput bind:value={$popup_data.points} />
                        </div>

                        <div
                            style="background-image: url(/images/noise.png);"
                            alt=""
                            class="absolute w-full h-full left-0 top-0 opacity-10 pointer-events-none"
                        />
                    </div>
                </div>
                <div class="w-full grow flex flex-row gap-5 items-end mt-5">
                    <button
                        on:click={cancel}
                        class="flex-1 grow p-[10px] flex justify-center items-center bg-white/20 hover:bg-purple-500/50 bg-cover bg-center space-x-[10px] bg_px_round"
                    >
                        <p
                            style="font-family: minecraft_font_ten;"
                            class="text-[24px]"
                        >
                            Отменить
                        </p>
                    </button>
                    <button
                        on:click={$popup_callback}
                        class="flex-1 grow p-[10px] flex justify-center items-center bg-white/20 hover:bg-purple-500/50 bg-cover bg-center space-x-[10px] bg_px_round"
                    >
                        <p
                            style="font-family: minecraft_font_ten;"
                            class="text-[24px]"
                        >
                            выдать
                        </p>
                    </button>
                </div>
            </div>
        {:else if $popup_type == "points_card" && $popup_data != undefined}
            <div class="flex flex-col items-center select-none">
                
                    <div
                        bind:this={card} 
                        
                        class="flex flex-col items-center"
                    >
                        <img
                            draggable="false"
                            width="140"
                            alt=""
                            src="/images/task/points_cart_part.png"
                            style="image-rendering: pixelated;"
                        />
                        <div
                            class="w-[400px] h-[400px] bg-purple-700 bg_px_round p-4 px-10 flex flex-col items-center relative"
                        >
                            <p
                                style="font-family: minecraft_font_ten; font-size: 48px; "
                                class="w-full flex justify-center items-center"
                            >
                                Баллы
                            </p>
                            <div
                                class="w-full flex flex-col 5 justify-center gap-3"
                            >
                                <p class="w-full flex justify-center">для:</p>

                                <button
                                    class="w-full h-[55px] bg_px_round flex flex-row gap-2 px-6 items-center justify-center"
                                >
                                    <img
                                        alt=""
                                        width="30"
                                        height="30"
                                        src="https://mc-heads.net/avatar/{$popup_data.nickname}"
                                        class="border-2"
                                    />
                                    <p
                                        style="font-size: 18px;  text-shadow: -4px 4px 0px #56148f;"
                                    >
                                        {$popup_data.nickname}
                                    </p>
                                </button>
                            </div>
                            <div
                                class="w-full grow flex flex-row justify-center mt-20"
                                style="line-height: 78px; font-family: minecraft_font_ten; font-size: 98px;  "
                            >
                                <p
                                    class="w-fit"
                                    style="text-shadow: -8px 8px 0px #56148f;"
                                >
                                    {"+" + $popup_data.count}
                                </p>
                            </div>

                            <div
                                style="background-image: url(/images/noise.png);"
                                alt=""
                                class="absolute w-full h-full left-0 top-0 opacity-10 pointer-events-none"
                            />
                        </div>
                    </div>
              
                <button
                    on:click={cancel}
                    class="flex-1 grow mt-5 px-[50px] p-[10px] flex justify-center items-center bg-white/50 backdrop-blur-xl hover:bg-purple-500/50 bg-cover bg-center space-x-[10px] bg_px_round"
                >
                    <p
                        style="font-family: minecraft_font_ten;"
                        class="text-[24px]"
                    >
                        закрыть
                    </p>
                </button>
            </div>
        {:else if $popup_type == "kick" && $popup_data != undefined}
            <div class="flex flex-col items-center">
                <div class="flex flex-col items-center">
                    <div
                        class="w-[600px] text-black p-4 px-10 flex flex-col items-center relative"
                    >
                        <div
                            class=" absolute bg_px_round bg-gray-200 w-full h-full"
                        />
                        <p
                            style="font-family: minecraft_font_ten; font-size: 48px; "
                            class="w-full flex justify-center items-center relative"
                        >
                            Кикнуть Игрока
                        </p>
                        <div
                            class="w-[300px] flex flex-col 5 justify-center gap-3"
                        >
                            <div class="relative">
                                <button
                                    on:click={() => {
                                        show_player_list = !show_player_list;
                                    }}
                                    class="w-full hover:bg-black/50 h-[55px] bg_px_round flex flex-row gap-2 px-6 items-center justify-center"
                                >
                                    <img
                                        alt=""
                                        width="30"
                                        height="30"
                                        src="https://mc-heads.net/avatar/{$popup_data
                                            .task_data.workers[
                                            $popup_data.active
                                        ]}"
                                        class="border-2"
                                    />
                                    <p style="font-size: 18px;   ">
                                        {$popup_data.task_data.worker_nicknames[
                                            $popup_data.active
                                        ]}
                                    </p>
                                </button>
                                {#if show_player_list}
                                    <div
                                        class="absolute bottom-0 w-full z-10 text-white"
                                    >
                                        <div
                                            class="w-full max-h-[200px] overflow-auto scrollbar absolute top-0 left-0 bg-black/60 backdrop-blur-xl bg_px_round"
                                        >
                                            {#each $popup_data.task_data.worker_nicknames as nickname, i}
                                                {#if i != $popup_data.active}
                                                    <button
                                                        on:click={() => {
                                                            $popup_data.active =
                                                                i;
                                                            show_player_list = false;
                                                        }}
                                                        class="w-full h-[55px] hover:bg-white/50 bg_px_round flex flex-row gap-2 px-6 items-center justify-center"
                                                    >
                                                        <img
                                                            alt=""
                                                            width="30"
                                                            height="30"
                                                            src="https://mc-heads.net/avatar/{nickname}"
                                                            class="border-2"
                                                        />
                                                        <p
                                                            style="font-size: 18px;   "
                                                        >
                                                            {nickname}
                                                        </p>
                                                    </button>
                                                {/if}
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                        <br />
                        <div
                            class="w-[400px] flex flex-col 5 justify-center gap-3"
                        >
                            <p class="w-full flex justify-center relative">
                                Блокировка:
                            </p>
                            <div
                                class="relative text-black flex flex-col gap-3"
                            >
                                <div class="flex flex-row gap-2">
                                    <input
                                        bind:group={ $popup_data.banDuration}
                                        type="radio"
                                        id="none"
                                        name="block_type"
                                        value="none"
                                        checked
                                    />
                                    <label for="none">Без Блокировки</label>
                                </div>
                                <div class="flex flex-row gap-2">
                                    <input
                                        bind:group={$popup_data.banDuration}
                                        type="radio"
                                        id="expire_date"
                                        name="block_type"
                                        value="expire_date"
                                    />
                                    <label for="expire_date"
                                        >Определенная дата</label
                                    >
                                </div>
                                {#if $popup_data.banDuration == "expire_date"}
                                    <DateInput on:datepicked={datepicked} />
                                {/if}
                                <div class="flex flex-row gap-2">
                                    <input
                                        bind:group={$popup_data.banDuration}
                                        type="radio"
                                        id="forever"
                                        name="block_type"
                                        value="forever"
                                    />
                                    <label for="forever">Навсегда</label>
                                </div>
                            </div>
                        </div>
                        <div
                            class="w-full grow flex flex-row gap-5 items-end mt-5 text-white"
                        >
                            <button
                                on:click={cancel}
                                class="flex-1 grow p-[10px] flex justify-center items-center bg-black hover:bg-black/50 bg-cover bg-center space-x-[10px] bg_px_round"
                            >
                                <p
                                    style="font-family: minecraft_font_ten;"
                                    class="text-[24px]"
                                >
                                    Отменить
                                </p>
                            </button>
                            <button
                                on:click={$popup_callback}
                                class="flex-1 grow p-[10px] flex justify-center items-center bg-black hover:bg-black/50 bg-cover bg-center space-x-[10px] bg_px_round"
                            >
                                <p
                                    style="font-family: minecraft_font_ten;"
                                    class="text-[24px]"
                                >
                                    выдать
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/if}
