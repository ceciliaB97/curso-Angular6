import { InjectionToken , Injectable } from '@angular/core';
import {  Store } from '@ngrx/store';
import { HttpClientModule, HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import Dexie from 'dexie';
import { DestinoViaje } from '../models/destino-viaje.model';



import {
    DestinosViajesState,
    InitMyDataAction
  } from '../models/destinos-viajes-state.model';


// app config
export interface AppConfig {
    apiEndpoint: String;
  }
  const APP_CONFIG_VALUE: AppConfig = {
    apiEndpoint: 'http://localhost:3000'
  };
  export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
  // fin app config
  
  // app init
  export function init_app(appLoadService: AppLoadService): () => Promise<any>  {
    return () => appLoadService.intializeDestinosViajesState();
  }

// redux init
export interface AppState {
    destinos: DestinosViajesState;
  }

  @Injectable()
class AppLoadService {
  constructor(private store: Store<AppState>, private http: HttpClient) { }
  async intializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({'X-API-TOKEN': 'token-seguridad'});
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apiEndpoint + '/my', { headers: headers });
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}


// dexie db
export class Translation {
    constructor(public id: number, public lang: string, public key: string, public value: string) {}
  }

@Injectable({
    providedIn: 'root'
  })
  export class MyDatabase extends Dexie {
    destinos: Dexie.Table<DestinoViaje, number>;
    translations: Dexie.Table<Translation, number>;
    constructor () {
        super('MyDatabase');
        this.version(1).stores({
          destinos: '++id, nombre, imagenUrl'
        });
        this.version(2).stores({
          destinos: '++id, nombre, imagenUrl',
          translations: '++id, lang, key, value'
        });
    }
  }
  
  export const db = new MyDatabase();
  // fin dexie db