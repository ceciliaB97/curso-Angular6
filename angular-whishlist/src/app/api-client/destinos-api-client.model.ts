import {Injectable, Inject, forwardRef} from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { Store } from '@ngrx/store';
import {
    NuevoDestinoAction,
    ElegidoFavoritoAction
  } from '../models/destinos-viajes-state.model';
import {AppState, APP_CONFIG, AppConfig, MyDatabase, db} from './app-config';
import { HttpRequest, HttpHeaders, HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class DestinosApiClient {

  constructor(
    private store: Store<AppState>) {
  }

  add(d: DestinoViaje) {
    this.store.dispatch(new NuevoDestinoAction(d));
  }

  elegir(d: DestinoViaje) {
    // aqui incovariamos al servidor
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }

}