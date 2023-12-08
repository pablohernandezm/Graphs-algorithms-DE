<script lang="ts">
    import '../app.css'
    import Header from './header.svelte'
    import Aside from './aside.svelte'
    import {setContext} from 'svelte'
    import type {AppAction} from "$lib";


    let action:AppAction;

    function setAction(new_action:AppAction){action=new_action}
    function getAction(){return action;}

    setContext('action', {
        setAction,
        getAction
    })
</script>

<Header/>
<div class="bg-bunker-800 overflow-hidden" style="height: calc(100cqh - 5rem)">
    <div class="flex flex-col md:flex-row gap-1 p-1 h-full">
        <Aside/>
        <slot/>
    </div>
</div>