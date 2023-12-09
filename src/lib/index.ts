export interface Point{
    x:number
    y:number
}

export enum LinkType{
    unidirectional=0, bidirectional=1
}
export interface GraphLink{
    node1:number,
    node2:number,
    weight:number,
    type:LinkType
}

//Inspirado por https://medium.com/tebs-lab/implementations-of-graphs-92eb7f121793
export class GraphNode{
    #value:number|null;
    #point:Point;
    isSink:boolean;
    isSource:boolean;

    constructor(point:Point, value:number|null,  isSource:boolean=false, isSink:boolean=false) {
        this.#value=value;
        this.#point=point;
        this.isSink=isSink;
        this.isSource=isSource;
    }

    set point(point:Point){this.#point=point;}
    get point(){return this.#point;}
    set value(value:number|null){this.#value=value;}
    get value(){return this.#value;}
}
