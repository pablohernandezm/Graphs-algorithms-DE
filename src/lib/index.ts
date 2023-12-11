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