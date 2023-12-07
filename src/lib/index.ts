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

export class Graph{
    #nodes:GraphNode[]
    readonly #nodeLinks:number[][];
    #size:number
    constructor() {
        this.#size=0;
        this.#nodeLinks=[];
        this.#nodes=[];
    }

    #resetLinks(idx:number){
        for (let i = 0; i < this.#nodeLinks.length; i++) {
            for (let j = 0; j < this.#nodeLinks.length; j++) {
                if (i===idx || j===idx){
                    this.#nodeLinks[i][j]=-1;
                }
            }
        }
    }
    add(cell:CanvasCeil, value:number|null=0){
        let add=true;
        this.#nodes.forEach((node)=>{
            if (node.cell && node.cell.x===cell.x && node.cell.y===cell.y){
                add=false;
                return;
            }
            else if (node.cell===null){
                node.cell=cell;
                node.value=value;

                add=false;
                return;
            }
        });

        if (add){
            this.#nodes.push(new GraphNode(cell, this.#size, value, false))
            const column:number[]=[]
            for (let i = 0; i < this.#nodeLinks.length; i++) {
                column.push(-1);
            }

            this.#nodeLinks.concat(column)//Nueva columna
            this.#nodeLinks.concat([column])//Nueva fila
        }

        ++this.#size;
    }

    link(cell1:CanvasCeil, cell2:CanvasCeil, weight:number){
        if(weight<0){
            throw Error('El peso del enlace no puede ser un número negativo.')
        }

        let idx1:number|null=null;
        let idx2:number|null=null;

        this.#nodes.forEach((node)=>{
            if (node.cell===cell1){
                idx1=node.idx;
            } else if (node.cell===cell2){
                idx2=node.idx
            }

            if (idx1 && idx2){
                return;
            }
        })

        if (idx1 && idx2){
            this.#nodeLinks[idx1][idx2]=weight;
        }

        else{
            throw Error('Los nodos elegidos no se encuentran registrados.')
        }
    }

    unlink(idx1:number, idx2:number){
        this.#nodeLinks[idx1][idx2]=-1;
    }

    remove(idx:number){
        this.#resetLinks(idx);
        this.#nodes[idx].cell=null;
    }

    get nodes(){return this.#nodes};
}
