<script lang="ts">
    import {saveAs} from 'file-saver';
    import {Eraser, Folder, Import, PencilRuler, PlusCircle, Pointer, Save, Workflow} from "lucide-svelte";
    import {action, AppAction, graphLines, graphNodes} from "$lib/stores";
    import {type GraphLine, GraphNode, LineType} from "$lib";

    function saveXml(){
        let xmlDoc = document.implementation.createDocument(null, 'automaton', null);
        let root= xmlDoc.documentElement;

        $graphNodes.forEach((node, index)=>{
            let state = xmlDoc.createElement('state');
            state.setAttribute('id', `${index}`);
            state.setAttribute('name', `${node.name}`);

            let x = xmlDoc.createElement('x');
            x.textContent=`${node.point.x}`;
            let y = xmlDoc.createElement('y');
            y.textContent=`${node.point.y}`;

            state.appendChild(x)
            state.appendChild(y)
            if(node.isSource){
                let initial = xmlDoc.createElement('initial')
                state.appendChild(initial)
            } else if(node.isSink){
                let final = xmlDoc.createElement('final');
                state.appendChild(final);
            }

            root.appendChild(state);
        })

        $graphLines.forEach((line)=>{
            let transition = xmlDoc.createElement('transition');

            let from = xmlDoc.createElement('from');
            from.textContent=`${line.node1}`

            let to = xmlDoc.createElement('to');
            to.textContent=`${line.node2}`

            let read = xmlDoc.createElement('read')
            read.textContent=`${line.weight}`

            transition.appendChild(from);
            transition.appendChild(to);
            transition.appendChild(read);

            if(line.type===LineType.bidirectional){
                let bi = xmlDoc.createElement('bi');
                transition.appendChild(bi);
            }

            root.appendChild(transition)
        })

        let xmlString = new XMLSerializer().serializeToString(xmlDoc);

        let file = new File([xmlString], 'graph.xml',{type:'text/xml; charset=utf-8'})
        saveAs(file);
    }

    function loadFile(){
        let input=document.createElement('input');
        input.type='file';
        input.accept='text/xml'
        input.click();

        input.onchange=()=>{
            if(input.files && input.files.length>0){
                importFileData(input.files[0]);
            }
        }
    }

    async function importFileData(file:File){
        let reader = new FileReader();
        reader.onload=function (event) {
            if(event.target){
                let xmlString=event.target.result;

                if(xmlString){
                    $graphNodes=[];
                    $graphLines=[];

                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(xmlString.toString(), "application/xml");
                    let automaton = xmlDoc.getElementsByTagName('automaton')[0];
                    let childNodes = Array.from(automaton.childNodes);
                    childNodes.forEach((node) => {
                        if(node.nodeName==='state'){
                            saveNode(node);
                        } else if(node.nodeName==='transition'){
                            saveLine(node)
                        }
                    });
                }
            }
        }

        reader.readAsText(file);
    }

    function saveNode(node:Node){
        if(node.nodeType===Node.ELEMENT_NODE){
            let element = node as Element;
            let name=element.getAttribute('name');
            let x:number|null=null;
            let y:number|null=null;
            let isSink:boolean=false;
            let isSource:boolean=false;

            element.childNodes.forEach((child)=>{
                if (child.nodeType===Node.ELEMENT_NODE){
                    let el = child as Element;
                    try{
                        if(el.tagName==='x' && el.textContent){
                            x=parseInt(el.textContent);
                        } else if(el.tagName==='y' && el.textContent){
                            y=parseInt(el.textContent);
                        } else if(el.tagName==='initial'){
                            isSource=true;
                            isSink=false;
                        } else if(el.tagName==='final'){
                            isSink=true;
                            isSource=false;
                        }
                    } catch (e){
                        x=y=null;
                    }
                }
            })

            if(x!==null && y!==null && name){
                $graphNodes=[...$graphNodes, new GraphNode({x,y}, name, isSource, isSink)]
            }
        }
    }

    function saveLine(node:Node){
        if(node.nodeType===Node.ELEMENT_NODE){
            let element = node as Element;
            let from:number|null=null;
            let to:number|null=null;
            let read:number|null=null;
            let bi:boolean=false;

            element.childNodes.forEach((child)=>{
                if (child.nodeType===Node.ELEMENT_NODE){
                    let el = child as Element;
                    try{
                        if(el.textContent){
                            if(el.tagName==='from'){
                                from=parseInt(el.textContent);
                            } else if(el.tagName==='to'){
                                to=parseInt(el.textContent);
                            } else if(el.tagName==='read'){
                                read=parseInt(el.textContent);
                            } else if(el.tagName==='bi'){
                                bi=true;
                            }
                        }
                    } catch (e){
                        from=to=read=null;
                    }
                }
            })

            if(from!==null && to!==null && read!==null){
                const line:GraphLine={
                    node1:from,
                    node2:to,
                    weight:read,
                    type:bi?LineType.bidirectional:LineType.unidirectional
                }

                $graphLines=[...$graphLines, line]
            }
        }
    }
</script>

<div class="navbar bg-bunker-950 relative z-50 flex-wrap flex-col lg:flex-row items-start border-b-2 border-b-gray-500">
    <div class="flex-1">
        <a href="/" class="btn btn-ghost text-2xl">
            MyGraph
        </a>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1 gap-4 flex-wrap">
            <li>
                <button class="btn btn-ghost {$action===AppAction.default?'border border-accent text-accent':''}"
                        on:click={()=>{$action=AppAction.default}}
                >
                    <Pointer/>
                    <span class="hidden lg:inline-flex">
                        Puntero
                    </span>
                </button>
            </li>
            <li>
                <button class="btn btn-ghost {$action===AppAction.addingNode?'border border-accent text-accent':''}"
                        on:click={()=>{$action=AppAction.addingNode}}
                >
                    <PlusCircle/>
                    <span class="hidden lg:inline-flex">
                        Agregar
                    </span>
                </button>
            </li>
            <li>
                <button class="btn btn-ghost {$action===AppAction.addingLink?'border border-accent text-accent':''}"
                        on:click={()=>{$action=AppAction.addingLink}}
                >
                    <Workflow/>
                    <span class="hidden lg:inline-flex">
                        Enlazar
                    </span>
                </button>
            </li>

            <li>
                <button class="btn btn-ghost {$action===AppAction.editing?'border border-accent text-accent':''}"
                        on:click={()=>{$action=AppAction.editing}}
                >
                    <PencilRuler/>
                    <span class="hidden lg:inline-flex">
                        Editar
                    </span>
                </button>
            </li>
            <li>
                <button class="btn btn-ghost {$action===AppAction.removing?'border border-accent text-accent':''}"
                        on:click={()=>{$action=AppAction.removing}}
                >
                    <Eraser/>
                    <span class="hidden lg:inline-flex">
                        Borrar
                    </span>
                </button>
            </li>
            <li>
                <details>
                        <summary>
                        <Folder/>
                        <span class="hidden md:inline-flex">
                            Archivo
                        </span>
                    </summary>
                    <ul class="right-0 p-2 bg-base-100 rounded-t-none">
                        <li>
                            <button class="btn btn-ghost justify-start" on:click={loadFile}>
                                <Import size={20}/>
                                <span>
                                    Importar
                                </span>
                            </button>
                        </li>
                        <li>
                            <button class="btn btn-ghost justify-start" on:click={saveXml}>
                                <Save size={20}/>
                                <span>
                                    Guardar
                                </span>
                            </button>
                        </li>
                    </ul>
                </details>
            </li>
        </ul>
    </div>
</div>