<script>
    import {
        socket,
        input_chat,
        onSendMessage,
        task_connection,
        send_message,
        reply_message,
        scroll_chat,
        targetmessage,
        cooldown_manager,
        reply_type,
        messages,
        can_auto_scroll,
    } from "$lib/chat_service";
    import { token_data, user_data, backend_adress } from "$lib/app";
    import { beforeNavigate } from "$app/navigation";
    import { popup_callback, popup_data, popup_type } from "$lib/popup_data";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Message from "./message.svelte";
    import Tools from "./tools.svelte";
    import { goto } from "$app/navigation";

    import {
        accept_task,
        give_points,
        kick,
        leave_task,
        delete_task,
    } from "$lib/task_tools";
    import BgGradient from "./bg_gradient.svelte";
    import Popup from "./popup.svelte";
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";
    import MemberStatus from "./member_status.svelte";
    var task_data = undefined;
    var users_in_task = undefined;
    var isOwner = false;
    var canManage = false;
    var isWorker = false;

    var showtools = false;

    const scroll = (node, behavior) => {
        node.scroll({
            top: node.scrollHeight,
            behavior,
        });
    };
    const scrollbarVisible = (element) => {
        return element.scrollHeight > element.clientHeight;
    };
    function check_scroll() {
        $can_auto_scroll =
            scroll_.scrollTop >=
            scroll_.scrollHeight - scroll_.offsetHeight - 200;
    }
    const scrollToBottom = (node) => {
        function scroll_to() {
            if ($can_auto_scroll) scroll(node, "smooth");
        }
        scroll_to();
        return { update: scroll_to };
    };
    let old_index = 0;
    var isloading = false;
    var canload = true;
    function load_old() {
        if (isloading || !canload) return;
        isloading = true;
        if ($socket) {
            old_index++;
            $socket.emit("recive_old", old_index, (old_messages) => {
                if (old_messages.length > 0) {
                    for (let index = 0; index < old_messages.length; index++) {
                        var message = old_messages[index];
                        message.isPosted = true;
                        old_messages[index] = message;
                    }
                    const old = scroll_.scrollHeight;
                    $can_auto_scroll = false;
                    const contenct_messages = [...old_messages, ...$messages];

                    $messages = contenct_messages;

                    setTimeout(() => {
                        scroll_.scrollTop += scroll_.scrollHeight - old;

                        isloading = false;
                    }, 0);
                } else {
                    isloading = false;
                    canload = false;
                }
            });
        }
    }
    var scroll_;
    $: {
        if (scroll_ != undefined) {
            scroll_chat.set(scroll_);
        }
    }
    onMount(async () => {
        canManage =
            $user_data.permissions.includes("task_manage") ||
            $user_data.permissions.includes("*");

        task_connection($page.params.id);
        $socket.on("kick", (reason) => { 
            error = reason;
        });
        function update_connection_info(connection_data) {
            task_data = connection_data.task_data;
            users_in_task = connection_data.users_in_task;
            isOwner = task_data.owner == $user_data.player_uuid;
            isWorker = task_data.workers.includes($user_data.player_uuid);
        }
        $socket.on("connection_info_update", update_connection_info);
        $socket.on("connection_info", (connection_data) => {
            update_connection_info(connection_data);
            const messages_history = connection_data.messages;
            for (let index = 0; index < messages_history.length; index++) {
                var message = messages_history[index];
                message.isPosted = true;
                messages_history[index] = message;
            }
            $messages = messages_history;

            $cooldown_manager = connection_data.cooldown_manager;

            console.log("connected");
            setTimeout(() => {
                scroll(scroll_, "auto");
            }, 0);
            onSendMessage.set((message) => {
                $messages[$messages.length - 1] = message;
            });
            $socket.on("recive_message", (message) => {
                message["isnew"] = true;
                message.isPosted = true;
                if (!scrollbarVisible(scroll_)) $can_auto_scroll = true;
                $messages.push(message);
                $messages = [...$messages];
            });

            $socket.on("clear", () => ($messages = []));
        });
    });
    var error = undefined;
    var input;
    $: {
        if (input != undefined) {
            input_chat.set(input);
        }
    }
    beforeNavigate(() => {
        $messages = [];
    });
    var newimages = writable([]);
    function upload(event) {
        for (let index = 0; index < event.target.files.length; index++) {
            const file = event.target.files[index];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    $newimages.push({ preview: e.target.result, file: file });
                    $newimages = [...$newimages];
                };
                reader.readAsDataURL(file);
            }
        }
    }

    var cooldown_left = 0;
    $: if ($cooldown_manager && $cooldown_manager.isCooldown) start_cooldown();
    function start_cooldown() {
        const date_cooldown = new Date($cooldown_manager.last_message);
        date_cooldown.setMinutes(
            new Date($cooldown_manager.last_message).getMinutes() +
                $cooldown_manager.cooldown_in_minutes
        );
        cooldown_left = date_cooldown - new Date();
        var interval = setInterval(() => {
            cooldown_left = date_cooldown - new Date();

            if (cooldown_left < 0) {
                clearInterval(interval);
            }
        }, 1000);
    }
    function convertMillisecondsToMinutesAndSeconds(milliseconds) {
        // Calculate the total seconds
        const totalSeconds = Math.floor(milliseconds / 1000);

        // Calculate minutes and seconds
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Format the result as "00:00"
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        return `${formattedMinutes}:${formattedSeconds}`;
    }
</script>

<!-- <BgGradient/> -->

{#if task_data != undefined && error == undefined}
    <div
        class="w-full h-full shrink-0 overflow-auto grow flex justify-center relative"
    >
        <div class="w-full h-full relative max-w-[1400px] pb-[20px]">
            <div class="w-full h-full flex flex-col lg:bg_px_round">
                <div
                    class="w-full h-[45px] flex bg-zinc-800 items-center gap-10 flex-row"
                >
                    <a
                        href="./"
                        class="  shrink-0 w-fit max-w-[600px] text-[16px] bg-black/10 hover:bg-zinc-700 px-5 overflow-hidden flex justify-center items-center min-w-[100px] text-left h-full line-clamp-1"
                    >
                        {task_data.title}
                    </a>
                    <div class="grow h-full flex justify-end">
                        <button
                            on:click={() => {
                                showtools = !showtools;
                            }}
                            class="h-full w-[64px] {showtools
                                ? 'bg-zinc-900'
                                : 'bg-zinc-800 hover:bg-zinc-700'}  relative bg-center bg-no-repeat"
                            style="background-image: url(/icons/chat/tools.png); image-rendering: pixelated; background-size: 26px;"
                        >
                            {#if showtools}
                                <Tools
                                    canManage={canManage || isOwner}
                                    {isWorker}
                                    onleave={async () => {
                                        //popup_type.set("leave");

                                        leave_task($page.params.id);

                                        goto("./");
                                    }}
                                    ongivepoints={() => {
                                        popup_type.set("give_points");
                                        popup_callback.set(async () => {
                                            give_points(
                                                $page.params.id,
                                                $popup_data.points,
                                                $popup_data.workers[
                                                    $popup_data.active
                                                ]
                                            );
                                            popup_type.set(undefined);
                                        });
                                    }}
                                    onkick={() => {
                                        popup_type.set("kick");

                                        popup_callback.set(async () => {
                                            console.log(
                                                $popup_data.banDuration
                                            );
                                            kick(
                                                $page.params.id,
                                                $popup_data.banDuration !=
                                                    "expire_date"
                                                    ? $popup_data.banDuration
                                                    : $popup_data.expire_date,
                                                $popup_data.task_data.workers[
                                                    $popup_data.active
                                                ]
                                            );
                                            popup_type.set(undefined);
                                        });
                                    }}
                                    ondelete={() => {
                                        popup_type.set("delete");
                                        popup_callback.set(async () => {
                                            await delete_task($page.params.id);
                                            popup_type.set(undefined);
                                        });
                                    }}
                                />
                            {/if}
                        </button>
                    </div>
                </div>
                <div class="flex flex-row w-full grow">
                    <div class="flex flex-col grow">
                        <div class=" grow relative">
                            <div
                                bind:this={scroll_}
                                use:scrollToBottom={$messages}
                                on:scrollend={check_scroll}
                                on:scroll={(event) => {
                                    const scroll_ = event.target;
                                    if (
                                        scroll_.scrollTop <
                                        (scroll_.scrollHeight -
                                            scroll_.offsetHeight) /
                                            4
                                    )
                                        load_old();
                                }}
                                class="absolute top-0 left-0 w-full h-full overflow-auto flex flex-col space-y-[15px] p-[15px] scrollbar transition-all"
                            >
                                {#if isloading}
                                    <div
                                        class="w-full h-[45px] shrink-0 bg-green-600 flex justify-center items-center bg_px_round"
                                    >
                                        <p>Грузим!!!</p>
                                    </div>
                                {/if}

                                {#each $messages as message, index}
                                    <Message {task_data} {message} />
                                {/each}
                            </div>
                        </div>
                        <div class="w-full">
                            {#if $reply_message}
                                <div
                                    class="bg-zinc-700 text-white w-full py-2 px-5 gap-5 flex flex-row"
                                >
                                    <p
                                        on:click={() => {
                                            targetmessage.set(
                                                $reply_message.uuid
                                            );
                                        }}
                                        class="cursor-pointer line-clamp-1 grow"
                                    >
                                        Вы отвечаете на: "{reply_type(
                                            $reply_message
                                        )}"
                                    </p>
                                    <p
                                        href="#"
                                        class="cursor-pointer"
                                        on:click={() => {
                                            reply_message.set(undefined);
                                        }}
                                    >
                                        отменить
                                    </p>
                                </div>
                            {/if}
                            {#if $newimages.length > 0}
                                <div
                                    class="bg-zinc-700 text-white w-full py-2 px-5 gap-2 flex flex-row overflow-auto"
                                >
                                    <!-- svelte-ignore a11y-missing-attribute -->
                                    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                                    {#each $newimages as image, i}
                                        <div
                                            class="w-20 shrink-0 aspect-square group relative flex justify-center items-center bg_px_round"
                                        >
                                            <img
                                                draggable="false"
                                                class="absolute w-full h-full object-cover"
                                                src={image.preview}
                                            />
                                            <div
                                                class="absolute w-full h-full bg-black/60 opacity-0 group-hover:opacity-100"
                                            />
                                            <button
                                                type="button"
                                                on:click={() => {
                                                    $newimages.splice(i, 1);
                                                    $newimages = [
                                                        ...$newimages,
                                                    ];
                                                }}
                                                class="w-7 h-7 opacity-0 group-hover:opacity-100 bg-contain absolute"
                                                style="background-image: url(/images/close_icon.png); image-rendering: pixelated;"
                                            />
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                            <div class="flex flex-row">
                                <input
                                    accept="image/png, image/jpeg"
                                    multiple
                                    on:input={upload}
                                    type="file"
                                    class="hidden"
                                    id="image"
                                    name="image"
                                />
                                <label
                                    for="image"
                                    class=" h-[50px] cursor-pointer w-[80px] bg-zinc-900 flex justify-center items-center focus:outline-none"
                                >
                                    <img
                                        src="/icons/image_icon.png"
                                        alt=""
                                        class="w-8"
                                        style="image-rendering: pixelated;"
                                    />
                                </label>

                                {#if cooldown_left > 0}
                                    <div
                                        class="grow h-[50px] px-[25px] focus:outline-none placeholder:text-zinc-600 !bg-zinc-950 !border-0 flex items-center text-red-700"
                                    >
                                        ваши сообщения задержаны. осталось: {convertMillisecondsToMinutesAndSeconds(
                                            cooldown_left
                                        )}
                                    </div>
                                {:else}
                                    <input
                                        bind:this={input}
                                        maxlength="500"
                                        on:keydown={(event) => {
                                            if (event.key == "Enter") {
                                                send_message(
                                                    event.target.value,
                                                    {
                                                        images: $newimages,
                                                    }
                                                );
                                                $newimages = [];
                                                event.target.value = "";
                                                reply_message.set(undefined);
                                            }
                                        }}
                                        type="text"
                                        autocorrect={false}
                                        placeholder="напиши чето там кароче..."
                                        class="grow h-[50px] px-[25px] !bg-zinc-800 focus:outline-none placeholder:text-zinc-600 focus:!bg-zinc-900 !border-0"
                                    />
                                {/if}
                            </div>
                        </div>
                    </div>

                    <div
                        class="w-[200px] h-full bg-zinc-900 flex flex-col gap-2"
                    >
                        <div>
                            <p class="p-2 text-zinc-500">
                                владелец:
                            </p>
                            <MemberStatus
                                nickname={task_data.owner_nickname}
                                player_uuid={task_data.owner}
                                isOnline={users_in_task.includes(
                                    task_data.owner
                                )}
                            />
                        </div>
                        <div>
                            <p class="p-2 text-zinc-500">
                             рабочий класс:
                            </p>
                            {#each task_data.workers as worker, i}
                                <MemberStatus
                                    nickname={task_data.worker_nicknames[i]}
                                    player_uuid={worker}
                                    isOnline={users_in_task.includes(worker)}
                                />
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Popup />
{:else if error}
    <div
        class="w-full h-full absolute left-0 top-0 flex justify-center items-center"
    >
        <p>
            {error}
        </p>
    </div>
{/if}
