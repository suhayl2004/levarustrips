import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from "@shared";
import { Location } from "@angular/common";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import * as XLSX from "xlsx";
import Adapter from "./ckeditorAdapter";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { TestCycleService } from "app/test-cycle/test-cycle.service";
import { BehaviorSubject, fromEvent, map, merge, Observable } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { AdvanceTable } from "app/test-cycle/test-cycle.model";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { HttpClient } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { HeaderService } from "app/layout/header/header.service";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "app/services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Direction } from "@angular/cdk/bidi";
import { TestCycleDcFormComponent } from "./dialog/test-cycle-dc-form/test-cycle-dc-form.component";

@Component({
  selector: "app-test-cycle-dc",
  templateUrl: "./test-cycle-dc.component.html",
  styleUrl: "./test-cycle-dc.component.scss",
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class TestCycleDcComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  data: any;
  advanceTable?: TestCycleService;
  advanceTable1?: AdvanceTable;
  panelOpenState = true;
  Form!: UntypedFormGroup;
  currentTimestamp: string = "";
  comments: { text: string; timestamp: string }[] = [];
  activityLog: { action: string; detail: string; timestamp: string }[] = [];
  isEditing: boolean = false;
  editingIndex: number | null = null;
  lotsOfTabs = [
    { title: "Overview", content: "Content 1" },
    { title: "Activity", content: "Content 2" },
  ];
  uploadedImageName: string | null = null;
  displayedColumns = [
    "select",
    "tcid",
    "tctitle",
    "tscenario",
    "assignedto",
    "eresult",
  ];
  readonly panelSwichState = signal(false);
  public Editor: any = ClassicEditor;
  public tableData: any;
  public tableTitle: any;
  public recordsPerPage = 10;
  public tableRecords = [];
  public pageStartCount = 0;
  public pageEndCount = 10;
  public totalPageCount = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private location: Location,
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    public dialog: MatDialog,
    public advanceTableService: TestCycleService,
    private snackBar: MatSnackBar,
    public Common: CommonService
  ) {
    super();
  }
  selectAll: boolean = false;
  selection = new SelectionModel<AdvanceTable>(true, []);
  exampleDatabase?: TestCycleService;
  dataSource!: ExampleDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild("filter", { static: true }) filter!: ElementRef;
  expandedElement!: AdvanceTable | null;
  expandedRows: Set<any> = new Set();
  deldata: any[] = [];
  isRowExpanded(row: AdvanceTable): boolean {
    // return this.expandedRows.has(row);
    return this.expandedElement === row;
  }
  getStepsForElement(element: any): any[] {
    // Filter rows for the current element
    const rows = this.selectedItems.filter((row) => row === element);
    // Return rows with step numbers starting from 1
    // return rows.map((row, index) => ({ ...row, stepNumber: index + 1 }));
    return rows.map((row, index) => ({
      ...row,
      stepNumber: index + 1,
      result: row.result || "Awaiting", // Set default value to 'Awaiting'
    }));
  }
  trackByStepNumber(index: number, item: any): number {
    return item.stepNumber; // Assuming stepNumber is unique
  }
  ngOnInit(): void {
    // Example of initializing selectedItems with default result value
    this.selectedItems = this.selectedItems.map((item) => ({
      ...item,
      result: item.result || "Awaiting", // Set default value if not present
    }));
    // this.loadData();
    const navigation = this.location.getState() as { rowData?: any };
    this.data = navigation.rowData;
    console.log(this.data);
    console.log(this.lotsOfTabs[0].title);

    // Subscribe to selectedItems changes
    this.advanceTableService.selectedItems$.subscribe((items) => {
      // Filter out any duplicates before appending
      const newItems = items.filter(
        (item) =>
          !this.selectedItems.some(
            (existingItem) => existingItem.id === item.id
          )
      );

      // Append new selected items to existing selectedItems
      this.selectedItems = [...this.selectedItems, ...newItems];
      console.log("Updated selected items:", this.selectedItems);
      this.originalItems = [...this.selectedItems]; // Keep the original items updated
    });

    // Subscribe to selectedScenariosItems changes
    this.advanceTableService.selectedScenariosItems$.subscribe((items) => {
      // Filter out any duplicates before appending
      const newScenarioItems = items.filter(
        (item) =>
          !this.selectedItems.some(
            (existingItem) => existingItem.id === item.id
          )
      );
      console.log(newScenarioItems);
      // Append new selected scenario items to existing selectedItems
      this.selectedItems = [...this.selectedItems, ...newScenarioItems];
      console.log("Updated selected scenarios items:", this.selectedItems);
      this.originalItems = [...this.selectedItems]; // Keep the original items updated
    });
    this.cdr.detectChanges();
  }
  selectedItems: any[] = [];
  originalItems: any[] = [];
  scenarioItems: any[] = [];
  addNew() {
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(TestCycleDcFormComponent, {
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

      const dialogRef = this.dialog.open(TestCycleDcFormComponent, {
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
  toggleSelectAll(event: any): void {
    // const isChecked = event.target.checked;
    // console.log(isChecked);
    this.selectAll = event.target.checked;
  }

  resetForm(): void {
    const commentsValue = this.Form.get("comments")?.value || "";
    const plainText = this.stripSpecificHtmlTags(commentsValue);
    console.log({ comments: plainText });

    //   this.Form.reset({
    //     comments: this.advanceTable1?.comments,
    //   });

    this.Form.reset({
      comments: "",
    });
  }

  stripSpecificHtmlTags(html: string): string {
    return html.replace(/<\/?(b|i|p|ul|ol|li|strong|em)>/g, "");
  }
  addComments(): void {
    const commentsValue = this.Form.get("comments")?.value || "";
    const timestamp = this.formatDate(new Date());

    let logMessage = `A comment was added: ${commentsValue}`;

    // Check if an image was uploaded
    if (this.uploadedImageName) {
      logMessage = `A comment was added with file name: ${this.uploadedImageName}`;
      this.uploadedImageName = null; // Reset the uploaded image name
    }

    this.comments.push({ text: commentsValue, timestamp });
    this.logActivity("added", logMessage, timestamp);
    this.Form.reset(); // Reset the form after adding the comment
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  editComment(index: number): void {
    this.editingIndex = index;
    this.Form.get("editcomments")?.setValue(this.comments[index].text);
  }

  onReady(editor: any): void {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return new Adapter(loader, editor.config, this);
    };
  }
  updateComment(index: number): void {
    const originalComment = this.comments[index].text;
    const editedComment = this.Form.get("editcomments")?.value || "";
    const timestamp = this.formatDate(new Date());

    this.comments[index].text = editedComment;
    this.comments[index].timestamp = timestamp;

    // Update activity log with HTML formatting preserved
    // this.logActivity('edited', `The text for a comment was changed from <span>${originalComment}</span> to <span>${editedComment}</span> by Surya.J`, timestamp);
    this.logActivity(
      "edited",
      `The text for a comment was changed from <span>${originalComment}</span> to <span>${editedComment}</span>`,
      timestamp
    );
    this.editingIndex = null;
    this.Form.get("editcomments")?.reset();
  }

  public uploadData(e: any) {
    console.log(e.target.files[0]);
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(<unknown>e.target);
    if (target.files.length !== 1) {
      throw new Error("Cannot use multiple files");
    }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: "binary" });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
      console.log(data); // Data will be logged in array format containing objects
      this.tableData = data;
      this.tableTitle = Object.keys(this.tableData[0]);
      this.tableRecords = this.tableData.slice(
        this.pageStartCount,
        this.pageEndCount
      );
      this.totalPageCount = this.tableData.length / this.recordsPerPage;
    };
  }
  cancelEdit(): void {
    this.editingIndex = null;
    this.Form.get("editcomments")?.reset();
  }

  deleteComment(index: number): void {
    const removedComment = this.comments[index].text;
    const timestamp = this.formatDate(new Date());

    this.comments.splice(index, 1);

    // Update activity log with HTML formatting preserved
    this.logActivity(
      "removed",
      `A comment was removed: <span>${removedComment}</span>`,
      timestamp
    );
  }

  logActivity(action: string, detail: string, timestamp: string): void {
    this.activityLog.push({ action, detail, timestamp });
  }
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.selectedItems.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.selectedItems.forEach((row) => this.selection.select(row)); // Use selectedItems or renderedData
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
