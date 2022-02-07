import { BrowserModule } from '@angular/platform-browser';
import {
  NgModule,
  InjectionToken,
  APP_INITIALIZER,
  Injectable,
} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  StoreModule as NgRxStoreModule,
  ActionReducerMap,
  Store,
} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import Dexie from 'dexie';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  initializeDestinosViajesState,
  reducerDestinosViajes,
  DestinosViajesEffects,
  InitMyDataAction,
} from './models/destinos-viajes-state.model';

import { AppComponent } from '././app.component';
import { DestinoViajeComponent } from './components/destino-viaje/destino-viaje.component'; //'./destino-viaje/destino-viaje.component';
import { ListaDestinosComponent } from './components/lista-destinos/lista-destinos.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { FormDestinoViajeComponent } from './components/form-destino-viaje/form-destino-viaje.component';
import { StoreModule } from '@ngrx/store';
import { environment } from '../environments/environment';
import { DestinosViajesState } from './models/destinos-viajes-state.model';
import { LoginComponent } from './components/login/login/login.component';
import { ProtectedComponent } from './components/protected/protected/protected.component';
import { UsuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado.guard';
import { AuthService } from './services/auth.service';
// import { DestinosApiClient } from './components/api-client/destinos-api-client.model';
import { VuelosMainComponentComponent } from './components/vuelos/vuelos-main/vuelos-main.component';
import { VuelosMasInfoComponentComponent } from './components/vuelos/vuelos-mas-info/vuelos-mas-info.component';
import { VuelosDetalleComponent } from './components/vuelos/vuelos-detalle/vuelos-detalle.component';
import { VuelosComponentComponent } from './components/vuelos/vuelos/vuelos.component';
import { ReservasModule } from './reservas/reservas.module';
import { DestinoViaje } from './models/destino-viaje.model';
// import { init_app } from './components/api-client/app-config';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'dexie';
import { flatMap, from } from 'rxjs';

//app config
export interface AppConfig {
  apoEndpoint: String;
}

const APP_CONFIG_VALUE: AppConfig = {
  apoEndpoint: 'http://localhost:3000',
};
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
//fin app config

export const childrenRoutesVuelos: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: VuelosMainComponentComponent },
  { path: 'mas-info', component: VuelosMasInfoComponentComponent },
  { path: ':id', component: VuelosDetalleComponent },
];
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: ListaDestinosComponent },
  { path: 'destino/:id', component: DestinoDetalleComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [UsuarioLogueadoGuard],
  },
  {
    path: 'vuelos',
    component: VuelosComponentComponent,
    canActivate: [UsuarioLogueadoGuard],
    children: childrenRoutesVuelos,
  },
];

// redux init
export interface AppState {
  destinos: DestinosViajesState;
}

/*const reducers: ActionReducerMap<AppState>={
  destinos: reducerDestinosViajes
};*/

let reducersInitialState = {
  destinos: initializeDestinosViajesState(),
};
// fin redux init

@Injectable()
export class AppLoadService {
  constructor(private store: Store<AppState>, private http: HttpClient) {}
  async initializeDestinosViajesState(): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders({
      'X-API-TOKEN': 'token-securidad',
    });
    const req = new HttpRequest('GET', APP_CONFIG_VALUE.apoEndpoint + '/my', {
      headers: headers,
    });
    const response: any = await this.http.request(req).toPromise();
    this.store.dispatch(new InitMyDataAction(response.body));
  }
}

export function init_app(appLoadService: AppLoadService): () => Promise<any> {
  return () => appLoadService.initializeDestinosViajesState();
}

//dexie db
export class Translation {
  constructor(
    public id: number,
    public lang: string,
    public key: string,
    public value: string
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class MyDatabase extends Dexie {
  destinos!: Dexie.Table<DestinoViaje, number>;
  translations!: Dexie.Table<Translation, number>;
  constructor() {
    super('MyDatabase');
    this.version(1).stores({
      destinos: '++id,nombre, imagenurl',
    });
    this.version(2).stores({
      destinos: '++id,nombre, imagenurl',
      translations: '++id, lang, key, value',
    });
  }
}

export const db = new MyDatabase();
//fin dexie

//i18n ini
class TranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<any> {
    const promise = db.translations
      .where('lang')
      .equals(lang)
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          return this.http
            .get<Translation[]>(
              APP_CONFIG_VALUE.apoEndpoint + '/api/translation?lang=' + lang
            )
            .toPromise()
            .then((apiResults) => {
              db.translations.bulkAdd(apiResults);
              return apiResults;
            });
        }
        return results;
      })
      .then((traducciones) => {
        console.log('traduccines cargadas');
        console.log(traducciones);
        return traducciones;
      })
      .then((traducciones) => {
        return traducciones.map((t) => ({ [t.key]: t.value }));
      });
    return from(promise).pipe(flatMap((elems) => from(elems)));
  }
}

function HttpLoaderFactory(http: HttpClient) {
  return new TranslationLoader(http);
}

//end i18n

@NgModule({
  declarations: [
    AppComponent,
    DestinoViajeComponent,
    ListaDestinosComponent,
    DestinoDetalleComponent,
    FormDestinoViajeComponent,
    LoginComponent,
    ProtectedComponent,
    LoginComponent,
    ProtectedComponent,
    VuelosComponentComponent,
    VuelosMainComponentComponent,
    VuelosMasInfoComponentComponent,
    VuelosComponentComponent,
    VuelosMainComponentComponent,
    VuelosMasInfoComponentComponent,
    VuelosDetalleComponent,
    //NgRxStoreModule
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    NgRxStoreModule.forRoot(reducerDestinosViajes),
    EffectsModule.forRoot([DestinosViajesEffects]),
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    ReservasModule,
    TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory:(HttpLoaderFactory),
        deps:[HttpClient]
      }
    }),
  ],
  providers: [
    AuthService,
    UsuarioLogueadoGuard,
    { provide: APP_CONFIG, useValue: APP_CONFIG_VALUE },
    AppLoadService,
    MyDatabase,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppLoadService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
