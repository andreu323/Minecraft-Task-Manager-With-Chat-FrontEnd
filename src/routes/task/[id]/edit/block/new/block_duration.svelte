<script>
    import { expire_date,player,subpage } from "./data";
    import DateInput from "$lib/task_components/date_input.svelte";

    let dateInput;
    let selectedDate = null;

 

    var banDurection = "expire_date";
    var expire_date_value;
    function datepicked(e) {
        expire_date_value = e.detail.datepicked;
    } 
    function done(){
        if(banDurection != "expire_date"){
            $expire_date = banDurection;
        }
        else{
            $expire_date = expire_date_value;
        }
        $subpage = 3
    }
</script>

<div class="flex flex-row gap-2">
    <input
        bind:group={banDurection}
        type="radio"
        id="expire_date"
        name="block_type"
        value="expire_date"
    />
    <label for="expire_date">Определенная дата</label>
</div>
{#if banDurection == "expire_date"}
    <DateInput on:datepicked={datepicked} />
{/if}
<div class="flex flex-row gap-2">
    <input
        bind:group={banDurection}
        type="radio"
        id="forever"
        name="block_type"
        value="forever"
    />
    <label for="forever">Навсегда</label>
</div>
<button
    on:click={()=>{if($player)done()}}
    class="w-fit py-2 px-5 bg-pink-950 bg_px_round"
 
>
    Заблокировать
</button>
