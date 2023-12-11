<script lang="ts">
    import {BoxSelect} from 'lucide-svelte'
    import{canvasSize} from "$lib/stores";

    let dialog:HTMLDialogElement;
</script>

<button class="flex gap-2 py-1 px-4 items-center justify-end" title="Tamaño del lienzo"
        on:click={()=>{dialog.showModal()}}>
    <BoxSelect size={16}/>
    {$canvasSize.w}x{$canvasSize.h}
</button>

<dialog class="modal" bind:this={dialog}>
    <div class="modal-box max-w-sm">
        <h2 class="font-bold text-2xl text-center">Dimensiones del lienzo</h2>
        <div class="grid grid-rows-2 py-4 grid-cols-[max-content_max-content] gap-4 justify-center">
            <label for="w">Anchura</label>
            <input type="number" id="w" class="input input-sm input-accent" bind:value={$canvasSize.w} min={0}/>

            <label for="h">Altura</label>
            <input type="number" id="h" class="input input-sm input-accent" bind:value={$canvasSize.h} min={0}>
        </div>

        <div class="modal-action m-0 justify-center">
            <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn btn-wide btn-neutral">Cerrar</button>
            </form>
        </div>
    </div>

    <form method="dialog" class="modal-backdrop">
        <button>Cerrar</button>
    </form>
</dialog>