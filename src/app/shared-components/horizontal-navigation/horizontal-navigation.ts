import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { AppSettings } from '../../config';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../shared-modules/material/material.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavItems } from '../nav-items/nav-items';
import { MatMenuTrigger } from '@angular/material/menu';

interface notifications {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface apps {
  id: number;
  // img: string;
  title: string;
  // subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

interface externalAP {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-horizontal-navigation',
  imports: [MaterialModule, RouterModule, FontAwesomeModule],
  templateUrl: './horizontal-navigation.html',
  styleUrl: './horizontal-navigation.scss',
})
export class HorizontalNavigation {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: '/images/flag/icon-flag-en.svg',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/images/flag/icon-flag-en.svg',
    },
    {
      language: 'Español',
      code: 'es',
      icon: '/images/flag/icon-flag-es.svg',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: '/images/flag/icon-flag-fr.svg',
    },
    {
      language: 'German',
      code: 'de',
      icon: '/images/flag/icon-flag-de.svg',
    },
  ];

  @Output() optionsChange = new EventEmitter<AppSettings>();
  options: any;
  closeTimeout: any;
  constructor(
    private settings: CoreService,
    private vsidenav: CoreService,
    public dialog: MatDialog
  ) {
    this.options = this.settings.getOptions();
  }

  openDialog() {
    // const dialogRef = this.dialog.open(AppHorizontalSearchDialogComponent);
    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  private emitOptions() {
    this.optionsChange.emit(this.options);
  }

  setlightDark(theme: string) {
    this.options.theme = theme;
    this.emitOptions();
  }

  changeLanguage(lang: any): void {
    this.selectedLanguage = lang;
  }

  notifications: notifications[] = [
    {
      id: 1,
      img: '/images/profile/user-1.jpg',
      title: 'Roman Joined thes Team!',
      subtitle: 'Congratulate him',
    },
    {
      id: 2,
      img: '/images/profile/user-2.jpg',
      title: 'New message received',
      subtitle: 'Salma sent you new message',
    },
    {
      id: 3,
      img: '/images/profile/user-3.jpg',
      title: 'New Payment received',
      subtitle: 'Check your earnings',
    },
    {
      id: 4,
      img: '/images/profile/user-4.jpg',
      title: 'Jolly completed tasks',
      subtitle: 'Assign her new tasks',
    },
    {
      id: 5,
      img: '/images/profile/user-5.jpg',
      title: 'Roman Joined the Team!',
      subtitle: 'Congratulate him',
    },
  ];

  profiledd: profiledd[] = [
    {
      id: 1,
      img: '/images/svgs/icon-account.svg',
      title: 'My Profile',
      subtitle: 'Account Settings',
      link: '/',
    },
    {
      id: 2,
      img: '/images/svgs/icon-inbox.svg',
      title: 'My Inbox',
      subtitle: 'Messages & Email',
      link: '/apps/email/inbox',
    },
    {
      id: 3,
      img: '/images/svgs/icon-tasks.svg',
      title: 'My Tasks',
      subtitle: 'To-do and Daily Tasks',
      link: '/apps/taskboard',
    },
  ];

  externalAPList: externalAP[] = [
    {
      id: 1,
      title: 'AP Register',
      link: '/masters/apregister',
    },
    {
      id: 2,
      title: 'Device List',
      link: '/masters/devicelist',
    },
    {
      id: 3,
      title: 'AP Device Group',
      link: '/masters/apdevicegroup',
    },
    {
      id: 4,
      title: 'Nas Manager',
      link: '/masters/nasmanager',
    },
    {
      id: 5,
      title: 'Nas Package Mapping',
      link: '/masters/nasmapping',
    },
    {
      id: 6,
      title: 'External Floor Plan AP',
      link: '/masters/floorPlan',
    },
    {
      id: 7,
      title: 'Subscriber Master',
      link: '/masters/subscriberMaster',
    },
    {
      id: 8,
      title: 'PackageMaster',
      link: '/masters/packagemaster',
    },
    {
      id: 9,
      title: 'CaptivePortalMapping',
      link: '/masters/captivePortalMapping',
    },
  ];

  apps: apps[] = [
    {
      id: 1,
      title: 'Role Master',
      link: '/masters/roleMaster',
    },
    {
      id: 2,
      title: 'User Master',
      link: '/masters/userMaster',
    },
    {
      id: 3,
      title: 'Firmware Details',
      link: '/masters/firmwaredetails',
    },
    {
      id: 4,
      title: 'Orchestrator Mapping',
      link: '/masters/orchestratorMapping',
    },
    {
      id: 5,
      title: 'Product Client Mapping',
      link: '/masters/productClientMapping',
    },
    {
      id: 6,
      title: 'Product Code Mapping',
      link: '/masters/productCodeMapping',
    },

    {
      id: 8,
      title: 'CompanyMaster',
      link: '/masters/companies',
    },
    {
      id: 9,
      title: 'CountryMaster',
      link: '/masters/country',
    },
    {
      id: 10,
      title: 'StateMaster',
      link: '/masters/state',
    },
    {
      id: 11,
      title: 'CityMaster',
      link: '/masters/cities',
    },
    {
      id: 12,
      title: 'OrchestratorMaster',
      link: '/masters/orchestratormaster',
    },

    {
      id: 14,
      title: 'Devicemaster',
      link: '/masters/devicemaster',
    },
    {
      id: 15,
      title: 'MenuMaster',
      link: '/masters/menumaster',
    },
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Pricing Page',
      link: '/theme-pages/pricing',
    },
    {
      id: 2,
      title: 'Authentication Design',
      link: '/authentication/login',
    },
    {
      id: 3,
      title: 'Register Now',
      link: '/authentication/side-register',
    },
    {
      id: 4,
      title: '404 Error Page',
      link: '/authentication/error',
    },
    {
      id: 5,
      title: 'Notes App',
      link: '/apps/notes',
    },
    {
      id: 6,
      title: 'Employee App',
      link: '/apps/employee',
    },
    {
      id: 7,
      title: 'Todo Application',
      link: '/apps/todo',
    },
    {
      id: 8,
      title: 'Treeview',
      link: '/theme-pages/treeview',
    },
  ];

  private isHovering = false;

  onMouseEnter(trigger: MatMenuTrigger): void {
    this.isHovering = true;
    clearTimeout(this.closeTimeout);
    trigger.openMenu();
  }

  onMouseLeave(trigger: MatMenuTrigger): void {
    this.isHovering = false;
    this.closeTimeout = setTimeout(() => {
      if (!this.isHovering) {
        trigger.closeMenu();
      }
    }, 300); // Delay to prevent flickering
  }
}
