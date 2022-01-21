import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { DestinosApiClient } from './../models/destinos-api-client.model';


@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css'],
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;

  constructor(private destinosApiClient: DestinosApiClient) {
    this.onItemAdded = new EventEmitter();
  }

  ngOnInit(): void {
  }

  agregado(d: DestinoViaje) {
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);

  }

  elegido(d:DestinoViaje) {
    this.destinosApiClient.elegir(d);
  }

}
