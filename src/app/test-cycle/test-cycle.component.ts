import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
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
import { AdvanceTable } from "./test-cycle.model";
import { TestCycleFormComponent } from "./dialog/test-cycle-form/test-cycle-form.component";
import { TestCycleService } from "./test-cycle.service";
import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
@Component({
  selector: "app-test-cycle",
  templateUrl: "./test-cycle.component.html",
  styleUrl: "./test-cycle.component.scss",
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class TestCycleComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  openNewTab(row: any): void {
    console.log(row);
    // this.router.navigate(['/data', row.id]);
    this.router.navigate(['/test-cycle-dc'], { state: { rowData: row } });
  }
  displayedColumns = [
    "select",
    "tcycleid",
    "title",
    "cdate",
    "udate",
    "createdby",
    "owner",
    "items",
    "eresults",
    "edate",
    "assignedto",
    "actions",
  ];
  exampleDatabase?: TestCycleService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<AdvanceTable>(true, []); 
  id?: number;
  advanceTable?: TestCycleService;
  deldata: any[] = [];
  private shouldDisplayTestCyclesSubscription!: Subscription;
  typeSelected: string;
  private startX!: number;
  private startWidth!: number;
  private currentResizer!: HTMLElement;
  displayTcId = true;
  displayTitle = true;
  displayCdate = true;
  displayUdate = true;
  displayCby = true;
  displayOwner = true;
  displayItems = true;
  displayEresults = true;
  displayEdate = true;
  displayAto = true;

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public advanceTableService: TestCycleService,
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
  toggleColumn(column: string, checked: boolean) {
    console.log(`Toggling ${column}: ${checked}`);
    if (column === 'tcid') {
      this.displayTcId = checked;
    } else if (column === 'title') {
      this.displayTitle = checked;
    } else if (column === 'cdate') {
      this.displayCdate = checked;
    }else if (column === 'udate') {
      this.displayUdate = checked;
    } else if (column === 'createdby') {
      this.displayCby = checked;
    } else if (column === 'owner') {
      this.displayOwner = checked;
    } else if (column === 'items') {
      this.displayItems = checked;
    } else if (column === 'eresults') {
      this.displayEresults = checked;
    } else if (column === 'edate') {
      this.displayEdate = checked;
    } else if (column === 'assignedto') {
      this.displayAto = checked;
    }
  }
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
  public showSpinner(): void {
    console.log("Spinner is being shown");
    this.spinnerService.show();
    this.cdr.detectChanges();

    setTimeout(() => {
      this.spinnerService.hide();
      this.cdr.detectChanges();
    }, 2000); // 5 seconds
  }
  getActiveItem1(key: string): string {
    return this.translateService.instant(key);
  }
  getActiveItem2(key: string): string {
    return this.translateService.instant(key);
  }
  ngOnInit() {
    this.shouldDisplayTestCyclesSubscription =
      this.headerService.shouldDisplayTestCycles$.subscribe((shouldDisplay) => {
        if (shouldDisplay) {
          this.addNew();
        }
      });
    this.loadData();
  }
  override ngOnDestroy() {
    // Unsubscribe when the component is destroyed to avoid memory leaks
    this.shouldDisplayTestCyclesSubscription.unsubscribe();
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

  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(TestCycleFormComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: "add",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase?.dataChange.value.unshift(
          this.advanceTableService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Record added successfully!",
          "bottom",
          "center"
        );
      }
      if (result === 2) {
        this.exampleDatabase?.dataChange.value.unshift(
          this.advanceTableService.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Record added successfully!",
          "bottom",
          "center"
        );
        this.addNew();
      }
    });
  }
  calculateBarWidth(executionResults: any): number {
    // Implement your logic to calculate the width based on executionResults
    // For example:
    if (executionResults.status === 'success') {
        return 100; // 100% for success
    } else if (executionResults.status === 'failed') {
        return 50; // 50% for failed
    } else {
        return 25; // 25% for in progress
    }
}
  viewCall(row: AdvanceTable) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(TestCycleFormComponent, {
      data: {
        advanceTable: row,
        action: "view",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.advanceTableService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            "black",
            "Edit record successfully!",
            "bottom",
            "center"
          );
        }
      }
    });
  }
  editCall(row: AdvanceTable) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(TestCycleFormComponent, {
      data: {
        advanceTable: row,
        action: "edit",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // Then you update that record using data from dialogData (values you enetered)
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value[foundIndex] =
            this.advanceTableService.getDialogData();
          // And lastly refresh table
          this.refreshTable();
          this.showNotification(
            "snackbar-info",
            "Edit record successfully!",
            "bottom",
            "center"
          );
        }
      }
    });
  }

  deleteItem(row: AdvanceTable) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(TestCycleFormComponent, {
      data: {
        advanceTable: row,
        action: "delete",
        data: this.selection.selected.length,
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        const foundIndex = this.exampleDatabase?.dataChange.value.findIndex(
          (x) => x.id === this.id
        );
        // for delete we use splice in order to remove single object from DataService
        if (foundIndex != null && this.exampleDatabase) {
          this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
          this.refreshTable();
          this.showNotification(
            "snackbar-danger",
            "Delete record successfully!",
            "bottom",
            "center"
          );
        }
      }
    });
  }
  openDeletebulk() {
    if (this.selection.selected.length > 0) {
      const totalSelect = this.selection.selected.length;
      this.deldata = this.selection.selected.map((o) => o.id);

      let tempDirection: Direction;
      if (localStorage.getItem("isRtl") === "true") {
        tempDirection = "rtl";
      } else {
        tempDirection = "ltr";
      }

      const dialogRef = this.dialog.open(TestCycleFormComponent, {
        data: {
          advanceTable: "1",
          action: "deleteRecord",
          data: this.selection.selected.length,
        },
        direction: tempDirection,
      });

      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          // Delete selected rows from the data source
          if (this.exampleDatabase) {
            this.exampleDatabase.dataChange.next(
              this.exampleDatabase.dataChange.value.filter(
                (row) => !this.selection.isSelected(row)
              )
            );
          }
          this.selection.clear();
          this.refreshTable();
          const message =
            totalSelect === 1
              ? "1 Record deleted successfully!"
              : `${totalSelect} Records deleted successfully!`;
          this.showNotification("snackbar-delete", message, "bottom", "center");
        }
      });
    } else {
      // Show an error message or handle the case when exactly 2 rows are not selected.
    }
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.renderedData.length;
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
    this.exampleDatabase = new TestCycleService(this.httpClient);
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

  exportExcel() {
    const exportData = this.dataSource.filteredData.map((x) => {
      const row: Partial<TableElement> = {};
  
      // Include columns based on visibility state
      if (!this.displayTcId == false) row[this.translateService.instant("Test Cycle Id")] = x.id;
      if (this.displayTitle) row[this.translateService.instant("Title")] = x.title;
      if (!this.displayCdate == false) {
        row[this.translateService.instant("Created Date")] = formatDate(new Date(x.cdate), "dd/MM/yyyy", "en");
      }
      if (!this.displayUdate == false) {
        row[this.translateService.instant("Updated Date")] = formatDate(new Date(x.udate), "dd/MM/yyyy", "en");
      }
      if (this.displayCby) row[this.translateService.instant("Created By")] = x.createdby;
      if (this.displayOwner) row[this.translateService.instant("Owner")] = x.owner;
      if (this.displayItems) row[this.translateService.instant("items")] = x.items;
      if (this.displayEresults) row[this.translateService.instant("eresults")] = x.eresults;
      if (this.displayEdate) row[this.translateService.instant("edate")] = x.edate;
      if (this.displayAto) row[this.translateService.instant("assignedto")] = x.assignedto;
      return row;
    });
  
    TableExportUtil.exportToExcel(exportData, "Test Cycle");
  }
  exportCSV() {
    // key name with space add in brackets
    const exportData = this.dataSource.filteredData.map((x) => {
      const row: Partial<TableElement> = {};
  
      // Include columns based on visibility state
      if (!this.displayTcId == false) row[this.translateService.instant("Test Cycle Id")] = x.id;
      if (this.displayTitle) row[this.translateService.instant("Title")] = x.title;
      if (!this.displayCdate == false) {
        row[this.translateService.instant("Created Date")] = formatDate(new Date(x.cdate), "dd/MM/yyyy", "en");
      }
      if (!this.displayUdate == false) {
        row[this.translateService.instant("Updated Date")] = formatDate(new Date(x.udate), "dd/MM/yyyy", "en");
      }
      if (this.displayCby) row[this.translateService.instant("Created By")] = x.createdby;
      if (this.displayOwner) row[this.translateService.instant("Owner")] = x.owner;
      if (this.displayItems) row[this.translateService.instant("items")] = x.items;
      if (this.displayEresults) row[this.translateService.instant("eresults")] = x.eresults;
      if (this.displayEdate) row[this.translateService.instant("edate")] = x.edate;
      if (this.displayAto) row[this.translateService.instant("assignedto")] = x.assignedto;
      return row;
    });

    TableExportUtil.exportToCSV(exportData, "Test Cycle");
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
    public exampleDatabase: TestCycleService,
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
              advanceTable.udate +
              advanceTable.createdby +
              advanceTable.title +
              advanceTable.owner +
              advanceTable.items +
              advanceTable.eresults +
              advanceTable.edate +
              advanceTable.assignedto +
              advanceTable.sprint +
              advanceTable.testtype +
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
        case "udate":
          [propertyA, propertyB] = [a.udate, b.udate];
          break;
        case "createdby":
          [propertyA, propertyB] = [a.createdby, b.createdby];
          break;
        case "title":
          [propertyA, propertyB] = [a.title, b.title];
          break;
        case "owner":
          [propertyA, propertyB] = [a.owner, b.owner];
          break;
        case "items":
          [propertyA, propertyB] = [a.items, b.items];
          break;
        case "eresults":
          [propertyA, propertyB] = [a.eresults, b.eresults];
          break;
        case "edate":
          [propertyA, propertyB] = [a.edate, b.edate];
          break;
        case "assignedto":
          [propertyA, propertyB] = [a.assignedto, b.assignedto];
          break;
        case "sprint":
          [propertyA, propertyB] = [a.sprint, b.sprint];
          break;
        case "testtype":
          [propertyA, propertyB] = [a.testtype, b.testtype];
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
