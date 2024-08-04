<script>
    import { goto } from "$app/navigation";

    import { user_data, token_data, backend_adress } from "$lib/app";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Editor from "$lib/task_components/description_editor.svelte";
    import { writable } from "svelte/store";
    import { task_data } from "./edit";

    var progress = false;

    function htmlToJson(element) {
        var result = {};
        result.tagName = element.tagName;
        if (element.attributes.length > 0) {
            result.attributes = {};
            for (var i = 0; i < element.attributes.length; i++) {
                var attribute = element.attributes[i];
                if (attribute.name == "class") continue;
                result.attributes[attribute.name] = attribute.value;
            }
        }
        if (element.childNodes.length > 0) {
            result.childNodes = [];
            for (var i = 0; i < element.childNodes.length; i++) {
                var childNode = element.childNodes[i];
                if (childNode.nodeType === Node.TEXT_NODE) {
                    result.childNodes.push(childNode.nodeValue);
                } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                    result.childNodes.push(htmlToJson(childNode));
                }
            }
        }
        return result;
    }

    async function onSubmit(event) {
        progress = true;
        const form = event.target;
        const url = new URL(form.action + "?token=" + $token_data.access_token);
        const formData = new FormData(form);
        formData.delete("images");
        for (let index = 0; index < $newimages.length; index++) {
            const image = $newimages[index].file;
            formData.append("images", image);
        }

        const element = document.createElement("div");
        element.innerHTML = desc;
        const json = htmlToJson(element);
        formData.append("description", JSON.stringify(json));
        $task_data.description = JSON.stringify(json);
        const fetchOptions = {
            method: form.method,
            body: formData,
        };
        const task_data_new = await fetch(url, fetchOptions).then((res) => {
            return res.json();
        });
        $task_data.images = task_data_new.images;
        
        $newimages = [];
        progress = false;
    }
    var desc;
    function jsonToHtml(json) {
        if (json.tagName == "script") return;
        var element = document.createElement(json.tagName);
        if (json.attributes) {
            for (var name in json.attributes) {
                if (name !== "class") {
                    element.setAttribute(name, json.attributes[name]);
                }
            }
        }
        if (json.childNodes) {
            for (var i = 0; i < json.childNodes.length; i++) {
                var childNode = json.childNodes[i];

                if (typeof childNode === "string") {
                    element.appendChild(document.createTextNode(childNode));
                } else {
                    element.appendChild(jsonToHtml(childNode));
                }
            }
        }
        return element;
    }
    function getdesc() {
        const desc_json = JSON.parse($task_data.description);
        const html = jsonToHtml(desc_json); 
        desc = html.innerHTML;
    }

    $: {
        if ($task_data != undefined)  getdesc() ; 
    }
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
    async function remove_img(img_name) {
        await fetch(
            backend_adress +
                "/task/delete/image/" +
                $task_data.id +
                "/" +
                img_name +
                "?token=" +
                $token_data.access_token
        );
        const index = $task_data.images.indexOf(img_name);
        $task_data.images.splice(index, 1);
        $task_data.images = [...$task_data.images];
    } 
</script>

{#if $task_data != undefined}
    <form
        action="{backend_adress}/task/edit/{$page.params.id}"
        method="post"
        on:submit|preventDefault={onSubmit}
        enctype="multipart/form-data"
        class="w-full flex flex-col gap-3 relative justify-center items-center"
    >
        <p class="w-full">Заголовок:</p>
        <input
            type="text"
            name="title"
            required
            maxlength="100"
            class="!p-5"
            value={$task_data.title}
            style="font-family: minecraft_font_ten; font-size: 24px;"
        />
        <p class="w-full">Количество Баллов:</p>
        <input type="number" name="points" value={$task_data.points} required />
        <p class="w-full">Максимальное Количество Рабочих:</p>
        <input
            type="number"
            name="max_workers"
            value={$task_data.max_workers}
            required
            maxlength="9999"
        />
        <p class="w-full">Картинки:</p>
        <div
            class="p-[10px] h-[190px] w-full bg-gray-700/40 backdrop-blur-[100px] space-x-[10px] flex flex-row overflow-x-auto relative items-center"
        >
            {#each $task_data.images as image, i}
                <div class="shrink-0 w-[240px] h-[150px] relative group">
                    <img
                        alt=""
                        src={backend_adress +
                            "/assets/images/task/" +
                            $page.params.id +
                            "/" +
                            image +
                            "-low.png"}
                        loading="lazy"
                        draggable="false"
                        class="w-full h-full object-cover relative group-hover:opacity-75"
                    />
                    <button
                        type="button"
                        on:click={() => {
                            remove_img(image);
                        }}
                        class="w-7 h-7 opacity-0 group-hover:opacity-100 absolute top-2 right-2 bg-contain"
                        style="background-image: url(/images/close_icon.png); image-rendering: pixelated;"
                    />
                </div>
            {/each}
            {#each $newimages as image, i}
                <div
                    class="shrink-0 w-[240px] h-[150px] bg-black relative group"
                >
                    <img
                        alt=""
                        src={image.preview}
                        loading="lazy"
                        draggable="false"
                        class="w-full h-full object-cover relative opacity-60"
                    />
                    <button
                        type="button"
                        on:click={() => {
                            $newimages.splice(i, 1);
                            $newimages = [...$newimages];
                        }}
                        class="w-7 h-7 opacity-0 group-hover:opacity-100 absolute top-2 right-2 bg-contain"
                        style="background-image: url(/images/close_icon.png); image-rendering: pixelated;"
                    />
                    <p class="absolute bottom-2 right-2">превью</p>
                </div>
            {/each}

            <div class="shrink-0 w-[240px] h-[150px] relative">
                <label
                    class="absolute w-full h-full bg-black cursor-pointer flex justify-center items-center"
                    for="images"
                >
                    <img
                        src="/images/add_icon.png"
                        width="32"
                        style="image-rendering: pixelated;"
                    />
                    <input
                        on:input={upload}
                        type="file"
                        multiple
                        id="images"
                        name="images"
                        accept="image/png, image/jpeg"
                        hidden
                    />
                </label>
            </div>
        </div>
        <div class="w-full">
            <label for="status">Стаутс Задачи:</label>
            <select id="status" class="text-black p-2" value="{$task_data.status.toString()}"  name="status">
                <option value="0">Выполняеться</option>
                <option value="1">Задержанно</option>
                <option value="2">Набор</option>
                <option value="3">Выполненно</option>
            </select>
        </div>
        <p class="w-full">Описание:</p>
        <Editor bind:html={desc} />
        <button
            type="submit"
            disabled={progress}
            class="    w-full p-3 bg_px_round {progress
                ? 'bg-orange-500 text-white'
                : 'bg-gray-300 text-black'}"
            style="font-family: minecraft_font_ten; font-size: 20px;"
            >{progress ? "Обновляем" : "Изменить"}</button
        >
    </form>
{/if}

<style lang="postcss">
    input {
        @apply p-3 text-xl w-full bg-transparent    border-2 border-gray-600 text-[16px]  text-white !outline-none;
    }
</style>
