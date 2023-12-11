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
    #value:number|null;
    #point:Point;
    isSink:boolean;
    isSource:boolean;
    name:string;

    constructor(point:Point, value:number|null,  name:string, isSource:boolean=false, isSink:boolean=false) {
        this.#value=value;
        this.#point=point;
        this.isSink=isSink;
        this.isSource=isSource;
        this.name=name;
    }
    set point(point:Point){this.#point=point;}
    get point(){return this.#point;}
    set value(value:number|null){this.#value=value;}
    get value(){return this.#value;}
}
