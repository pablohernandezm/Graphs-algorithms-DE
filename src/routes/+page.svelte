<script lang="ts">
    import NodeModal from '$lib/components/Modals/nodeModal.svelte'
    import LineModal from '$lib/components/Modals/lineModal.svelte'
    import Lines from "$lib/components/Lines.svelte";
    import Nodes from "$lib/components/Nodes.svelte";
    import Settings from '$lib/components/canvasSize.svelte';
    import {action, AppAction, graphLines, graphNodes, selectedNode, canvasSize} from "$lib/stores";
    import {GraphNode, LineType} from '$lib'


    let svg:SVGElement
    let lineModal:HTMLDialogElement;
    let nodeModal:HTMLDialogElement;

    function addNode(graphNode:GraphNode){
        $graphNodes=[...$graphNodes, graphNode];
    }

    let startClick: number=-1;
    let endClick: number=-1;

    action.subscribe(()=>{
        startClick=-1;
        endClick=-1;
        $selectedNode=-1;
    })

    function handleClick(event: MouseEvent) {
        const rect = svg.getBoundingClientRect();
        const x = event.clientX-rect.left;
        const y = event.clientY-rect.top;

        if ($action === AppAction.addingNode){
            addNode(new GraphNode({x,y}, `N${$graphNodes.length}`,false, false))
            $selectedNode=-1;
        }
    }

    selectedNode.subscribe((selected)=>{
        if($action === AppAction.addingLink){
            if(selected>=0){
                if (startClick<0) {
                    startClick = selected;
                } else if(selected!=startClick) {
                    endClick = selected;
                } else{
                    startClick=-1;
                    endClick=-1;
                    return;
                }

                if (startClick>=0 && endClick>=0) {
                    let add=true;
                    let type:LineType=LineType.unidirectional;

                    for (let i = 0; i < $graphLines.length; i++) {
                        const line=$graphLines[i];

                        if (line.node1===startClick && line.node2===endClick){
                            add=false;
                        } else if(line.node1===endClick && line.node2===startClick){
                            line.type=LineType.bidirectional;
                            $graphLines=$graphLines;
                            add=false;
                        }

                        if(!add){
                            break;
                        }
                    }
                    if (add){
                        $graphLines=[
                            ...$graphLines,
                            {node1:startClick, node2:endClick, weight:0, type}
                        ]
                    }
                    startClick = -1;
                    endClick = -1;
                    $selectedNode=-1;
                }
            }
        }
        else{
            startClick=-1;
            endClick=-1;
        }
    })
</script>


<div class="flex flex-col w-full justify-between bg-gray-800">
    <main class="overflow-auto w-full h-full  flex flex-col justify-center items-center relative rounded-sm">
        <button class="contents cursor-default" on:click={handleClick}>
            <svg width={$canvasSize.w} height={$canvasSize.h} class="bg-gray-400 flex-shrink-0 flex-grow-0 relative" bind:this={svg}>
                <defs>
                    <desc>Define the marker</desc>
                    <marker id="arrow" refX="4" refY="3" markerWidth="6" markerHeight="6" orient="auto" stroke="black">
                        <path d="M 0 0 L 4 3 L 0 6 Z"></path>
                    </marker>

                    <marker id="arrow-reversed" refX="4" refY="3" markerWidth="6" markerHeight="6" orient="auto" stroke="black">
                        <path d="M 6 0 L 2 3 L 6 6 Z"></path>
                    </marker>
                </defs>

                <Nodes modal={nodeModal}/>
                <Lines modal={lineModal}/>
            </svg>
        </button>
    </main>

    <div class="w-full flex justify-end items-end ">
        <Settings/>
    </div>
</div>

{#if $action===AppAction.editing}
    <NodeModal bind:modal={nodeModal}/>
    <LineModal bind:modal={lineModal}/>
{/if}

