import {diameter} from "$lib/stores";

export interface Point{
    x:number
    y:number
}

export enum LineType{
    unidirectional=0, bidirectional=1
}
export interface GraphLine {
    node1:number,
    node2:number,
    weight:number,
    type:LineType
}

export class GraphNode{
    #point:Point;
    isSink:boolean;
    isSource:boolean;
    name:string;

    constructor(point:Point,  name:string, isSource:boolean=false, isSink:boolean=false) {
        this.#point=point;
        this.isSink=isSink;
        this.isSource=isSource;
        this.name=name;
    }
    set point(point:Point){this.#point=point;}
    get point(){return this.#point;}
}

export function fixPointsToRadius(start:Point, end:Point){
    let d:number=50;
    diameter.subscribe((value)=>(d=value))

    const r = (d/2)+10;

    const dx = end.x-start.x;
    const dy = end.y-start.y;
    const theta = Math.atan2(dy,dx);

    start.y=start.y+r*Math.sin(theta);
    start.x=start.x+r*Math.cos(theta);

    end.x=end.x-r*Math.cos(theta);
    end.y=end.y-r*Math.sin(theta);

    return {start, end}
}

export function fordFulkerson(graphNodes: GraphNode[], graphLines: GraphLine[]): number {
    const sourceNode = graphNodes.find(node => node.isSource);
    const sinkNode = graphNodes.find(node => node.isSink);

    if (!sourceNode || !sinkNode) {
        console.error('No se encontró el nodo fuente o sumidero.');
        return 0;
    }

    const source = graphNodes.indexOf(sourceNode);
    const sink = graphNodes.indexOf(sinkNode);

    const residualGraph = initializeResidualGraph(graphLines);
    let maxFlow = 0;

    while (graphNodes.length>0) {
        const { path, minCapacity } = findAugmentingPath(residualGraph, source, sink);

        if (!path) {
            break;
        }

        for (let i = 0; i < path.length - 1; i++) {
            const node1 = path[i];
            const node2 = path[i + 1];

            const forwardEdge = residualGraph.find(edge => edge.node1 === node1 && edge.node2 === node2);
            const backwardEdge = residualGraph.find(edge => edge.node1 === node2 && edge.node2 === node1);

            if (forwardEdge) {
                forwardEdge.weight -= minCapacity;
            }

            if (backwardEdge) {
                backwardEdge.weight += minCapacity;
            } else {
                // Si no existe la arista residual, créala
                residualGraph.push({ node1: node2, node2: node1, weight: minCapacity, type: LineType.bidirectional });
            }
        }

        maxFlow += minCapacity;
    }

    return maxFlow;
}

function initializeResidualGraph(graphLines: GraphLine[]): GraphLine[] {
    const residualGraph: GraphLine[] = [];

    for (const edge of graphLines) {
        residualGraph.push({ ...edge });
        // Asegúrate de agregar también las aristas residuales iniciales
        residualGraph.push({ node1: edge.node2, node2: edge.node1, weight: 0, type: LineType.bidirectional });
    }

    return residualGraph;
}

function findAugmentingPath(residualGraph: GraphLine[], source: number, sink: number): { path: number[] | null, minCapacity: number } {
    const visited = Array(residualGraph.length).fill(false);
    const queue = [source];
    const parent: Record<number, number> = {};
    let minCapacity = Number.POSITIVE_INFINITY;

    while (queue.length > 0) {
        const currentNode = queue.shift() as number;
        visited[currentNode] = true;

        for (const edge of residualGraph) {
            if (edge.node1 === currentNode && !visited[edge.node2] && edge.weight > 0) {
                queue.push(edge.node2);
                parent[edge.node2] = currentNode;
                minCapacity = Math.min(minCapacity, edge.weight);

                if (edge.node2 === sink) {
                    // Hemos alcanzado el nodo de destino, construimos el camino.
                    const path = reconstructPath(parent, source, sink);
                    return { path, minCapacity };
                }
            }
        }
    }

    return { path: null, minCapacity: 0 };
}

function reconstructPath(parent: Record<number, number>, source: number, sink: number): number[] {
    const path: number[] = [];
    let currentNode = sink;

    while (currentNode !== source) {
        path.unshift(currentNode);
        currentNode = parent[currentNode];
    }

    path.unshift(source);
    return path;
}




export function dijkstra(graphNodes: GraphNode[], graphLines: GraphLine[], startNodeIndex: number): { distances: number[], previousNodes: number[] } {
    const n = graphNodes.length;

    const distances: number[] = Array(n).fill(Number.POSITIVE_INFINITY);
    const previousNodes: number[] = Array(n).fill(-1); // Inicializa todos los nodos anteriores como -1
    const visited: boolean[] = Array(n).fill(false);

    distances[startNodeIndex] = 0;

    for (let i = 0; i < n - 1; i++) {
        const minDistNode = minDistance(distances, visited);

        visited[minDistNode] = true;

        for (let j = 0; j < n; j++) {
            console.log("hola1")
            if (!visited[j] && graphLines.some(line => (line.node1 === minDistNode && line.node2 === j) || (line.node1 === j && line.node2 === minDistNode))) {
                const weight = graphLines.find(line => (line.node1 === minDistNode && line.node2 === j) || (line.node1 === j && line.node2 === minDistNode))?.weight || 0;
                const totalDist = distances[minDistNode] + weight;
                console.log(j)

                if (totalDist < distances[j]) {
                    distances[j] = totalDist;
                    console.log(j)
                    previousNodes[j] = minDistNode;
                }
            }
        }
    }

    return { distances, previousNodes };
}

function minDistance(dist: number[], visited: boolean[]): number {
    let min = Number.POSITIVE_INFINITY;
    let minIndex = -1;

    for (let i = 0; i < dist.length; i++) {
        if (!visited[i] && dist[i] <= min) {
            min = dist[i];
            minIndex = i;
        }
    }

    return minIndex;
}