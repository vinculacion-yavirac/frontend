import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EncuestaModel } from 'src/app/models/estudiante/encuesta/encuesta.model';
import { RespuestaModel } from 'src/app/models/estudiante/encuesta/respuesta.model';
import { EncuestaHttpService } from 'src/app/service/estudiante/encuesta/encuesta-http.service';

@Component({
  selector: 'app-encuesta-combobox',
  templateUrl: './encuesta-combobox.component.html',

})
export class EncuestaComboboxComponent implements OnInit {

  constructor(private encuestaHttpService:EncuestaHttpService,) { }

  encuestas: EncuestaModel[] = [];
  @Output() encuestaIdEmmiter = new EventEmitter<number>();
  @Input() encuestaId: number = 0;

  addEntity: RespuestaModel = {
    id: 0,
    descripcion: '',
    preguntas_id: 0,
    encuestas_id: 0
  };

  ngOnInit(): void {
    this.findAll();
  }

  public findAll() :void{
    this.encuestaHttpService.getAll().subscribe(

      (respose) => this.encuestas = respose
    )
  }
  public onSelect(id:string){
    this.encuestaIdEmmiter.emit(parseInt(id));
  }

}
