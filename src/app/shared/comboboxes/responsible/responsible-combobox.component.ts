import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResponsibleModels } from './responsible.models';
import { ResponsibleService } from './responsible.service';

@Component({
  selector: 'combobox-responsible',
  templateUrl: './responsible-combobox.component.html',
  styleUrls: ['./responsible-combobox.component.css']
})
export class ResponsibleComboboxComponent implements OnInit {

  constructor(
    private responsibleService: ResponsibleService
  ) {}

    responsibles: ResponsibleModels[] = [];
    @Output() responsibleIdEmitter = new EventEmitter<any>();
    @Input() responsibleId: any = 0;

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    this.responsibleService.getResponsible().subscribe(
      (response:any) => {this.responsibles = response.data.responsible;
       //console.log(response.data);
        }
    );

  }

    public onSelect(id:string){
      this.responsibleIdEmitter.emit(parseInt(id));
    }
}
