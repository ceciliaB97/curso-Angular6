import { Injectable, Inject, forwardRef } from '@angular/core';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { Store } from '@ngrx/store';
import {
  NuevoDestinoAction,
  ElegidoFavoritoAction,
} from '../../models/destinos-viajes-state.model';
import { AppState, APP_CONFIG, AppConfig, MyDatabase, db } from './app-config';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class DestinosApiClient {
  destinos!: DestinoViaje[];

  constructor(
    private store: Store<AppState>,
    @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig,
    private http: HttpClient
  ) {
    //this.destinos=[];
    this.store
      .select((state) => state.destinos)
      .subscribe((data) => {
        console.log('destino sub store');
        console.log(data);
        this.destinos = data.items;
      });
    this.store.subscribe((data) => {
      console.log('all store');
      console.log(data);
    });
  }

  // add(d: DestinoViaje): void {
  //   this.store.dispatch(new NuevoDestinoAction(d));
  // }

  add(d: DestinoViaje) {
    const headers: HttpHeaders = new HttpHeaders({
      'X-API-TOKEN': 'token-seguridad',
    });
    const req = new HttpRequest(
      'POST',
      this.config.apiEndpoint + '/my',
      { nuevo: d.n },
      { headers: headers }
    );
    this.http.request(req).subscribe((data: HttpResponse<{}>) => {
      if (data.status === 200) {
        this.store.dispatch(new NuevoDestinoAction(d));
        const myDb = db;
        myDb.destinos.add(d);
        console.log('todos los destino de la db');
        myDb.destinos.toArray().then((destinos) => console.log(destinos));
      }
    });

    // this.destinos.push(d);
  }

  getById(id: any): DestinoViaje {
    return this.destinos.filter(function (d) {
      return d.id.toString() == id;
    })[0];
  }

  elegir(d: DestinoViaje): void {
    // aqui incovariamos al servidor
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }
}
