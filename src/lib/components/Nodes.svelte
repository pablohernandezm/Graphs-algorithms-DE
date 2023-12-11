<script lang="ts">
    import {graphNodes, diameter, action, AppAction, selectedNode, graphLines} from "$lib/stores";
    import type {Action} from "svelte/action";
    import type {GraphNode} from "$lib";
    export let modal:HTMLDialogElement;
    let dragging=false;

    const nodeMover:Action<SVGCircleElement, GraphNode>=(circle:SVGCircleElement, node:GraphNode)=>{
        circle.addEventListener('mousedown', ()=>{
            if($action===AppAction.default){
                dragging=true;
            }
        })

        circle.addEventListener('mousemove', (e:MouseEvent)=>{
            if (dragging){
                node.point={x:e.offsetX, y:e.offsetY};
                $graphNodes=$graphNodes;
            }
        });

        circle.addEventListener('mouseup', ()=>{
            dragging=false;
        })
    }
</script>
{#each $graphNodes as node, i (i)}
    {#if node.point}
        <circle cx={node.point.x}
                cy={node.point.y}
                r={Math.ceil($diameter/2)}
                role="presentation"
                use:nodeMover={node}
                class="{node.isSource || node.isSink?'fill-anzac-400 stroke-anzac-500':'fill-san-juan-400 stroke-san-juan-700'} stroke-2
                        {$action===AppAction.default?'hover:cursor-move':
                        $action===AppAction.addingLink?'hover:cursor-cell':
                        $action===AppAction.editing?'hover:cursor-pointer':''}"
                on:click|stopPropagation={()=>{
                    if($action===AppAction.removing){
                        $graphLines=$graphLines.filter((line)=>line.node1!==i && line.node2!==i)

                        for (let x = 0; x < $graphLines.length; x++) {
                            if($graphLines[x].node1>=i){
                                $graphLines[x].node1=$graphLines[x].node1-1;
                            }
                            if ($graphLines[x].node2>=i){
                                $graphLines[x].node2=$graphLines[x].node2-1;
                            }
                        }

                        $graphNodes = $graphNodes.toSpliced(i, 1);
                    } else if($action===AppAction.editing){
                        $selectedNode=i;
                        if(modal){modal.showModal();}
                    } else if($action===AppAction.addingLink){
                        $selectedNode=i;
                    }
                }}
        />

        <text x={node.point.x}
              y={node.point.y}
              text-anchor="middle"
              alignment-baseline="middle"
              font-size="{$diameter/2.4}"
              fill="purple"
              class="fill-bunker-950 font-bold pointer-events-none"
        >
            {#if node.isSource}
                S
            {:else if node.isSink}
                T
            {:else if node.name.length>0}
                {node.name}
            {:else}
                N{i+1}
            {/if}
        </text>
    {/if}
{/each}