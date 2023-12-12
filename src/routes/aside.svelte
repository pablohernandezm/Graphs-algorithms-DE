<script lang="ts">
    import {Play} from "lucide-svelte";
    import { dijkstra, fordFulkerson } from '$lib';
    import { graphNodes, graphLines } from '$lib/stores';

    let fordFlow:number
    let dijkstraPath:number[]=[]

    $:console.info(dijkstraPath);
    $:console.info(fordFlow);

    function runFordFulkerson() {
        if($graphNodes.length===0) return;

        fordFlow = fordFulkerson($graphNodes, $graphLines);

        console.log('Flujo máximo:', fordFlow);
    }

    function runDijkstra() {
        const startNodeIndex = 0;
        const { distances, previousNodes } = dijkstra($graphNodes, $graphLines, startNodeIndex);

        dijkstraPath = [];

        const sourceNodes = $graphNodes.filter(node => node.isSource);

        const sinkNodes = $graphNodes.filter(node => node.isSink);

        let destinationNodeIndex = -1;
        let minDistance = Infinity;

        sourceNodes.forEach(()=>{
            for (const sinkNode of sinkNodes) {
                const sinkIndex = $graphNodes.indexOf(sinkNode);
                if (distances[sinkIndex] < minDistance) {
                    minDistance = distances[sinkIndex];
                    destinationNodeIndex = sinkIndex;
                }
            }
        })

        if (destinationNodeIndex !== -1) {
            let currentNode = destinationNodeIndex;

            dijkstraPath.unshift(currentNode);

            while (currentNode !== startNodeIndex && currentNode !== -1) {
                currentNode = previousNodes[currentNode];

                if (currentNode !== startNodeIndex && !dijkstraPath.includes(currentNode)) {
                    dijkstraPath.unshift(currentNode);
                }
            }

            if (!dijkstraPath.includes(startNodeIndex)) {
                dijkstraPath.unshift(startNodeIndex);
            }
        }
    }
</script>
<aside class="flex flex-col w-full md:max-w-[300px] h-full bg-base-300 rounded-sm p-4 justify-start gap-8 border-r-2 border-r-gray-500">
    <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-bold text-center">Algoritmos</h2>

        <div>
            <div>
                <button class="btn btn-ghost text-xl w-full justify-start flex-nowrap" on:click={runDijkstra}>
                    <Play class="flex-shrink-0"/>
                    <span class="line-clamp-1 text-start">Dijkstra</span>
                </button>
            </div>

            <div>
                <button class="btn btn-ghost text-xl w-full justify-start flex-nowrap" on:click={runFordFulkerson}>
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

        {#if dijkstraPath.length>0}
            <h4 class="font-bold text-xl">
                Camino más corto
            </h4>

            <ul class="steps md:steps-vertical justify-center items-center flex md:flex-col">
                {#each dijkstraPath as idx}
                    {#if $graphNodes[idx]}
                        <li class="md:grid-cols-[1fr_0] step step-neutral w-0 " data-content={$graphNodes[idx].isSource?'S':$graphNodes[idx].isSink?'T':`N${idx}`}/>
                    {/if}
                {/each}
            </ul>
        {/if}

        {#if fordFlow}
            <h4 class="font-bold text-xl">
                Flujo máximo
            </h4>

            {fordFlow}
        {/if}
    </div>
</aside>