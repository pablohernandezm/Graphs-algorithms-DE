<script lang="ts">
    import {selectedNode} from "$lib/stores.js";
    import {graphNodes} from "$lib/stores.js";
    import {enhance} from "$app/forms";
    import {X} from "lucide-svelte";
    export let modal:HTMLDialogElement;
</script>

<dialog class="modal" bind:this={modal}>
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><X/></button>
        </form>
        <h3 class="font-bold text-lg">Editar nodo</h3>
        {#if $selectedNode>=0}
            <form class="py-4 flex flex-col gap-4" method="post" use:enhance={({cancel, formData})=>{
                const nameData = formData.get('name');
                const typeData = formData.get('type');

                if (nameData && typeData){
                    try{
                        const name=nameData.toString();
                        const type=typeData.toString();

                        $graphNodes[$selectedNode].name=name;

                        switch (type){
                            case 'normal':
                                $graphNodes[$selectedNode].isSink=false;
                                $graphNodes[$selectedNode].isSource=false;
                                break;
                            case 'fuente':
                                $graphNodes.forEach((node)=>{
                                    if(node.isSource){node.isSource=false}
                                })

                                $graphNodes[$selectedNode].isSource=true;
                                $graphNodes[$selectedNode].isSink=false;
                                break;
                            case 'sumidero':
                                $graphNodes.forEach((node)=>{
                                    if (node.isSink){node.isSink=false}
                                })

                                $graphNodes[$selectedNode].isSource=false;
                                $graphNodes[$selectedNode].isSink=true;
                                break;
                        }
                        $selectedNode=-1;
                        $graphNodes=$graphNodes;
                        modal.close();
                    } catch (e){//Ignore
                    }
                }

                cancel();
            }}>
                <div class="flex flex-col gap-4">
                    <fieldset class="flex flex-col gap-2">
                        <label for="node_name">Nombre</label>
                        <input type=text name="name" id="node_name"
                               class="input input-bordered"
                               value={$graphNodes[$selectedNode].name}
                        >
                    </fieldset>

                    <fieldset>
                        <legend>Tipo de nodo</legend>
                        <div class="flex gap-6 py-4">
                            <div class="flex gap-4 items-center">
                                <input type="radio" name="type" value="normal" id="type_1" checked={!$graphNodes[$selectedNode].isSink && !$graphNodes[$selectedNode].isSource}
                                       class="radio radio-accent"
                                >
                                <label for="type_1">Nodo normal</label>
                            </div>

                            <div class="flex gap-4 items-center">
                                <input type="radio" name="type" value="fuente" id="type_2" checked={$graphNodes[$selectedNode].isSource}
                                       class="radio radio-accent"
                                >
                                <label for="type_2">Nodo fuente</label>
                            </div>

                            <div class="flex gap-4 items-center">
                                <input type="radio" name="type" value="sumidero" id="type_3" checked={$graphNodes[$selectedNode].isSink}
                                       class="radio radio-accent"
                                >
                                <label for="type_3">Sumidero</label>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <button type="submit" class="btn btn-neutral">Guardar</button>
            </form>
        {/if}
    </div>

    <form method="dialog" class="modal-backdrop">
        <button/>
    </form>
</dialog>