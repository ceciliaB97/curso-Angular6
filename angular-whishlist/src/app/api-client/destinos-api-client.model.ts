import {Injectable, Inject, forwardRef} from '@angular/core';
import { DestinoViaje } from '../models/destino-viaje.model';
import { Store } from '@ngrx/store';
import {
    NuevoDestinoAction,
    ElegidoFavoritoAction
  } from '../models/destinos-viajes-state.model';
import {AppState, APP_CONFIG, AppConfig, MyDatabase, db} from './app-config';
import { HttpRequest, HttpHeaders, HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';

@Injectable()
export class DestinosApiClient { //injectable service
  destinos: DestinoViaje[] = [];

  constructor(
    private store: Store<AppState>,
    @Inject(forwardRef(() => APP_CONFIG)) private config: AppConfig,
    private http: HttpClient
  ) {
    this.store
      .select(state => state.destinos)
      .subscribe((data) => {
        console.log('destinos sub store');
        console.log(data);
        this.destinos = data.items;
      });
    this.store
      .subscribe((data) => {
        console.log('all store');
        console.log(data);
      });
  }

  add(d: DestinoViaje) {
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    /*const req = new HttpRequest('POST', this.config.apiEndpoint + '/my', { nuevo: d.nombre }, { headers: headers });
    this.http.request(req).subscribe((data: any) => {
      if (data.status === 200) {
        this.store.dispatch(new NuevoDestinoAction(d));
        const myDb = db;
        myDb.destinos.add(d);
        console.log('todos los destinos de la db!');
        myDb.destinos.toArray().then(destinos => console.log(destinos))
      }
    });*/


    this.http.post<any>( this.config.apiEndpoint + '/my', { nuevo: d.nombre }, { headers: headers }).
    subscribe(data => {
      if (data.status === 200) {
        this.store.dispatch(new NuevoDestinoAction(d));
        const myDb = db;
        myDb.destinos.add(d);
        console.log('todos los destinos de la db!');
        myDb.destinos.toArray().then(destinos => console.log(destinos))
      }
    })
  }

  getById(id: String): DestinoViaje {
    return this.destinos.filter(function(d) { return id.toString() === id; })[0];
  }

  getAll(): DestinoViaje[] {
    return this.destinos;
  }

  elegir(d: DestinoViaje) {
    // aqui incovariamos al servidor
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }
}