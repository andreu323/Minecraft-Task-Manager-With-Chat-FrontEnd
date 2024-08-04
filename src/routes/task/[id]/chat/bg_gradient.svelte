<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    const allgradients = ["orange", "pink", "purple"];
    var active = 1;
    function rnd(){
        var rnd_value =  Math.floor(Math.random() * allgradients.length);
        if(active == rnd_value)rnd_value = rnd();
        return  rnd_value;
    }
    function randgradient() {
         
     
        active =rnd(); 
        setTimeout(randgradient, 30000);
    }
    var showbg = false;
    onMount(() => { 
        
        showbg=true;
        randgradient();
    });
</script>
 {#key active}
 
    <img
        transition:fade={{duration:30000}}
        draggable="false" 
        class:hidden={!showbg}
        alt=""
        class="fixed left-0 top-0 w-full h-full  -z-10 blur-[100px]  "
        src="/images/gradients/{allgradients[active]}.png"
    />
       
 {/key}
<div class="fixed left-0 top-0 w-full h-full -z-10 bg-black/40 backdrop-blur-3xl" />