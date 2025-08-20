import { Component, Input, Output, EventEmitter, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [FormsModule],
  template: `<div class="mx-auto text-center">
  <div class="spinner-border spinner-border-lg text-secondary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`,
  styleUrls: ['./table.component.scss']
})

export class loaderComponent{
  
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports:[CommonModule, NgbModule, NgbPopoverModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

 



  searchContact:string = '';
  pageLimit:any = 10;
  listLimit:any = 10;
  startFrom:any = 0;
  jumpedPage:any = 0;
  tableColumns:any[] = [];
  enableCheckbox: Boolean = false;

  @Input() tableHeaders!: any[];
  @Input() tableButtons!: any[];
  @Input() tableData!: any[];
  @Input() dataSize: any;
  @Input() rowCheckbox!: Boolean;
  
  pageSize:any = [{title:'10', value:10}, {title:'25', value:25}, {title:'50', value:50}, {title:'100', value:100}]
  @Output() rowSelectionEventEmit = new EventEmitter<any>();
  @Output() eventEmitPageRecord = new EventEmitter<any>();
  @Output() eventEmitRecordOperation = new EventEmitter<any>();

  
  cloanedTbaleHeaders:any[] = [];
  _tableHeaders:any[] = [];
  _tableButtons:any[] = [];
  clonaeddata:any[] = [];
  _tableData: any[] = [];
  tableHeight:any = 0;


    
  get filteredData() {
    return this._tableData.filter((content: any)=> JSON.stringify(content).toLowerCase().includes(this.searchContact.toLowerCase()));
  }

  get paginatedData() {
    const start = this.startFrom;
    // const end = this.startFrom + this.listLimit;
    const end = this.listLimit;
    return this.filteredData.slice(start, end);
  }

  get totalRecords(){
    return Math.ceil(Number(this.filteredData.length) / parseInt(this.pageLimit))
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

   ngOnInit(): void {
    this._tableData = Object.assign([], this.tableData);
    this.clonaeddata = Object.assign([], this.tableData);
    this.cloanedTbaleHeaders = Object.assign([], this.tableHeaders);
    this._tableHeaders = Object.assign([], this.tableHeaders);
    this._tableButtons = Object.assign([], this.tableButtons);
    this.pageLimit = '10';
    this.startFrom = 0;
    this.enableCheckbox = this.rowCheckbox;
    if(!((this.pageSize.findIndex((val:any)=> val.title == 'All')) >= 0))
    this.pageSize.push({title:'All', value:this.tableData.length})
    this.getTotalgePages();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this._tableData = Object.assign([], this.tableData);
    this.clonaeddata = Object.assign([], this.tableData);
    this.cloanedTbaleHeaders = Object.assign([], this.tableHeaders);
    this._tableHeaders = Object.assign([], this.tableHeaders);
    this._tableButtons = Object.assign([], this.tableButtons);
    this.pageLimit = '10';
    this.startFrom = 0;
    if(!((this.pageSize.findIndex((val:any)=> val.title == 'All')) >= 0))
    this.pageSize.push({title:'All', value:this.tableData.length})
    this.getTotalgePages();

  }

  orderDesc:boolean = false;
  orderAsc:boolean = false;
  
   sortCounter:number = 0;
   clickedIndex:number | undefined;
  RecordOrderedBy(recordObj: any, index: any)
  {
    this.clickedIndex = index;
      if(this.sortCounter == 0)
      {
       
        this.orderAsc = true;
        this._tableData = this.tableData.sort((a: any,b: any) =>  (a[recordObj.field] > b[recordObj.field] ? 1 : -1));
        this.sortCounter = this.sortCounter +1
      }
      else if(this.sortCounter == 1)
      {
       
        this.orderAsc = false;
        this.orderDesc = true;
        this._tableData = this.tableData.sort((a: any,b: any) =>  (a[recordObj.field] > b[recordObj.field] ? -1 : 1));
        this.sortCounter = this.sortCounter +1
      }
      else
      {
       
        this.orderAsc = false;
        this.orderDesc = false;
        this._tableData = this.clonaeddata;
        this.sortCounter = 0;
      }
  }

  NumOfPages!:number;
  selectedPage!:number;
  getTotalgePages()
  {
    var totalPages = Number(this.dataSize) / parseInt(this.pageLimit);
    this.listLimit = 0;
    this.startFrom = 0;
    this.jumpedPage = undefined;
    this.listLimit =  parseInt(this.pageLimit) + parseInt(this.startFrom);
    this.NumOfPages = Math.ceil(totalPages);
    this.selectedPage = Number(this.startFrom) + 1;
    this.tableHeight = this.getScreenHeight(this.listLimit);
  }


  previousPage()
  {
    this.jumpedPage = !this.jumpedPage;
    if(this.selectedPage)
    this.selectedPage = this.selectedPage - 1;
    this.startFrom =  (Number(this.selectedPage) - 1) * parseInt(this.pageLimit);
    this.listLimit =  parseInt(this.pageLimit) + parseInt(this.startFrom);
    this.emitPageRecordEvent();
  }
  nextPage()
  {
    this.jumpedPage = !this.jumpedPage;
    if(this.selectedPage)
    this.selectedPage = this.selectedPage + 1;
    this.startFrom =  String((Number(this.selectedPage) - 1) * parseInt(this.pageLimit));
    this.listLimit =  parseInt(this.pageLimit) + parseInt(this.startFrom);
    this.emitPageRecordEvent();
  }

  JumpedToPage(page: any)
  {
    if(page != undefined && page != null && !isNaN(page))
    {
      this.selectedPage = page;
      this.startFrom =  String((Number(this.selectedPage) - 1) * parseInt(this.pageLimit));
      this.listLimit =  parseInt(this.pageLimit) + parseInt(this.startFrom);
      this.emitPageRecordEvent();
    }
    else
    {
      this.selectedPage = 1;
      this.startFrom =  String((Number(this.selectedPage) - 1) * parseInt(this.pageLimit));
      this.listLimit =  parseInt(this.pageLimit) + parseInt(this.startFrom);
      this.emitPageRecordEvent();
    }
  }

  getScreenHeight(value: any)
  {
    if (isPlatformBrowser(this.platformId)) {
        var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;
          var result = (100*(y/1.4))/y;
          return result+'vh';
    }
    else{
      return '75vh';
    }
    
  }

jumpTuFirstPage()
  {
    this.jumpedPage = undefined;
    this.selectedPage = 1;
    this.startFrom =  (Number(this.selectedPage) - 1) * parseInt(this.pageLimit);
    this.listLimit =  parseInt(this.pageLimit) + parseInt(this.startFrom);

    this.emitPageRecordEvent();
  }

  jumpToLastPage()
  {
    this.jumpedPage = undefined;
    this.selectedPage = this.totalRecords;
    this.startFrom =  String((Number(this.selectedPage) - 1) * parseInt(this.pageLimit));
    this.listLimit =  parseInt(this.pageLimit) + parseInt(this.startFrom);
    this.emitPageRecordEvent();
  }

  rowSeleted:any[] = [];
  selectAll: any;
  selectItem(event: any, data: any)
  {
    if(event.currentTarget.checked == true)
    {
        this.rowSeleted.push(data)
    }
    else
    {
      this.rowSeleted.splice(this.rowSeleted.indexOf(data), 1);
    }
    this.selectedRowsData();
  }

  selectAllItem(event: any)
  {
    
    if(event.currentTarget.checked == true)
    {
        this.rowSeleted = this.tableData;
    }
    else
    {
      this.rowSeleted = [];
    }
    this.selectedRowsData();
  }

  checkRowExist(data: any)
  {
      return this.rowSeleted.indexOf(data) >= 0;
  }

  selectedRowsData()
  {
      this.rowSelectionEventEmit.emit(this.rowSeleted)
  }

  triggerRecordOpertaion(operation: any, field: any) {
    var data: string = JSON.stringify(field);
    this.eventEmitRecordOperation.emit({ operation, field: data })
  }


  isButtonDisabled(condition: string, rowData: any): boolean {
    if (!condition || !rowData) return false;
  
    try {
      const safeCondition = condition.replace(/\.length\(\)/g, '.length'); // Auto-fix common mistake
      const func = new Function('data', `with(data) { return ${safeCondition}; }`);
      return !!func(rowData); // true = disabled
    } catch (error) {
      console.error('Condition evaluation error:', condition, error);
      return false;
    }
  }
  
  emitPageRecordEvent()
  {
    // this.eventEmitPageRecord.emit({startFrom: this.startFrom, limitTo:this.listLimit});
  }

  toggleTableColumns()
  {
     if(this.tableColumns != undefined && this.tableColumns.length > 0)
     {
          this._tableHeaders = this.tableColumns;
     }
     else
     {
        this._tableHeaders = this.cloanedTbaleHeaders;
     }
  }
  
  setClassInInutPattern(_value: any)
  {
    return 'text-start';
  }
}

function content(value: any, index: number, array: any[]): value is any {
  throw new Error('Function not implemented.');
}

