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
import { saveAs } from "file-saver";
import "jspdf-autotable";
import { HeaderService } from "app/layout/header/header.service";
import { TranslateService } from "@ngx-translate/core";
import { RequirementsService } from "./requirements.service";
import { AdvanceTable } from "./req.model";
import { ReqFormComponent } from "./dialog/req-form/req-form.component";
import { CommonService } from "app/services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {AfterViewInit, inject} from '@angular/core';
import { Sort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: "app-requirements",
  templateUrl: "./requirements.component.html",
  styleUrl: "./requirements.component.scss",
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class RequirementsComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  private _liveAnnouncer = inject(LiveAnnouncer);

  displayedColumns1: string[] = ["select",'position', 'name', 'weight', 'symbol', 'actions'];
  dataSource1 = new MatTableDataSource(ELEMENT_DATA);
  ngAfterViewInit() {
    this.dataSource1.sort = this.sort;
  }
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  isTblLoading = true;
  displayedColumns = [
    "select",
    "reqid",
    "title",
    "mname",
    "priority",
    "status",
    "reviewer",
    "comments",
    "file",
    "actions",
  ];
  exampleDatabase?: RequirementsService;
  dataSource!: ExampleDataSource;
  selection = new SelectionModel<AdvanceTable>(true, []);
  id?: number;
  advanceTable?: RequirementsService;
  deldata: any[] = [];
  addBoolean: boolean = false;
  private shouldDisplayReqSubscription!: Subscription;
  storeAllFile: any[] = [];
  uploadedFilesPreset: boolean = false;
  storeXlFile: any[] = [];
  typeSelected: string;
  private startX!: number;
  private startWidth!: number;
  private currentResizer!: HTMLElement;
  displayReqId = true;
  displayTitle = true;
  displayMname = true;
  displayPriority = true;
  displayUservalue = true;
  displayCost = true;
  displayStatus = true;
  displayReStatus = true;
  displayReviewer = true;
  displayDSprint = true;
  displayComments = true;
  displayFile = true;
  toggleColumn(column: string, checked: boolean) {
    console.log(`Toggling ${column}: ${checked}`);
    if (column === "reqid") {
      this.displayReqId = checked;
    } else if (column === "title") {
      this.displayTitle = checked;
    } else if (column === "mname") {
      this.displayMname = checked;
    } else if (column === "priority") {
      this.displayPriority = checked;
    } else if (column === "uservalue") {
      this.displayUservalue = checked;
    } else if (column === "cost") {
      this.displayCost = checked;
    } else if (column === "status") {
      this.displayStatus = checked;
    } else if (column === "restatus") {
      this.displayReStatus = checked;
    } else if (column === "reviewer") {
      this.displayReviewer = checked;
    } else if (column === "dsprint") {
      this.displayDSprint = checked;
    } else if (column === "comments") {
      this.displayComments = checked;
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

    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent) => {
    const newWidth = this.startWidth + (event.pageX - this.startX);
    this.currentResizer.style.width = `${newWidth}px`;
  };

  onMouseUp = () => {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
  };

  constructor(
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public advanceTableService: RequirementsService,
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
  clickTimeout: any = null;
  openNewTab(row: any): void {
        if (this.clickTimeout) {
          clearTimeout(this.clickTimeout);
          this.clickTimeout = null;
        }
    
        // Set a new timer for the single-click event
        this.clickTimeout = setTimeout(() => {
          console.log('Navigating to detail screen for bug:', row);
          this.router.navigate(['/req-detail-screen'], { state: { rowData: row } });
        }, 250); // Delay to wait for possible double-click
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
  selectedPriority!: string;
  allPriorities: string[] = [];
  priorities: string[] = [];
  ngOnInit() {


            // Subscribe to the bug added event
            this.advanceTableService.reqAdded$.subscribe(() => {
              console.log("emitted");
              this.refresh();
              this.refreshTable();
            });

    this.advanceTableService.data$.subscribe((data) => {
      console.log("Data in RequirementsComponent:", data);
      this.isTblLoading = false;
    });
    this.shouldDisplayReqSubscription =
      this.headerService.shouldDisplayReq$.subscribe((shouldDisplay) => {
        if (shouldDisplay) {
          this.addNew();
        }
      });
    this.loadData();
  }
  refreshing(): void {
    this.advanceTableService.refreshData();
  }
  override ngOnDestroy() {
    // Unsubscribe when the component is destroyed to avoid memory leaks
    this.shouldDisplayReqSubscription.unsubscribe();
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
    const dialogRef = this.dialog.open(ReqFormComponent, {
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
    const dialogRef = this.dialog.open(ReqFormComponent, {
      data: {
        advanceTable: row,
        action: "view",
        fileData: row.file,
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
    console.log(row);
      // If a double-click happens, cancel the single-click action
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
      }
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
    const dialogRef = this.dialog.open(ReqFormComponent, {
      data: {
        advanceTable: row,
        id: row.id,
        action: "edit",
        fileData: row.file,
        fileSize: row.size,
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
    const dialogRef = this.dialog.open(ReqFormComponent, {
      data: {
        advanceTable: row,
        id: row.id,
        action: "delete",
        data: this.selection.selected.length,
        fileData: row.file,
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
  downloadImage(row: any): void {
    console.log(row.file);

    for (const fileObject of row.file) {
      // Access the actual File object
      const file = fileObject.name;

      const anchor = document.createElement("a");

      // Ensure that file is a Blob or File object
      if (file instanceof Blob || file instanceof File) {
        anchor.href = URL.createObjectURL(file);
        anchor.download = (file as any).name;
        anchor.click();
        URL.revokeObjectURL(anchor.href);
      } else {
        // console.error('Invalid file object:', file);
      }
    }

    const extension = this.getFileExtension(row.file);
    const fileName1 = this.getFileName(row.file);
    const fileName = `${fileName1}.${extension}`;
    saveAs(row.file, fileName);
  }
  private getFileExtension(filename: string): string {
    return filename.split(".").pop() || "jpg";
  }
  private getFileName(filePath: string) {
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExtension = fileName.split(".")[0]; // Split by dot and take the first part
    return fileNameWithoutExtension;
  }
  // openDeletebulk() {
  //   if (this.selection.selected.length > 0) {
  //     const totalSelect = this.selection.selected.length;
  //     this.deldata = this.selection.selected.map((o) => o.id);

  //     let tempDirection: Direction;
  //     if (localStorage.getItem("isRtl") === "true") {
  //       tempDirection = "rtl";
  //     } else {
  //       tempDirection = "ltr";
  //     }

  //     const dialogRef = this.dialog.open(ReqFormComponent, {
  //       data: {
  //         advanceTable: "1",
  //         action: "deleteRecord",
  //         data: this.selection.selected.length,
  //       },
  //       direction: tempDirection,
  //     });

  //     this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
  //       if (result === 1) {
  //         // Delete selected rows from the data source
  //         if (this.exampleDatabase) {
  //           this.exampleDatabase.dataChange.next(
  //             this.exampleDatabase.dataChange.value.filter(
  //               (row) => !this.selection.isSelected(row)
  //             )
  //           );
  //         }
  //         this.selection.clear();
  //         this.refreshTable();
  //         const message =
  //           totalSelect === 1
  //             ? "1 Record deleted successfully!"
  //             : `${totalSelect} Records deleted successfully!`;
  //         this.showNotification("snackbar-delete", message, "bottom", "center");
  //       }
  //     });
  //   } else {
  //     // Show an error message or handle the case when exactly 2 rows are not selected.
  //   }
  // }
  openDeletebulk() {
    if (this.selection.selected.length > 0) {
      const totalSelect = this.selection.selected.length;
      this.deldata = this.selection.selected.map((o) => o.id);  // Array of selected IDs
  
      let tempDirection: Direction;
      if (localStorage.getItem("isRtl") === "true") {
        tempDirection = "rtl";
      } else {
        tempDirection = "ltr";
      }
  
      const dialogRef = this.dialog.open(ReqFormComponent, {
        data: {
          ids: this.deldata,  // Pass the selected IDs to the form
          action: "deleteRecord",
          data: totalSelect,
        },
        direction: tempDirection,
      });
  
      this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
        if (result === 1) {
          // Update data source after deletion
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
      // Handle case when no rows are selected
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
    this.exampleDatabase = new RequirementsService(this.httpClient);
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
      if (!this.displayReqId == false)
        row[this.translateService.instant("Req Id")] = x.id;
      if (this.displayTitle)
        row[this.translateService.instant("Title")] = x.title;
      if (this.displayMname)
        row[this.translateService.instant("Module Name")] = x.mname;
      if (this.displayPriority)
        row[this.translateService.instant("Priority")] = x.priority;
      if (this.displayStatus)
        row[this.translateService.instant("Status")] = x.status;
      if (this.displayReviewer)
        row[this.translateService.instant("Reviewer")] = x.reviewer;
      if (this.displayComments)
        row[this.translateService.instant("Comments")] = x.comments;
      if (this.displayFile) row[this.translateService.instant("File")] = x.file;
      return row;
    });

    TableExportUtil.exportToExcel(exportData, "Requirements");
  }

  exportCSV() {
    // Prepare the data for CSV export
    const exportData = this.dataSource.filteredData.map((x) => {
      const row: Partial<TableElement> = {};

      // Include columns based on visibility state
      if (!this.displayReqId == false)
        row[this.translateService.instant("Req Id")] = x.id;
      if (this.displayTitle)
        row[this.translateService.instant("Title")] = x.title;
      if (this.displayMname)
        row[this.translateService.instant("Module Name")] = x.mname;
      if (this.displayPriority)
        row[this.translateService.instant("Priority")] = x.priority;
      if (this.displayStatus)
        row[this.translateService.instant("Status")] = x.status;
      if (this.displayReviewer)
        row[this.translateService.instant("Reviewer")] = x.reviewer;
      if (this.displayComments)
        row[this.translateService.instant("Comments")] = x.comments;
      if (this.displayFile) row[this.translateService.instant("File")] = x.file;
      return row;
    });

    // // Call the exportToCSV function to export the data
    TableExportUtil.exportToCSV(exportData, "Requirements");
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
    public exampleDatabase: RequirementsService,
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
              advanceTable.title +
              advanceTable.mname +
              advanceTable.priority +
              advanceTable.status +
              advanceTable.reviewer +
              advanceTable.comments +
              advanceTable.file +
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
        case "title":
          [propertyA, propertyB] = [a.title, b.title];
          break;
        case "mname":
          [propertyA, propertyB] = [a.mname, b.mname];
          break;
        case "priority":
          [propertyA, propertyB] = [a.priority, b.priority];
          break;
        case "status":
          [propertyA, propertyB] = [a.status, b.status];
          break;
        case "reviewer":
          [propertyA, propertyB] = [a.reviewer, b.reviewer];
          break;
        case "comments":
          [propertyA, propertyB] = [a.comments, b.comments];
          break;
        case "file":
          [propertyA, propertyB] = [a.file, b.file];
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
