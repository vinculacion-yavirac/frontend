import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SchoolPeriodModels } from './school-period.models';
import { SchoolPeriodService } from './school-period.service';

@Component({
  selector: 'combobox-school-period',
  templateUrl: './school-period-combobox.component.html',
  styleUrls: ['./school-period-combobox.component.css']
})
export class SchoolPeriodComboboxComponent implements OnInit {

  constructor(
    private schoolPeriodService: SchoolPeriodService
  ) {}

    schoolPeriods: SchoolPeriodModels[] = [];
    @Output() schoolPeriodIdEmitter = new EventEmitter<any>();
    @Input() schoolPeriodId: any = 0;

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    this.schoolPeriodService.getSchoolPeriod().subscribe(
      (response:any) => {this.schoolPeriods = response.data.schoolPeriod;
        //console.log(response.data);
        }
    );

  }

    public onSelect(id:string){
      this.schoolPeriodIdEmitter.emit(parseInt(id));
    }
}
