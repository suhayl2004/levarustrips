import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DataSource } from "@angular/cdk/collections";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
  BehaviorSubject,
  fromEvent,
  merge,
  Observable,
  Subscription,
} from "rxjs";
import { map } from "rxjs/operators";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { SelectionModel } from "@angular/cdk/collections";
import { Direction } from "@angular/cdk/bidi";
import {
  TableExportUtil,
  TableElement,
  UnsubscribeOnDestroyAdapter,
} from "@shared";
import "jspdf-autotable";
import { HeaderService } from "app/layout/header/header.service";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "app/services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import { formatDate } from "@angular/common";
import { TscCycleTableService } from "./tsc-cycle-table.service";
import { AdvanceTable } from "./tsc-cycle-table.model";
import { TestCycleService } from "app/test-cycle/test-cycle.service";

@Component({
  selector: 'app-tsc-cycle-table',
  templateUrl: './tsc-cycle-table.component.html',
  styleUrl: './tsc-cycle-table.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class TscCycleTableComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  displayedColumns = [
    "select",
    "tcid",
    "cdate",
    "title",
    "mname",
    "priority",
  ];
  exampleDatabase?: TscCycleTableService;
  @Input() dataSource!: ExampleDataSource;
  selection = new SelectionModel<AdvanceTable>(true, []);
  id?: number;
  advanceTable?: TscCycleTableService;
  deldata: any[] = [];
  addBoolean: boolean = false;
  private shouldDisplayReqSubscription!: Subscription;
  typeSelected: string;
  private startX!: number;
  private startWidth!: number;
  private currentResizer!: HTMLElement;
  onMouseDown(event: MouseEvent) {
    const header = (event.target as HTMLElement).parentElement;
    if (!header) {
      return;
    }

    this.startX = event.pageX;
    this.startWidth = header.offsetWidth;
    this.currentResizer = header;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    const newWidth = this.startWidth + (event.pageX - this.startX);
    this.currentResizer.style.width = `${newWidth}px`;
  };

  onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public advanceTableService: TscCycleTableService,
    public advanceTableService1: TestCycleService,
    private snackBar: MatSnackBar,
    private headerService: HeaderService,
    private translateService: TranslateService,
    public Common: CommonService,
    private spinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    super();
    this.typeSelected = "ball-fussion";
  }
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild("filter", { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  getTranslation(key: string): string {
    return this.translateService.instant(key);
  }
  public showSpinner(): void {
    console.log("Spinner is being shown");
    this.spinnerService.show();
    this.cdr.detectChanges();

    setTimeout(() => {
      this.spinnerService.hide();
      this.cdr.detectChanges();
    }, 2000); // 5 seconds
  }
  ngOnInit() {
    this.shouldDisplayReqSubscription =
      this.headerService.shouldDisplayReq$.subscribe((shouldDisplay) => {
        if (shouldDisplay) {
        }
      });
    this.loadData();


    this.advanceTableService1.selectedItems$.subscribe(items => {
      this.selectedItems = items;
      console.log('Received selected items:', this.selectedItems);
      this.advanceTableService1.updateSelectedItems(this.selectedItems);
    });


  }
  selectedItems: any[] = [];
  getUniquePriorities(data: AdvanceTable[]): string[] {
    const uniquePriorities = new Set(data.map(item => item.priority));
    return Array.from(uniquePriorities);
  }

  override ngOnDestroy() {
    // Unsubscribe when the component is destroyed to avoid memory leaks
    this.shouldDisplayReqSubscription.unsubscribe();
  }
  refresh() {
    this.loadData();
  }

  getSelectedItemCount(): number {
    return this.selection.selected.length;
  }

  // Function to update the count and notify the service
  updateSelectedCount(): void {
    const count = this.selection.selected.length;
    this.advanceTableService.updateSelectedItemCount(count);
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
    console.log(this.selection.selected);
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.renderedData.forEach((row) =>
          this.selection.select(row)
        );
  }
  public loadData() {
    this.exampleDatabase = new TscCycleTableService(this.httpClient);
    this.dataSource = new ExampleDataSource(
      this.exampleDatabase,
      this.paginator,
      this.sort
    );
    this.subs.sink = fromEvent(this.filter.nativeElement, "keyup").subscribe(
      () => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      }
    );
  }
  showNotification(
    colorName: string,
    text: string,
    placementFrom: MatSnackBarVerticalPosition,
    placementAlign: MatSnackBarHorizontalPosition
  ) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
  // context menu
  onContextMenu(event: MouseEvent, item: AdvanceTable) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    if (this.contextMenu !== undefined && this.contextMenu.menu !== null) {
      this.contextMenu.menuData = { item: item };
      this.contextMenu.menu.focusFirstItem("mouse");
      this.contextMenu.openMenu();
    }
  }
}
export class ExampleDataSource extends DataSource<AdvanceTable> {
  filterChange = new BehaviorSubject("");
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  filteredData: AdvanceTable[] = [];
  renderedData: AdvanceTable[] = [];
  constructor(
    public exampleDatabase: TscCycleTableService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<AdvanceTable[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.exampleDatabase.dataChange,
      this._sort.sortChange,
      this.filterChange,
      this.paginator.page,
    ];
    this.exampleDatabase.getAllAdvanceTables();
    return merge(...displayDataChanges).pipe(
      map(() => {
        // Filter data
        this.filteredData = this.exampleDatabase.data
          .slice()
          .filter((advanceTable: AdvanceTable) => {
            const searchStr = (
              advanceTable.cdate +
              advanceTable.title +
              advanceTable.mname +
              advanceTable.priority +
              advanceTable.id
            ).toLowerCase();
            return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
          });
        // Sort filtered data
        const sortedData = this.sortData(this.filteredData.slice());
        // Grab the page's slice of the filtered sorted data.
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        this.renderedData = sortedData.splice(
          startIndex,
          this.paginator.pageSize
        );
        return this.renderedData;
      })
    );
  }
  disconnect() {
    //disconnect
  }
  /** Returns a sorted copy of the database data. */
  sortData(data: AdvanceTable[]): AdvanceTable[] {
    if (!this._sort.active || this._sort.direction === "") {
      return data;
    }
    return data.sort((a, b) => {
      let propertyA: number | string = "";
      let propertyB: number | string = "";
      switch (this._sort.active) {
        case "id":
          [propertyA, propertyB] = [a.id, b.id];
          break;
          case "cdate":
            [propertyA, propertyB] = [a.cdate, b.cdate];
            break;
        case "title":
          [propertyA, propertyB] = [a.title, b.title];
          break;
        case "mname":
          [propertyA, propertyB] = [a.mname, b.mname];
          break;
        case "priority":
          [propertyA, propertyB] = [a.priority, b.priority];
          break;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === "asc" ? 1 : -1)
      );
    });
  }
}

