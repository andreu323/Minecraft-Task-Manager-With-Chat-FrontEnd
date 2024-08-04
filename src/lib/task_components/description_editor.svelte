<script>
    var maxLength = 1000;
    export var html = "";
    function onpaste(e) {
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData(
            "text/plain"
        );
        document.execCommand("insertText", false, text);
    }
    function oninput(e) {
        const editableDiv = e.target;
        if (editableDiv.innerText.length > maxLength) {
            editableDiv.innerText = editableDiv.innerText.substring(
                0,
                maxLength
            );
        }
    }
    function onkeypress(e) {
        const editableDiv = e.target;
        var selection = window.getSelection();
        if (selection.rangeCount != 0) {
            var range = selection.getRangeAt(0);
            range.deleteContents();
        }
        if (editableDiv.innerText.length >= maxLength) {
            e.preventDefault();
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    id="editor"
 
    class="input w-full overflow-auto border-2 border-gray-600 min-h-[200px] max-h-[500px] text-white !outline-none relative p-2"
    data-text="ну типо описание"
    bind:innerHTML={html}
    on:paste={onpaste}
    on:keypress={onkeypress}
    on:input={oninput}
    contenteditable="true"
/>
 