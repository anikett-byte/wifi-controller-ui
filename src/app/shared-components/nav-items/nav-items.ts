import {
  Component,
  HostBinding,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared-modules/material/material.module';
import { CommonModule } from '@angular/common';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-nav-items',
  imports: [MaterialModule, CommonModule],
  templateUrl: './nav-items.html',
  styleUrl: './nav-items.scss'
})
export class NavItems {


   @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  expanded: any = false;
  disabled: any = false;
  twoLines: any = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: any;

  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    const url = this.navService.currentUrl(); 
    if (this.item.route && url) {
      this.expanded = url.indexOf(`/${this.item.route}`) === 0;
      this.ariaExpanded = this.expanded;
    }
  }

  onItemSelected(item: any) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
      
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    if (!this.expanded){
    if (window.innerWidth < 1024) {
      this.notify.emit();
    }
  }
  }

  onSubItemSelected(item: any) {
    if (!item.children || !item.children.length){
      if (this.expanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }

  isDirectlyActive(item: any): boolean {
    return !!item.route && this.router.isActive(item.route, true);
  }

  isChildActive(item: any): boolean {
    if (!item.children) return false;
    return item.children.some(
      (child: any) => this.isDirectlyActive(child) || this.isChildActive(child)
    );
  }

}
