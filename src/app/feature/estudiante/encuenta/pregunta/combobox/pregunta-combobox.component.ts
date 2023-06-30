import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PreguntaModel } from 'src/app/models/estudiante/encuesta/pregunta.model';
import { PreguntaHttpService } from 'src/app/service/estudiante/encuesta/pregunta-http.service';

@Component({
  selector: 'app-pregunta-combobox',
  templateUrl: './pregunta-combobox.component.html',

})
export class PreguntaComboboxComponent implements OnInit {

  constructor(private preguntaHttpService:PreguntaHttpService) { }

  preguntas: PreguntaModel[] = [];
  @Output() preguntaIdEmmiter = new EventEmitter<number>();
  @Input() preguntaId: number = 0;


  ngOnInit(): void {
    this.findAll();
  }

  public findAll() :void{
    this.preguntaHttpService.getAllP().subscribe(

      (respose) => this.preguntas = respose
    )
  }
  public onSelect(id:string){
    this.preguntaIdEmmiter.emit(parseInt(id));
  }

}
