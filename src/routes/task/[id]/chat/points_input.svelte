<script>
    var maxLength = 10000;
    export var value = 999;
    function onpaste(e) {
        e.preventDefault();
        var text = (e.clipboardData || window.clipboardData).getData(
            "text/plain"
        );
        document.execCommand("insertText", false, text);
    }
    function oninput(e) {
        const editableDiv = e.target; 
        const n = Number.parseInt(editableDiv.textContent);  
        editableDiv.textContent = n; 
        value = n;
       
        if (n > maxLength) {
            editableDiv.textContent= maxLength;
            value = maxLength;
        }
    }
    function onkeypress(e) {  
        var selection = window.getSelection();
        if(isNaN(e.key))return  e.preventDefault();
        if (selection.rangeCount != 0) {
            var range = selection.getRangeAt(0);
            range.deleteContents();
        }  
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<p
 
    bind:textContent={value}
    on:paste={onpaste}
    on:keypress={onkeypress}
    on:input={oninput}
    type="number"
    contenteditable
    style="  text-shadow: -8px 8px 0px #56148f;"
    class="input  bg-transparent focus:outline-none w-fit"
>
    999
</p> 