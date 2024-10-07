import {
  ChangeDetectorRef,
  Component,
  ElementRef,
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
import { UserManagementService } from "./user-management.service";
import { AdvanceTable } from "./user-management.model";
import { UserManagementFormComponent } from "./dialog/user-management-form/user-management-form.component";
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class UserManagementComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  displayedColumns = [
    "select",
    "uname",
    "emailid",
    "actions",
  ];
  exampleDatabase?: UserManagementService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<AdvanceTable>(true, []);
  id?: number;
  advanceTable?: UserManagementService;
  deldata: any[] = [];
  addBoolean: boolean = false;
  private shouldDisplayUmanagementSubscription!: Subscription;
  storeAllFile: any[] = [];
  uploadedFilesPreset: boolean = false;
  storeXlFile: any[] = [];
  typeSelected: string;
  private startX!: number;
  private startWidth!: number;
  private currentResizer!: HTMLElement;
  displayEmailId = true;
  displayUname = true;
  toggleColumn(column: string, checked: boolean) {
    console.log(`Toggling ${column}: ${checked}`);
    if (column === 'emailid') {
      this.displayEmailId = checked;
    } else if (column === 'uname') {
      this.displayUname = checked;
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

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public advanceTableService: UserManagementService,
    private snackBar: MatSnackBar,
    private headerService: HeaderService,
    private translateService: TranslateService,
    public Common: CommonService,
    private spinnerService: NgxSpinnerService,
    private cdr: ChangeDetectorRef
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
    this.shouldDisplayUmanagementSubscription =
      this.headerService.shouldDisplayUmanagement$.subscribe((shouldDisplay) => {
        if (shouldDisplay) {
          this.addNew();
        }
      });
    this.loadData();
  }

  override ngOnDestroy() {
    // Unsubscribe when the component is destroyed to avoid memory leaks
    this.shouldDisplayUmanagementSubscription.unsubscribe();
  }
  isallFile(row: any): boolean {
    if (Array.isArray(row.file)) {
      this.uploadedFilesPreset = true;
      this.storeAllFile = row.file.map((file: any) => file.name.name);
      return this.storeAllFile.length > 0;
    }
    return false;
  }
  isXlFile(row: any): boolean {
    if (Array.isArray(row.file)) {
      this.storeXlFile = row.file
        .filter(
          (item: any) =>
            item.name.name.endsWith(".xlsx") || item.name.name.endsWith(".xls")
        )
        .map((item: any) => item.name.name);
      return this.storeXlFile.length > 0;
    }
    return false;
  }
  formatFileInformation(row: any): string {
    if (row.file instanceof Array) {
      return "";
    } else {
      return row.file;
    }
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
    this.addBoolean = true;
    this.Common.setAddBooleanValue(this.addBoolean);
    this.Common.setEditBooleanValue(false);
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(UserManagementFormComponent, {
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

  viewCall(row: AdvanceTable) {
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(UserManagementFormComponent, {
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
  editBoolean: boolean = false;
  editCall(row: AdvanceTable) {
    this.editBoolean = true;
    this.Common.setEditBooleanValue(this.editBoolean);
    this.Common.setAddBooleanValue(false);
    this.id = row.id;
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(UserManagementFormComponent, {
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
    const dialogRef = this.dialog.open(UserManagementFormComponent, {
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

      const dialogRef = this.dialog.open(UserManagementFormComponent, {
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
    this.exampleDatabase = new UserManagementService(this.httpClient);
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
      if (this.displayUname) row[this.translateService.instant("User Name")] = x.uname;
      if (!this.displayEmailId == false) row[this.translateService.instant("Email Id")] = x.emailid;
      return row;
    });
  
    TableExportUtil.exportToExcel(exportData, "User Management");
  }
  
  exportCSV() {
    // Prepare the data for CSV export
    const exportData = this.dataSource.filteredData.map((x) => {
      const row: Partial<TableElement> = {};
  
      // Include columns based on visibility state
      if (this.displayUname) row[this.translateService.instant("User Name")] = x.uname;
      if (!this.displayEmailId == false) row[this.translateService.instant("Email Id")] = x.emailid;
      return row;
    });

    // // Call the exportToCSV function to export the data
    TableExportUtil.exportToCSV(exportData, "User Management");
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
  priorityFilterChange = new BehaviorSubject<string>("");
  get filter(): string {
    return this.filterChange.value;
  }
  set filter(filter: string) {
    this.filterChange.next(filter);
  }
  get priorityFilter(): string {
    return this.priorityFilterChange.value;
  }
  set priorityFilter(priorityFilter: string) {
    this.priorityFilterChange.next(priorityFilter);
  }
  filteredData: AdvanceTable[] = [];
  renderedData: AdvanceTable[] = [];
  constructor(
    public exampleDatabase: UserManagementService,
    public paginator: MatPaginator,
    public _sort: MatSort
  ) {
    super();
    // Reset to the first page when the user changes the filter.
    this.filterChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.priorityFilterChange.subscribe(() => (this.paginator.pageIndex = 0));
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
              advanceTable.emailid +
              advanceTable.uname +
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
        case "emailid":
          [propertyA, propertyB] = [a.emailid, b.emailid];
          break;
        case "uname":
          [propertyA, propertyB] = [a.uname, b.uname];
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
