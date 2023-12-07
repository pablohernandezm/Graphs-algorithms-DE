<script lang="ts">
    import {GraphNode} from '$lib'

    const cellSize=50;
    let graph:GraphNode[] =[];
    let svg:SVGElement
    function addNode(graphNode:GraphNode){
        graph=[...graph, graphNode];
    }


    let startClick: { x: number; y: number } | null = null;
    let endClick: { x: number; y: number } | null = null;

    function handleClick(event: MouseEvent) {
        const x = Math.ceil(event.offsetX);
        const y = Math.ceil(event.offsetY);
        addNode(new GraphNode({x,y}, graph.length+1, graph.length, graph.length===0, false))


        if (!startClick) {
            startClick = { x, y };
        } else {
            endClick = { x, y };
        }

        if (startClick && endClick) {
            createArrow(startClick, endClick);
        }
    }

    interface Point{
        x:number,
        y:number
    }
    function createArrow(start: Point, end: Point) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        let dx = end.x-start.x;
        let dy = end.y-start.y;
        let theta = Math.atan2(dy,dx);

        const r = (cellSize/2)+10;


        start.y=start.y+r*Math.sin(theta);
        start.x=start.x+r*Math.cos(theta);

        theta = Math.atan2(dy, dx);
        end.x=end.x-r*Math.cos(theta);
        end.y=end.y-r*Math.sin(theta);

        line.setAttribute("x1", String(start.x));
        line.setAttribute("y1", String(start.y));
        line.setAttribute("x2", String(end.x));
        line.setAttribute("y2", String(end.y));
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("marker-start", "url(#arrow-reversed)");
        line.setAttribute("marker-end", "url(#arrow)");

        text.setAttribute("x", String((end.x+start.x)/2))
        text.setAttribute("y", String((end.y+start.y)/2))
        text.setAttribute("fill", "white")
        text.setAttribute("font-size", "25")
        text.setAttribute("font-weight", "bold")
        text.setAttribute("stroke", "#323d48")
        text.setAttribute("stroke-width", "1.5")
        text.innerHTML='0'

        svg.appendChild(line);
        svg.appendChild(text);

        startClick = null;
        endClick = null;
    }
</script>

<main class="overflow-auto w-full bg-gray-800 flex justify-center items-center relative rounded-sm">
   <button class="contents cursor-default" on:click={handleClick}>
        <svg width="500px" height="500px" class="bg-gray-400 flex-shrink-0 flex-grow-0" bind:this={svg}>
            <defs>
                <desc>Define the marker</desc>
                <marker id="arrow" refX="4" refY="3" markerWidth="6" markerHeight="6" orient="auto" stroke="black">
                    <path d="M 0 0 L 4 3 L 0 6 Z"></path>
                </marker>

                <marker id="arrow-reversed" refX="4" refY="3" markerWidth="6" markerHeight="6" orient="auto" stroke="black">
                    <path d="M 6 0 L 2 3 L 6 6 Z"></path>
                </marker>
            </defs>

            {#each graph as node}
                {#if node.cell}
                    <circle cx={node.cell.x}
                            cy={node.cell.y}
                            r={Math.ceil(cellSize/2)}
                            class="fill-anzac-400 stroke-anzac-500 stroke-2"
                    />

                    <text x={node.cell.x}
                          y={node.cell.y}
                          text-anchor="middle"
                          alignment-baseline="middle"
                          font-size="{cellSize/2.7}"
                          fill="purple"
                          class="fill-bunker-950 font-bold"
                    >
                        {#if node.isSource}
                            S
                        {:else if node.isSink}
                            T
                        {:else}
                            N{node.idx}
                        {/if}
                    </text>
                {/if}
            {/each}
        </svg>
    </button>
</main>
