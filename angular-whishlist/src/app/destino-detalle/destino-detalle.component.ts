import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinosApiClient } from '../api-client/destinos-api-client.model';
import { DestinoViaje } from '../models/destino-viaje.model';

@Component({
  selector: 'app-destino-detalle',
  templateUrl: './destino-detalle.component.html',
  styleUrls: ['./destino-detalle.component.css']
})
export class DestinoDetalleComponent implements OnInit {
  destino: DestinoViaje;

  constructor(private route: ActivatedRoute, private destinoApiClient: DestinosApiClient) { }

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    this.destino = new DestinoViaje('Buenos Aires', 'https://www.freejpg.com.ar/asset/400/89/8959/F100027237.jpg', 5);
    //this.destinoApiClient.getById(id);
  }

}
