export class DestinoViaje {
    private selected: boolean = false;
    nombre: string = "";
    imagenUrl: string = "";

    constructor(public n: string, public u: string) { 
        this.nombre = n;
        this.imagenUrl = u;
    }

    isSelected(): boolean {
        return this.selected;
    }
    setSelected(s: boolean) {
        this.selected = s;
    }
}
