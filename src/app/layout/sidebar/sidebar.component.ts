import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { RouteInfo } from './sidebar.metadata';
import { HeaderService } from '../header/header.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  listMaxHeight?: string;
  listMaxWidth?: string;
  headerHeight = 60;
  currentRoute?: string;
  routerObj;
  menuIcon = 'radio_button_checked';

  routes: RouteInfo[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private router: Router,
    private headerService: HeaderService,
    private spinner: NgxSpinnerService,
  ) {
    this.elementRef.nativeElement.closest('body');
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }
  callToggleMenu(event: Event, length: number) {
    this.spinner.show();
    setTimeout(() => {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
    this.headerService.setShouldDisplayReq(false);
    this.headerService.setshouldDisplayTestCycles(false);
    this.headerService.setshouldDisplayTestScenarios(false);
    this.headerService.setshouldDisplayTestCases(false);
    this.headerService.setshouldDisplayBugs(false);
    this.headerService.setshouldDisplayUmanagement(false);
    this.headerService.setshouldDisplayCmanagement(false);
    this.headerService.setshouldDisplayProjects(false);
    this.spinner.hide(); 
  }, 300);
  }

  updateSubMenu(): void {
    this.routes = [
      {
        path: 'dashboard',
        title: 'Dashboard',
        iconType: 'feather',
        icon: 'home',
        class: '',
        groupTitle: false,
        badge: '',
        badgeClass: '',
        submenu: [],
      },
      {
        path: 'requirements',
        title: 'Requirements',
        iconType: 'feather',
        icon: 'paperclip',
        class: '',
        groupTitle: false,
        badge: '',
        badgeClass: '',
        submenu: [],
      },
      // {
      //   path: '',
      //   title: 'Test',
      //   iconType: 'feather',
      //   icon: 'refresh-cw',
      //   class: 'menu-toggle',
      //   groupTitle: false,
      //   badge: '',
      //   badgeClass: '',
      //   submenu: [
      //     {
      //       path: 'testcycles',
      //       title: 'Cycle',
      //       iconType: 'feather',
      //       icon: 'refresh-cw',
      //       class: 'ml-menu',
      //       groupTitle: false,
      //       badge: '',
      //       badgeClass: '',
      //       submenu: [],
      //     },
      //     {
      //       path: 'testscenarios',
      //       title: 'Scenarios',
      //       iconType: 'feather',
      //       icon: 'wind',
      //       class: 'ml-menu',
      //       groupTitle: false,
      //       badge: '',
      //       badgeClass: '',
      //       submenu: [],
      //     },
      //     {
      //       path: 'testcases',
      //       title: 'Cases',
      //       iconType: 'feather',
      //       icon: 'message-square',
      //       class: 'ml-menu',
      //       groupTitle: false,
      //       badge: '',
      //       badgeClass: '',
      //       submenu: [],
      //     },
      //   ],
      // },
      {
        path: 'bugs',
        title: 'Bugs',
        iconType: 'feather',
        icon: 'trello',
        class: '',
        groupTitle: false,
        badge: '',
        badgeClass: '',
        submenu: [],
      },
    ];


    this.sidebarItems = this.routes.filter((sidebarItem) => sidebarItem);
  }
  ngOnInit() {
    this.updateSubMenu();
    this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }
  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }

  isCollapsed = false; // Initially, the sidebar is not collapsed (left-arrow is visible)

  callSidemenuCollapse() {
    this.isCollapsed = !this.isCollapsed; 
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.menuIcon = 'radio_button_checked';
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      this.menuIcon = 'radio_button_unchecked';
    }

    const sideClosedHover =
      this.document.body.classList.contains('side-closed');
    if (sideClosedHover) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
    }
  }
}
