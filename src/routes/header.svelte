<script lang="ts">
    import {Pointer, Eraser, Folder, Import, PlusCircle, Save, Workflow} from "lucide-svelte";
    import {action, AppAction} from "$lib/stores";

</script>

<div class="navbar bg-bunker-950 relative z-50">
    <div class="flex-1">
        <a href="/" class="btn btn-ghost text-2xl">
            MyGraph
        </a>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
            <li>
                <button class="btn btn-ghost" on:click={()=>{$action=AppAction.default}}>
                    <Pointer/>
                    <span class="hidden md:inline-flex">
                        Puntero
                    </span>
                </button>
            </li>
            <li>
                <button class="btn btn-ghost" on:click={()=>{$action=AppAction.addingNode}}>
                    <PlusCircle/>
                    <span class="hidden md:inline-flex">
                        Agregar nodo
                    </span>
                </button>
            </li>
            <li>
                <button class="btn btn-ghost" on:click={()=>{$action=AppAction.addingLink}}>
                    <Workflow/>
                    <span class="hidden md:inline-flex">
                        Enlazar nodos
                    </span>
                </button>
            </li>
            <li>
                <button class="btn btn-ghost" on:click={()=>{$action=AppAction.removing}}>
                    <Eraser/>
                    <span class="hidden md:inline-flex">
                        Borrar
                    </span>
                </button>
            </li>
            <li>
                <details>
                    <summary>
                        <Folder/>
                        <span class="hidden md:inline-flex">
                            Archivo
                        </span>
                    </summary>
                    <ul class="right-0 p-2 bg-base-100 rounded-t-none">
                        <li>
                            <button class="btn btn-ghost justify-start">
                                <Import size={20}/>
                                <span>
                                    Importar
                                </span>
                            </button>
                        </li>
                        <li>
                            <button class="btn btn-ghost justify-start">
                                <Save size={20}/>
                                <span>
                                    Guardar
                                </span>
                            </button>
                        </li>
                    </ul>
                </details>
            </li>
        </ul>
    </div>
</div>