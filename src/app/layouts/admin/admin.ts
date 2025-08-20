import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../shared-modules/material/material.module';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { HorizontalNavigation } from '../../shared-components/horizontal-navigation/horizontal-navigation';
import { NavItems } from '../../shared-components/nav-items/nav-items';
import { navItems } from '../../data/navItems';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, MaterialModule, HorizontalNavigation, NgScrollbarModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
showFiller = false;
  navItems = navItems;

  @ViewChild('leftsidenav')
  public sidenav: MatSidenav | undefined;
  resView = false;
  @ViewChild('content', { static: true }) content!: MatSidenavContent;
  //get options from service
  private layoutChangesSubscription = Subscription.EMPTY;
  private isMobileScreen = false;
  private isContentWidthFixed = true;
  private isCollapsedWidthFixed = false;
  private htmlElement!: HTMLHtmlElement;

  get isOver(): boolean {
    return this.isMobileScreen;
  }

  get isTablet(): boolean {
    return this.resView;
  }

  constructor() { 
    // Initialization code can go here
  }

   onSidenavClosedStart() {
    this.isContentWidthFixed = false;
  }

  onSidenavOpenedChange(isOpened: boolean) {
    this.isCollapsedWidthFixed = !this.isOver;
  }


}
