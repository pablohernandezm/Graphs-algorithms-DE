<script lang="ts">
    import {action, AppAction, graphLines, graphNodes, selectedLine} from "$lib/stores";
    import {GraphNode, LineType} from "$lib";
    import {fixPointsToRadius} from "$lib";
    export let modal:HTMLDialogElement;

    const lineCordsHelper = (node1:GraphNode, node2:GraphNode)=>{
        const fixed= fixPointsToRadius(
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

    const lineEventHandler=(idx:number)=>{
        if($action===AppAction.removing){
            $graphLines=$graphLines.toSpliced(idx, 1);
        } else if($action===AppAction.editing){
            $selectedLine=idx;
            modal.showModal();
        }
    }

    const labelCords =(node1:GraphNode, node2:GraphNode)=>{
        const {start, end}=fixPointsToRadius(
            {x:node1.point.x, y:node1.point.y},
            {x:node2.point.x, y:node2.point.y}
        )

        return{
            x:String((end.x+start.x)/2),
            y:String((end.y+start.y)/2)
        }
    }
</script>

{#each $graphLines as line, i (i)}
    <line {...lineCordsHelper($graphNodes[line.node1], $graphNodes[line.node2])}
          marker-start="{line.type===LineType.bidirectional? 'url(#arrow-reversed)':''}"
          marker-end="url(#arrow)"
          class="stroke-black stroke-[2] {$action===AppAction.removing || $action===AppAction.editing?'cursor-pointer':''}"
          id="link-{$graphNodes.length}-{line.type}"
          role="presentation"
          on:click|stopPropagation={()=>{
                        lineEventHandler(i);
          }}
    />

    <text class="fill-white font-bold text-3xl stroke-black stroke-2 {$action===AppAction.removing || $action===AppAction.editing?'cursor-pointer':''}"
          {...labelCords($graphNodes[line.node1], $graphNodes[line.node2])}
          role="presentation"
          on:click|stopPropagation={()=>{
                        lineEventHandler(i)
                      }}
    >
        {line.weight}
    </text>
{/each}