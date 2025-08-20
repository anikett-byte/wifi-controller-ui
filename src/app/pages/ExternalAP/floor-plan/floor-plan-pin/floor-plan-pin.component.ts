// import { Component, OnInit, Input, Injectable } from '@angular/core';
// //import { ViewFloorPlanComponent } from '../view-floor-plan/view-floor-plan.component';

// @Component({
//   selector: 'appFloorPlanPin',
//   templateUrl: './floor-plan-pin.component.html',
//   styleUrls: ['./floor-plan-pin.component.scss']
// })
// export class FloorPlanPinComponent implements OnInit {
//   //@Input() x:number;
//  // @Input() y:number;
//   @Input() pins:any;
//   //@Inject(Service, 'some-token')
//   //movingOffset = { x: 10, y: 10 };
//   //endOffset = { x: 10, y: 10 };
  
//   public selfRef: FloorPlanPinComponent;
//   position:any;
//    x:number; 
//    y:number;
//    name:any;
//    ref:any;
//   //constructor(public x:number , public y:number) { }
//   constructor() { }
//   inBounds = true;
//   edge = {
//     top: true,
//     bottom: true,
//     left: true,
//     right: true
//   };
//   ngOnInit() {
//   //  this.ref = ViewFloorPlanComponent.prototype.VCR
   
//   this.position = { x: this.x, y: this.y };
//   }
  
//   onStart(event) {
//   }

//   onStop(event) {
//     //this.position = { x: this.x, y: this.y };
//   }

//   onMoving(event) {
//    // this.movingOffset.x = event.x;
//     ///this.movingOffset.y = event.y;
//   }

//   onMoveEnd(event) {
//     this.position = { x: event.x, y: event.y };
//    // this.endOffset.x = event.x;
//    // this.endOffset.y = event.y;
//   }
//   getApData(event,position){
//     console.log("---AP clicked----" + JSON.stringify(event) + event.name +JSON.stringify( position));
//   }
// }
