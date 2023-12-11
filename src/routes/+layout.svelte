<script lang="ts">
    import '../app.css'
    import Header from './header.svelte'
    import Aside from './aside.svelte'
    import {selectedNode, selectedLine, action} from "$lib/stores";
    action.subscribe(()=>{
        $selectedLine=-1;
        $selectedNode=-1;
    })
</script>

<Header/>
<div class="bg-bunker-800 overflow-hidden" style="min-height: calc(100cqh - 5.1rem)">
    <div class="flex flex-col md:flex-row h-full">
        <Aside/>
        <slot/>
    </div>
</div>