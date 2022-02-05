import { Component, forwardRef, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { DestinoViaje } from '../../models/destino-viaje.model';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { AppConfig, APP_CONFIG } from '../api-client/app-config';

@Component({
  selector: 'app-form-destino-viaje',
  templateUrl: './form-destino-viaje.component.html',
  styleUrls: ['./form-destino-viaje.component.css']
})
export class FormDestinoViajeComponent implements OnInit {
  @Output() onItemAdded: EventEmitter<DestinoViaje>;
  fg: FormGroup;
  minLongitud = 5;
  searchResult!: any; //string[];

  constructor(fb: FormBuilder, @Inject(forwardRef(()=>APP_CONFIG)) private config: AppConfig) { 
    this.onItemAdded=new EventEmitter();
    this.fg=fb.group({
      nombre:['', [Validators.required, Validators.minLength(5), Validators.pattern("[a-zA-Z]*")]],
      url:['']
    });

    this.fg.valueChanges.subscribe((form:any)=>{
      console.log('cambio el formulario',form);
    });
    this.fg.controls['nombre'].valueChanges.subscribe((value:string)=>{
      console.log('nombre cambio:', value);
    });
  }

  ngOnInit(): void {
    let elemNombre=<HTMLInputElement>document.getElementById('nombre');
   fromEvent(elemNombre, 'input')
   .pipe(
     map((event) => (event.target as HTMLInputElement).value),
     filter(text=>text.length>2),
     debounceTime(200),
     distinctUntilChanged(),
     switchMap((text:string)=> ajax(`${this.config.apiEndpoint}/ciudades?q=${text}`))
   ).subscribe(AjaxResponse=>this.searchResult=AjaxResponse.response);
  }

  guardar(nombre:string, url:string):boolean{
    const d= new DestinoViaje(nombre, url, 0);
    this.onItemAdded.emit(d);
    return false;
  }

  /*nombreValidator(control: FormControl): {[s: string]: boolean } {
    let l =control.value.toString().trim().length ;
    if (l>0 && l<5) {
      return {invalidNombre: true};
    }
    return "null";
  }*/

}
