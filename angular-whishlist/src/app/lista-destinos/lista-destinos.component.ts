import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { DestinosApiClient } from '../api-client/destinos-api-client.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.module';
import { state } from '@angular/animations';
import { ElegidoFavoritoAction, NuevoDestinoAction } from '../models/destinos-viajes-state.model';


@Component({
  selector: 'app-lista-destinos',
  templateUrl: './lista-destinos.component.html',
  styleUrls: ['./lista-destinos.component.css'],
  providers: [DestinosApiClient]
})
export class ListaDestinosComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  destinosNuevos: any;
  updates: string[];

  constructor(private destinosApiClient: DestinosApiClient, private store: Store<AppState>) {
    this.onItemAdded = new EventEmitter();
    this.destinosNuevos = destinosApiClient.getAll();
    this.updates = [];
    this.store.select(state => state.destinos.favorito)
    .subscribe(d => {
      if (d != null) {
        this.updates.push('Se ha elegido a ' + d.nombre);
      }
    });

  }

  ngOnInit(): void {
  }

  agregado(d: DestinoViaje) {
    this.destinosApiClient.add(d);
    this.onItemAdded.emit(d);
    this.store.dispatch(new NuevoDestinoAction(d));
  }

  elegido(d: DestinoViaje) {
    this.destinosApiClient.elegir(d);
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }

}
