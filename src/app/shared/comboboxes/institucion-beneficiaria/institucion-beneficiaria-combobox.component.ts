import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InstitucionBeneficiariaModels } from '../../../models/institucion-beneficiaria/institucion-beneficiaria.models';
import { InstitucionBeneficiariaHttpService } from '../../../service/institucion-beneficiaria/institucion-beneficiaria-http.service';

@Component({
  selector: 'combobox-institucion-beneficiaria',
  templateUrl: './institucion-beneficiaria-combobox.component.html',
  styleUrls: ['./institucion-beneficiaria-combobox.component.css']
})
export class InstitucionBeneficiariaComboboxComponent implements OnInit {

  constructor(
    private institucionBeneficiariaHttpService: InstitucionBeneficiariaHttpService
  ) { }

  institucionBeneficiariaHttps: InstitucionBeneficiariaModels[] = [];
  @Output() institucionBeneficiariaHttpIdEmitter = new EventEmitter<any>();
  @Input() institucionBeneficiariaHttpId: any = 0;

  ngOnInit(): void {
    this.findAll();

  }

  public findAll(): void {
    this.institucionBeneficiariaHttpService.getInstitucionesBeneficiarias().subscribe(
      (response: any) => {
        this.institucionBeneficiariaHttps = response.data.beneficiaryInstitutions;
      }
    );
  }
    public onSelect(id:string){
      this.institucionBeneficiariaHttpIdEmitter.emit(parseInt(id));
    }

}
