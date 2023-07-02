import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CareerModels } from './career.models';
import { CareerService } from './career.service';

@Component({
  selector: 'combobox-career',
  templateUrl: './career-combobox.component.html',
  styleUrls: ['./career-combobox.component.css']
})
export class CareerComboboxComponent implements OnInit {

  constructor(
    private careerService: CareerService
  ) {}

    careers: CareerModels[] = [];
    @Output() careerIdEmitter = new EventEmitter<any>();
    @Input() careerId: any = 0;

  ngOnInit(): void {
    this.findAll();
  }

  public findAll(): void {
    this.careerService.getCareer().subscribe(
      (response:any) => {this.careers = response.data.career;
        //console.log(response.data);
        }
    );

  }

    public onSelect(id:string){
      this.careerIdEmitter.emit(parseInt(id));
    }
}
