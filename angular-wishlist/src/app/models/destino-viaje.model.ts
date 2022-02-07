import {v4 as uuid} from 'uuid';

export class DestinoViaje {
    private selected: boolean = false;
    public servicios: string[];
    id = uuid();
    public votes = 0;
    nombre: string = "";
    imagenUrl: string = "";

    constructor(public n: string, public u: string, public votesNum: number) {
        this.nombre = n;
        this.imagenUrl = u;
        this.servicios = ['pileta', 'desayuno'];
        this.votes = votesNum;
    }

    isSelected(): boolean {
        return this.selected;
    }
    setSelected(s: boolean) {
        this.selected = s;
    }
    voteUp(): any {
        this.votes++;
    }
    voteDown(): any {
        this.votes--;
    }
}
