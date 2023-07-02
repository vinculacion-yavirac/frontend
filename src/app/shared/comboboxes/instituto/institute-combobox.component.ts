import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InstituteModels } from './institute.models';
import { InstituteService } from './institute.service';

@Component({
  selector: 'combobox-institute',
  templateUrl: './institute-combobox.component.html',
  styleUrls: ['./institute-combobox.component.css']
})
export class InstituteComboboxComponent implements OnInit {

  constructor(
    private instituteService: InstituteService
  ) {}

    institutes: InstituteModels[] = [];
    @Output() instituteIdEmitter = new EventEmitter<any>();
    @Input() instituteId: any = 0;

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    this.instituteService.getInstitute().subscribe(
      (response:any) => {this.institutes = response.data.institute;
        //console.log(response.data);
        }
    );

  }

    public onSelect(id:string){
      this.instituteIdEmitter.emit(parseInt(id));
    }
}
