import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinosApiClient } from '../api-client/destinos-api-client.model';
import { DestinoViaje } from '../../models/destino-viaje.model';

/*
class DestinoApiClientViejo{
  getById(id:string):DestinoViaje{
    let flat!:DestinoViaje;
    console.log('llamado por la clase');
    return flat;
  }
  
}
interface AppConfig{
  apiEndpoint:String;
}
const APP_CONFIG_VALUE:AppConfig={
 apiEndpoint: 'mi_api.com'
};
const APP_CONFIG=new InjectionToken<AppConfig>('app.config');
class DestinoApiClientDecorated extends DestinoApiClient {
  constructor(@Inject(APP_CONFIG) private config: AppConfig,store:Store<AppState>) {
    super(store);
  }
  getBydId(id:string):DestinoViaje{
    console.log('llamando por la clase decorada');
    console.log('config'+ this.config.apiEndpoint);
    return super.getById(id);
  }
}*/

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css'],
  providers: [ DestinosApiClient]
})
export class DestinoDetalleComponent implements OnInit {
  destino!:DestinoViaje;
  style={
    sources:{
      world:{
        type: 'geojson',
        data:'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
      }},
      version:8,
      layers:[{
        'id': 'fill',
        'source':'world',
        'layout':{},
        'paint':{
          'fill-color':'#6F788A'
        }
      }]
  };

  constructor(
    private route: ActivatedRoute,
    private destinoApiClient: DestinosApiClient
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.destino = new DestinoViaje(
      'Buenos Aires',
      'https://www.freejpg.com.ar/asset/400/89/8959/F100027237.jpg',
      5
    );
    //this.destinoApiClient.getById(id);
  }
}
