export interface CanvasCeil{
    x:number
    y:number
}



//Inspirado por https://medium.com/tebs-lab/implementations-of-graphs-92eb7f121793
export class GraphNode{
    #value:number|null;
    #cell:CanvasCeil|null;
    #idx:number;
    isSink:boolean;
    isSource:boolean;

    constructor(cell:CanvasCeil, idx:number, value:number|null,  isSource:boolean=false, isSink:boolean=false) {
        this.#value=value;
        this.#cell=cell;
        this.#idx=idx;
        this.isSink=isSink;
        this.isSource=isSource;
    }

    set cell(cell:CanvasCeil|null){this.#cell=cell;}
    get cell(){return this.#cell;}
    set idx(idx:number){this.#idx=idx;}
    get idx(){return this.#idx}
    set value(value:number|null){this.#value=value;}
    get value(){return this.#value;}
}
