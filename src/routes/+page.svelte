<script lang="ts">
    import type {GraphLink, Point} from '$lib'
    import {GraphNode, LinkType} from '$lib'
    import {action, AppAction} from "$lib/stores";
    import type {Action} from "svelte/action";

    const cellSize=50;
    let dragging=false;

    let graph:GraphNode[] =[];
    let graphLinks:GraphLink[]=[];
    let svg:SVGElement
    function addNode(graphNode:GraphNode){
        graph=[...graph, graphNode];
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
            addNode(new GraphNode({x,y}, graph.length, graph.length===0, false))
        }

        else if($action === AppAction.addingLink){
            if(selectedNode>=0){
                if (startClick<0) {
                    startClick = selectedNode;
                    console.log(`Startclick: ${startClick}`)
                } else {
                    endClick = selectedNode;
                    console.log(`Endclick: ${endClick}`)
                }
                if (startClick>=0 && endClick>=0) {
                    let add=true;
                    let type:LinkType=LinkType.unidirectional;
                    for (let i = 0; i < graphLinks.length; i++) {
                        const link=graphLinks[i];
                        if (link.node1===startClick && link.node2===endClick){
                            add=false;
                        } else if(link.node1===endClick && link.node2===startClick){
                            link.type=LinkType.bidirectional;
                            graphLinks=graphLinks;
                            add=false;
                        }

                        if(!add){
                            break;
                        }
                    }

                    if (add){
                        graphLinks=[
                            ...graphLinks,
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
                graphLinks=graphLinks.filter((link)=>link.node1!==selectedNode && link.node2!==selectedNode)
                graph = graph.toSpliced(selectedNode, 1);
            }
        }

        console.info(graphLinks)
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
    const linkMaker:Action<SVGLineElement, GraphLink> = (line:SVGLineElement,link:GraphLink)=>{
        const {x:x1, y:y1} = graph[link.node1].point
        const {x:x2, y:y2} = graph[link.node2].point

        const {start, end} = toFixedPoints({x:x1, y:y1}, {x:x2, y:y2});

        line.setAttribute("x1", String(start.x));
        line.setAttribute("y1", String(start.y));
        line.setAttribute("x2", String(end.x));
        line.setAttribute("y2", String(end.y));
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        if (link.type===LinkType.bidirectional){
            line.setAttribute("marker-start", "url(#arrow-reversed)");
        }
        line.setAttribute("marker-end", "url(#arrow)");
    }

    const labelMaker:Action<SVGTextElement, GraphLink>=(text:SVGTextElement, link:GraphLink)=>{
        const {x:x1, y:y1} = graph[link.node1].point
        const {x:x2, y:y2} = graph[link.node2].point

        const {start, end} = toFixedPoints({x:x1, y:y1}, {x:x2, y:y2});

        text.setAttribute("x", String((end.x+start.x)/2))
        text.setAttribute("y", String((end.y+start.y)/2))
        text.setAttribute("fill", "white")
        text.setAttribute("font-size", "25")
        text.setAttribute("font-weight", "bold")
        text.setAttribute("stroke", "#323d48")
        text.setAttribute("stroke-width", "1.5")
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
                graph=graph;
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

            {#each graph as node, i (i)}
                {#if node.point}
                        <circle cx={node.point.x}
                                cy={node.point.y}
                                r={Math.ceil(cellSize/2)}
                                role="presentation"
                                on:click={()=>{selectedNode=i}}
                                use:nodeMaker={node}
                                class="fill-anzac-400 stroke-anzac-500 stroke-2
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

            {#each graphLinks as link, i (i)}
                <line use:linkMaker={link}/>
                <text use:labelMaker={link}>{link.weight}</text>
            {/each}
        </svg>
    </button>
</main>
