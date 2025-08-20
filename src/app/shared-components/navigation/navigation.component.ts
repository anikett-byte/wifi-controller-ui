import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared-modules/material/material.module';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit, OnChanges {

  @Input() dataSet: any[] = [];



  constructor(private router: Router) { 
    
  }
  ngOnChanges(changes: SimpleChanges): void {
  }




  ngOnInit(): void {
    
  }

  navigateToURL(menuItem: any)
  {
    //  { queryParams: menuItem }
    this.router.navigate([`/admin/${menuItem['state']}`]);
  }
  

}
