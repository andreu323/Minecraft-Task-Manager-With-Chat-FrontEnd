<script>
    import { goto } from "$app/navigation";

    import { user_data, token_data, backend_adress } from "$lib/app";

    import { onMount } from "svelte";
    import Editor from "$lib/task_components/description_editor.svelte";
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

        const element = document.createElement("div");
        element.innerHTML = desc;
        const json = htmlToJson(element);
        formData.append("description", JSON.stringify(json));
        const fetchOptions = {
            method: form.method,
            body: formData,
        };
        const uuid = await fetch(url, fetchOptions).then((res) => {
            return res.text();
        });
        goto("/task/" + uuid);
    }
    var desc = "";
</script>

<div class="w-full h-full overflow-auto pb-[120px] scrollbar">
    <form
        action="{backend_adress}/task/create"
        method="post"
        on:submit|preventDefault={onSubmit}
        enctype="multipart/form-data"
        class="w-full flex flex-col gap-3 relative justify-center items-center"
    >
        <input
            type="text"
            name="title"
            placeholder="заголовок"
            required
            maxlength="100"
            class="!p-5"
            style="font-family: minecraft_font_ten; font-size: 24px;"
        />

        <input type="number" name="points" placeholder="кол. баллов" required />
        <input
            type="number"
            name="max_workers"
            placeholder="макс. игроков"
            required
            maxlength="9999"
        />
        <input
            type="file"
            multiple
            id="images"
            name="images"
            accept="image/png, image/jpeg"
        />
 
        <Editor bind:html={desc} />
        <button type="submit" class=" bg-gray-300 text-black w-full p-3 bg_px_round" style="font-family: minecraft_font_ten; font-size: 20px;" >Создать</button>
        {#if progress}
            <div class="w-full h-full absolute top-0 left-0 bg-black/80" />
            <p class="absolute">публикуем жеско</p>
        {/if}
    </form>
</div>

<style lang="postcss">
    input {
        @apply p-3 text-xl w-full bg-transparent    border-2 border-gray-600 text-[16px]  text-white !outline-none;
    }
</style>
