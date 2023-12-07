<script lang="ts">
    import {Graph} from '$lib'
    import {onMount} from "svelte";
    const graph = new Graph();

    let canvas:HTMLCanvasElement
    let ctx:CanvasRenderingContext2D

    const n_cells=10;
    const cellSize=50;
    const gridSize=cellSize*n_cells;

    const updateAll = () => {
        drawGraph();
        window.requestAnimationFrame(updateAll)
    }

    const drawGraph = () => {
        for (let x = 0; x < n_cells; x++) {
            ctx.moveTo(x * cellSize, 0);
            ctx.lineTo(x * cellSize, cellSize*n_cells);
        }

        for (let y = 0; y < n_cells; y++) {
            ctx.moveTo(0, y * cellSize);
            ctx.lineTo(cellSize*n_cells, y * cellSize);
        }

        ctx.strokeStyle='lightgray'
        ctx.lineWidth=2;
        ctx.stroke();

        graph.nodes.forEach((node)=>{
            if (node.cell){
                const x = (node.cell.x*cellSize)-(cellSize/2);
                const y = (node.cell.y*cellSize)-(cellSize/2);

                ctx.beginPath();
                ctx.arc(x, y, cellSize/2, 0, 2*Math.PI)
                ctx.fillStyle='#003366';
                ctx.fill();
                ctx.closePath();

                // Dibuja el borde del círculo con color blanco y ancho de 1 píxel
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 1;
                ctx.stroke();

                // Escribe el texto en el centro del círculo
                const text = `N${node.idx+1}`;
                ctx.font = '20px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle='white'
                ctx.fillText(text, x, y);
            }
        })
    }

    onMount(()=>{
        const context = canvas.getContext('2d');
        if (context){
            ctx=context;
            ctx.lineCap='round';
            ctx.translate(0.5, 0.5);
            window.requestAnimationFrame(updateAll);
        }
    })
</script>

<canvas bind:this={canvas} class="aspect-square border border-zinc-400" width={gridSize} height={gridSize} on:click={(e)=>{
    //console.log(`${Math.ceil(n_cells*(e.clientX/gridSize))}`)/*
    const x = Math.ceil(n_cells*(e.clientX/gridSize));
    const y = Math.ceil(n_cells*(e.clientY/gridSize));

    graph.add({x, y}, 5)
}}>
</canvas>