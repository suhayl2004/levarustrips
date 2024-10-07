import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  Pipe,
  PipeTransform,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService } from "@config";
import { UnsubscribeOnDestroyAdapter } from "@shared";
import { InConfiguration, LanguageService } from "@core";
import { RouteInfo } from "../sidebar/sidebar.metadata";
import { ROUTESW, SETTINGS } from "../sidebar/sidebar-items";
import { HeaderService } from "./header.service";
import { MatDialog } from "@angular/material/dialog";
import { AdvanceTable } from "./header.model";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "app/authentication/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
interface Companies {
  cname: string;
  ccode: string;
  clabel: string;
  clogo: string;
}
@Pipe({
  name: "filter",
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter((item) => item.text.toLowerCase().includes(searchText));
  }
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public config!: InConfiguration;
  userImg?: string;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement?: HTMLElement;
  isFullScreen = false;
  isDropdownVisible = false;
  isNavigationDropdownVisible = false;
  isCompanyDropdownVisible = false;
  searchTerm: string = "";
  searchSettings: string = "";
  searchCompany: string = "";
  showAdd: string = "Add";
  filterText: string = "";
  public sidebarItems!: RouteInfo[];
  public settingsItems!: RouteInfo[];
  listLang: AdvanceTable[] = [];
  public userEmail: string | null = null;
  userName: string | null = null;
  selectedCompany: string = "";
  typeSelected!: string;
  isMenuOpen = false;
  showResetForm = false; // To control the visibility of the reset form
  resetPasswordForm!: FormGroup;

  companyItems: Companies[] = [
    {
      cname: "Levarus Solutions Private Limited",
      ccode: "LSPL",
      clabel: "Levarus",
      clogo: "LS",
    },
    {
      cname: "National Banking Corporation",
      ccode: "NBC",
      clabel: "National",
      clogo: "NB",
    },
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private configService: ConfigService,
    private authService: AuthService,
    public languageService: LanguageService,
    private headerService: HeaderService,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
  }
  ngOnInit() {
    this.authService.currentUserName$.subscribe((uname) => {
      this.userName = uname;
    });
    // Initialize reset password form
    this.resetPasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
    // If the user is not authenticated, redirect to login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/authentication/login"]);
    } else {
      this.userEmail = localStorage.getItem("emailid"); // Get the stored email
    }

    this.selectedCompany = "Levarus Solutions Private Limited";
    this.companyLogo = "LS";
    this.headerService.dataChange.subscribe((data: AdvanceTable[]) => {
      this.listLang = data; // Assign fetched data to listLang property
    });

    this.sidebarItems = ROUTESW.filter(
      (sidebarItem) =>
        sidebarItem.title.trim().toLowerCase() !== "" &&
        sidebarItem.title.trim().toLowerCase() !== ""
    );

    this.settingsItems = SETTINGS.filter(
      (sidebarItem) =>
        sidebarItem.title.trim().toLowerCase() !== "dashboard" &&
        sidebarItem.title.trim().toLowerCase() !== "requirements"
    );
    console.log(this.settingsItems);

    this.config = this.configService.configData;
    this.docElement = document.documentElement;

    this.homePage = "dashboard/dashboard1";

    this.langStoreValue = localStorage.getItem("lang") as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = "assets/images/flags/us.png";
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
  }
    // Toggle the reset password form
    toggleResetForm(): void {
      this.showResetForm = !this.showResetForm;
    }
  
    // Submit the reset password form
    submitResetPassword(): void {
      if (this.resetPasswordForm.valid) {
        const resetPassword = this.resetPasswordForm.value;
        console.log(resetPassword);
        alert('Password updated successfully.');
        this.toggleResetForm();
        this.signOut();
      }
    }

  filterSidebarItems() {
    if (this.searchTerm) {
      this.sidebarItems = ROUTESW.filter(
        (sidebarItem) =>
          sidebarItem.title
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) &&
          sidebarItem.title.trim().toLowerCase() !== "" &&
          sidebarItem.title.trim().toLowerCase() !== ""
      );
    } else {
      // If the search term is empty or contains the word "dashboard," exclude it
      this.sidebarItems = ROUTESW.filter(
        (sidebarItem) =>
          sidebarItem.title.trim().toLowerCase() !== "" &&
          sidebarItem.title.trim().toLowerCase() !== ""
      );
    }
  }

  filterSettingsSidebarItems() {
    if (this.searchSettings) {
      this.settingsItems = ROUTESW.filter(
        (sidebarItem) =>
          sidebarItem.title
            .toLowerCase()
            .includes(this.searchSettings.toLowerCase()) &&
          sidebarItem.title.trim().toLowerCase() !== "dashboard" &&
          sidebarItem.title.trim().toLowerCase() !== "requirements"
      );
    } else {
      // If the search term is empty or contains the word "dashboard," exclude it
      this.settingsItems = ROUTESW.filter(
        (sidebarItem) =>
          sidebarItem.title.trim().toLowerCase() !== "dashboard" &&
          sidebarItem.title.trim().toLowerCase() !== "requirements"
      );
    }
  }
  handleButtonClick(sidebarItem: any) {
    this.spinner.show();
    setTimeout(() => {
      if (sidebarItem.title == "Requirements") {
        this.headerService.setShouldDisplayReq(true);
        this.headerService.setshouldDisplayTestCycles(false);
        this.headerService.setshouldDisplayTestScenarios(false);
        this.headerService.setshouldDisplayTestCases(false);
        this.headerService.setshouldDisplayBugs(false);
        this.headerService.setshouldDisplayUmanagement(false);
        this.headerService.setshouldDisplayCmanagement(false);
        this.headerService.setshouldDisplayProjects(false);
      } else if (sidebarItem.title == "Test > Cycles") {
        this.headerService.setshouldDisplayTestCycles(true);
        this.headerService.setShouldDisplayReq(false);
        this.headerService.setshouldDisplayTestCycles(false);
        this.headerService.setshouldDisplayTestScenarios(false);
        this.headerService.setshouldDisplayTestCases(false);
        this.headerService.setshouldDisplayBugs(false);
        this.headerService.setshouldDisplayUmanagement(false);
        this.headerService.setshouldDisplayCmanagement(false);
        this.headerService.setshouldDisplayProjects(false);
      } else if (sidebarItem.title == "Test > Scenarios") {
        this.headerService.setshouldDisplayTestScenarios(true);
        this.headerService.setShouldDisplayReq(false);
        this.headerService.setshouldDisplayTestCycles(false);
        this.headerService.setshouldDisplayTestCases(false);
        this.headerService.setshouldDisplayBugs(false);
        this.headerService.setshouldDisplayUmanagement(false);
        this.headerService.setshouldDisplayCmanagement(false);
        this.headerService.setshouldDisplayProjects(false);
      } else if (sidebarItem.title == "Test > Cases") {
        this.headerService.setshouldDisplayTestCases(true);
        this.headerService.setShouldDisplayReq(false);
        this.headerService.setshouldDisplayTestCycles(false);
        this.headerService.setshouldDisplayTestScenarios(false);
        this.headerService.setshouldDisplayBugs(false);
        this.headerService.setshouldDisplayUmanagement(false);
        this.headerService.setshouldDisplayCmanagement(false);
        this.headerService.setshouldDisplayProjects(false);
      } else if (sidebarItem.title == "Bugs") {
        this.headerService.setshouldDisplayBugs(true);
        this.headerService.setShouldDisplayReq(false);
        this.headerService.setshouldDisplayTestCycles(false);
        this.headerService.setshouldDisplayTestScenarios(false);
        this.headerService.setshouldDisplayTestCases(false);
        this.headerService.setshouldDisplayUmanagement(false);
        this.headerService.setshouldDisplayCmanagement(false);
        this.headerService.setshouldDisplayProjects(false);
      } else if (sidebarItem.title == "Settings > User Management") {
        this.headerService.setshouldDisplayUmanagement(true);
        this.headerService.setShouldDisplayReq(false);
        this.headerService.setshouldDisplayTestCycles(false);
        this.headerService.setshouldDisplayTestScenarios(false);
        this.headerService.setshouldDisplayTestCases(false);
        this.headerService.setshouldDisplayBugs(false);
        this.headerService.setshouldDisplayCmanagement(false);
        this.headerService.setshouldDisplayProjects(false);
      } else if (sidebarItem.title == "Settings > Company Management") {
        this.headerService.setshouldDisplayCmanagement(true);
        this.headerService.setShouldDisplayReq(false);
        this.headerService.setshouldDisplayTestCycles(false);
        this.headerService.setshouldDisplayTestScenarios(false);
        this.headerService.setshouldDisplayTestCases(false);
        this.headerService.setshouldDisplayBugs(false);
        this.headerService.setshouldDisplayUmanagement(false);
        this.headerService.setshouldDisplayProjects(false);
      } else if (sidebarItem.title == "Settings > Projects") {
        this.headerService.setshouldDisplayProjects(true);
        this.headerService.setShouldDisplayReq(false);
        this.headerService.setshouldDisplayTestCycles(false);
        this.headerService.setshouldDisplayTestScenarios(false);
        this.headerService.setshouldDisplayTestCases(false);
        this.headerService.setshouldDisplayBugs(false);
        this.headerService.setshouldDisplayUmanagement(false);
        this.headerService.setshouldDisplayCmanagement(false);
      }
      this.spinner.hide();
    }, 300);
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  companyToggleMenu() {
    this.isCompanyDropdownVisible = !this.isCompanyDropdownVisible;
  }
  routerLinkButtonClick() {
    this.isDropdownVisible = false;
    this.spinner.show();
    setTimeout(() => {
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
  companyLogo: any;
  companyItemsSelect(cname: string, clabel: string, clogo: string) {
    this.selectedCompany = cname;
    console.log(this.selectedCompany);
    this.companyLogo = clogo;
  }
  get filteredCompanyItems() {
    if (!this.searchCompany) {
      return this.companyItems;
    }

    const searchTerm = this.searchCompany.toLowerCase();
    return this.companyItems.filter((item) =>
      item.cname.toLowerCase().includes(searchTerm)
    );
  }
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
  navigationDropdown() {
    this.isNavigationDropdownVisible = !this.isNavigationDropdownVisible;
  }
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    // Check if the click event target is not within the dropdownMenu or the button itself
    if (
      this.elementRef.nativeElement &&
      event.target &&
      !this.elementRef.nativeElement.contains(event.target) &&
      (event.target as HTMLElement).classList &&
      !(event.target as HTMLElement).classList.contains("dropdown-button") // Change 'dropdown-button' to the class of your button
    ) {
      this.isDropdownVisible = false;
      this.isCompanyDropdownVisible = false;
      this.isMenuOpen = false;
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

    const hasClass2 = this.document.body.classList.contains("side-closed");
    if (hasClass2) {
      this.renderer.removeClass(this.document.body, "submenu-closed");
    } else {
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains("side-closed");
    if (hasClass) {
      this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, "submenu-closed");
      localStorage.setItem("collapsed_menu", "false");
    } else {
      this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, "submenu-closed");
      localStorage.setItem("collapsed_menu", "true");
    }
  }
  signOut(){
    this.authService.logout();
  }
}
