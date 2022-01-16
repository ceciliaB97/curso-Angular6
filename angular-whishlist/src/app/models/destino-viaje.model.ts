export class DestinoViaje {
    private selected: boolean = false;
    public servicios: string[];
    nombre: string = "";
    imagenUrl: string = "";

    constructor(public n: string, public u: string) { 
        this.nombre = n;
        this.imagenUrl = u;
        this.servicios = ['pileta', 'desayuno'];
    }

    isSelected(): boolean {
        return this.selected;
    }
    setSelected(s: boolean) {
        this.selected = s;
    }
}
