import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-destino-viaje',
  templateUrl: './destino-viaje.component.html',
  styleUrls: ['./destino-viaje.component.css']
})
export class DestinoViajeComponent implements OnInit {
  @Input() destinos: string;
  constructor() {
    this.destinos = Input();
  }

  ngOnInit(): void {
  }

}
