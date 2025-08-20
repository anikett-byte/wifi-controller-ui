import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dropdown',
  imports:[CommonModule, NgbModule, NgbPopoverModule, FormsModule],
  standalone: true,
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {

  @Input() data!: any[];
  @Input() setting:any;
  @Output() onSelect = new EventEmitter();
  show:boolean=false;
  selectedOption:string='Select'
  tempData : any[] = [];
  allData : any;
  form: FormGroup;
  errMsg:boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      companyName: ['', Validators.required],
      // Add other form controls here
    });
  }

  ngOnInit() {
    this.tempData = [...this.data];
    this.allData = [...this.data];
    console.log(this.tempData, this.data)
    console.log('Input data:', this.data);
    console.log('Input setting:', this.setting);
  }

  searchCompany(event: any) {
    const searchText = event.value.toLowerCase();
    const term = (searchText || '').toString().toLowerCase();

    if (!term) {
      this.tempData = [...this.allData];
      return;
    }
  
    this.data = this.tempData.filter(client =>
      client[this.setting.textField].toLowerCase().includes(term)
    );
  }
  

  select(id:any, textField:any) {
    this.onSelect.emit({id:id,textField:textField})
    this.selectedOption = textField;
    this.errMsg = false;
    this.show = false;
  }

  showHideList(){
    this.show = !this.show;
  }

  showMsg(){
    this.errMsg = true;
    this.show = false;
    this.selectedOption = 'Select'
    this.onSelect.emit(0)
  }

  

}
