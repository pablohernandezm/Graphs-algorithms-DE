<script lang="ts">
    import {graphLines} from "$lib/stores.js";
    import {enhance} from "$app/forms";
    import {X} from "lucide-svelte";
    export let modal:HTMLDialogElement;
    import {selectedLine} from "$lib/stores.js";
</script>


<dialog class="modal" bind:this={modal}>
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><X/></button>
        </form>
        <h3 class="font-bold text-lg">Editar linea</h3>
        {#if $selectedLine>=0 && $graphLines[$selectedLine]}
            <form class="py-4 flex flex-col gap-4" method="post" use:enhance={({cancel, formData})=>{
                const weightData = formData.get('weight')?.toString();

                if (weightData){
                    try{
                        $graphLines[$selectedLine].weight=parseInt(weightData);
                        modal.close()
                    } catch (e){//Ignore
                    }
                }

                $selectedLine=-1;
                cancel();
            }}>
                <div class="flex flex-col gap-2">
                    <label for="line_weight">Peso</label>
                    <input type=number name="weight" id="line_weight" class="input input-bordered" min="0" value={$graphLines[$selectedLine].weight}>
                </div>

                <button type="submit" class="btn btn-neutral">Guardar</button>
            </form>
        {/if}
    </div>

    <form method="dialog" class="modal-backdrop">
        <button/>
    </form>
</dialog>