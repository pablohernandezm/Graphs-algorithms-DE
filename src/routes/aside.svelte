<script>
    import {Play} from "lucide-svelte";
</script>
<aside class="flex flex-col w-full md:max-w-[300px] h-full bg-base-300 rounded-sm p-4 justify-start gap-8 border-r-2 border-r-gray-500">
    <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-bold text-center">Algoritmos</h2>

        <div>
            <div>
                <button class="btn btn-ghost text-xl w-full justify-start flex-nowrap">
                    <Play class="flex-shrink-0"/>
                    <span class="line-clamp-1 text-start">Dijkstra</span>
                </button>
            </div>

            <div>
                <button class="btn btn-ghost text-xl w-full justify-start flex-nowrap">
                    <Play class="flex-shrink-0"/>
                    <span class="line-clamp-1 text-start">Ford Fulkerson</span>
                </button>
            </div>
        </div>
    </div>

    <div class="flex flex-col gap-4">
        <h3 class="text-xl uppercase font-mono text-center border border-zinc-400 p-2">
            Resultados
        </h3>

        <ul class="steps md:steps-vertical justify-center items-center flex md:flex-col">
            <li class="md:grid-cols-[1fr_0] step step-neutral w-0 " data-content="S"/>
            <li class="md:grid-cols-[1fr_0] step step-neutral w-0 " data-content="N2"/>
            <li class="md:grid-cols-[1fr_0] step step-neutral w-0 " data-content="N3"/>
            <li class="md:grid-cols-[1fr_0] step step-neutral w-0 " data-content="T"/>
        </ul>
    </div>
</aside>