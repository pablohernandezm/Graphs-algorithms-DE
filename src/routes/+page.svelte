<script lang="ts">
    import type {GraphLines, Point} from '$lib'
    import {GraphNode, LineType} from '$lib'
    import {action, AppAction} from "$lib/stores";
    import type {Action} from "svelte/action";

    const cellSize=50;
    let dragging=false;

    let graphNodes:GraphNode[] =[];
    let graphLines:GraphLines[]=[];
    let svg:SVGElement
    function addNode(graphNode:GraphNode){
        graphNodes=[...graphNodes, graphNode];
    }


    let startClick: number=-1;
    let endClick: number=-1;
    let selectedNode:number=-1;

    action.subscribe(()=>{
        startClick=-1;
        endClick=-1;
        selectedNode=-1;
    })

    function handleClick(event: MouseEvent) {
        const rect = svg.getBoundingClientRect();
        const x = event.clientX-rect.left;
        const y = event.clientY-rect.top;

        if ($action === AppAction.addingNode){
            addNode(new GraphNode({x,y}, graphNodes.length, graphNodes.length===0, false))
        }

        else if($action === AppAction.addingLink){
            if(selectedNode>=0){
                if (startClick<0) {
                    startClick = selectedNode;
                } else {
                    endClick = selectedNode;
                }

                console.info(`start:${startClick}, end:${endClick}`)
                if (startClick>=0 && endClick>=0) {
                    let add=true;
                    let type:LineType=LineType.unidirectional;

                    for (let i = 0; i < graphLines.length; i++) {
                        const line=graphLines[i];

                        if (line.node1===startClick && line.node2===endClick){
                            add=false;
                        } else if(line.node1===endClick && line.node2===startClick){
                            line.type=LineType.bidirectional;
                            graphLines=graphLines;
                            add=false;
                        }

                        if(!add){
                            break;
                        }
                    }
                    if (add){
                        graphLines=[
                            ...graphLines,
                            {node1:startClick, node2:endClick, weight:0, type}
                        ]
                    }
                    startClick = -1;
                    endClick = -1;
                }
            }
        }

        else if($action === AppAction.removing){
            if (selectedNode>=0){
                graphLines=graphLines.filter((line)=>line.node1!==selectedNode && line.node2!==selectedNode)

                for (let i = 0; i < graphLines.length; i++) {
                    if(graphLines[i].node1>=selectedNode){
                        graphLines[i].node1=graphLines[i].node1-1;
                    }
                    if (graphLines[i].node2>=selectedNode){
                        graphLines[i].node2=graphLines[i].node2-1;
                    }
                }
                graphNodes = graphNodes.toSpliced(selectedNode, 1);
            }
        }

        selectedNode=-1;
    }

    function toFixedPoints(start:Point, end:Point){
        const r = (cellSize/2)+10;

        let dx = end.x-start.x;
        let dy = end.y-start.y;
        let theta = Math.atan2(dy,dx);

        start.y=start.y+r*Math.sin(theta);
        start.x=start.x+r*Math.cos(theta);

        end.x=end.x-r*Math.cos(theta);
        end.y=end.y-r*Math.sin(theta);

        return {start, end}
    }

    const lineCordsHelper = (node1:GraphNode, node2:GraphNode)=>{
        const fixed= toFixedPoints(
            {x:node1.point.x, y:node1.point.y},
            {x:node2.point.x, y:node2.point.y}
        )

        return {
            x1:fixed.start.x,
            x2:fixed.end.x,
            y1:fixed.start.y,
            y2:fixed.end.y
        }
    }

    const lineLabelCordsHelper =(node1:GraphNode, node2:GraphNode)=>{
        const {start, end}=toFixedPoints(
            {x:node1.point.x, y:node1.point.y},
            {x:node2.point.x, y:node2.point.y}
        )

        return{
            x:String((end.x+start.x)/2),
            y:String((end.y+start.y)/2)
        }
    }

    const nodeMaker:Action<SVGCircleElement, GraphNode>=(circle:SVGCircleElement, node:GraphNode)=>{
        circle.addEventListener('mousedown', ()=>{
            if($action===AppAction.default){
                dragging=true;
            }
        })

        circle.addEventListener('mousemove', (e:MouseEvent)=>{
            if (dragging){
                node.point={x:e.offsetX, y:e.offsetY};
                graphNodes=graphNodes;
            }
        });

        circle.addEventListener('mouseup', ()=>{
            dragging=false;
        })
    }
</script>

<main class="overflow-auto w-full bg-gray-800 flex justify-center items-center relative rounded-sm">
   <button class="contents cursor-default" on:click={handleClick}>
        <svg width="500px" height="500px" class="bg-gray-400 flex-shrink-0 flex-grow-0 relative" bind:this={svg}>
            <defs>
                <desc>Define the marker</desc>
                <marker id="arrow" refX="4" refY="3" markerWidth="6" markerHeight="6" orient="auto" stroke="black">
                    <path d="M 0 0 L 4 3 L 0 6 Z"></path>
                </marker>

                <marker id="arrow-reversed" refX="4" refY="3" markerWidth="6" markerHeight="6" orient="auto" stroke="black">
                    <path d="M 6 0 L 2 3 L 6 6 Z"></path>
                </marker>
            </defs>

            {#each graphNodes as node, i (i)}
                {#if node.point}
                        <circle cx={node.point.x}
                                cy={node.point.y}
                                r={Math.ceil(cellSize/2)}
                                role="presentation"
                                on:click={()=>{selectedNode=i}}
                                use:nodeMaker={node}
                                class="{node.isSource || node.isSink?'fill-anzac-400 stroke-anzac-500':'fill-san-juan-400 stroke-san-juan-700'} stroke-2
                                    {$action===AppAction.default?'hover:cursor-move':
                                    $action===AppAction.addingLink?'hover:cursor-cell':''}"
                        />

                        <text x={node.point.x}
                              y={node.point.y}
                              text-anchor="middle"
                              alignment-baseline="middle"
                              font-size="{cellSize/2.7}"
                              fill="purple"
                              class="fill-bunker-950 font-bold pointer-events-none"
                        >
                            {#if node.isSource}
                                S
                            {:else if node.isSink}
                                T
                            {:else}
                                N{i+1}
                            {/if}
                        </text>
                {/if}
            {/each}

            {#each graphLines as line, i (i)}
                <line {...lineCordsHelper(graphNodes[line.node1], graphNodes[line.node2])}
                      marker-start="{line.type===LineType.bidirectional? 'url(#arrow-reversed)':''}"
                      marker-end="url(#arrow)"
                      class="stroke-black stroke-2"
                      id="link-{graphNodes.length}-{line.type}"/>

                <text class="fill-white font-bold text-2xl stroke-black stroke-2"
                      {...lineLabelCordsHelper(graphNodes[line.node1], graphNodes[line.node2])}>
                    {line.weight}
                </text>
            {/each}
        </svg>
    </button>
</main>
