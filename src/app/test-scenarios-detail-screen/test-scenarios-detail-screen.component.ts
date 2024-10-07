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
import { RequirementsService } from "app/requirements/requirements.service";
import { Location } from "@angular/common";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
// import { AdvanceTable } from "app/requirements/req.model";
import Adapter from "./ckeditorAdapter";
import * as XLSX from "xlsx";
import { TestScenariosService } from "app/test-scenarios/test-scenarios.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatMenuTrigger } from "@angular/material/menu";
import { BehaviorSubject, fromEvent, map, merge, Observable } from "rxjs";
import { DataSource, SelectionModel } from "@angular/cdk/collections";
import { AdvanceTable } from "app/test-scenarios/test-scenarios.model";
import { TestScenariosDetailScreenService } from "./test-scenarios-detail-screen.service";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "app/services/common.service";
import { MatDialog } from "@angular/material/dialog";
import { Direction } from "@angular/cdk/bidi";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { TestScenariosDetailFormComponent } from "./dialog/test-scenarios-detail-form/test-scenarios-detail-form.component";

@Component({
  selector: 'app-test-scenarios-detail-screen',
  templateUrl: './test-scenarios-detail-screen.component.html',
  styleUrl: './test-scenarios-detail-screen.component.scss',
})
export class TestScenariosDetailScreenComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  data: any;
  advanceTable?: TestScenariosService;
  advanceTable1?: AdvanceTable;
  advanceTable2?: AdvanceTable;
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
    public advanceTableService: RequirementsService,
    public advanceTableService1: TestScenariosDetailScreenService,
    private location: Location,
    private fb: UntypedFormBuilder,
    public httpClient: HttpClient,
    private router: Router,
    public Common: CommonService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    super();
  }
  originalItems: any[] = []; // Store the original data
  selectedItems: any[] = []; // Store the filtered data
  currentPage: number = 0;
pageSize: number = 10;
  filteredItems: any[] = []; // To hold the filtered data
  filterValue: string = '';
  displayedColumns = [
    "select",
    "tcid",
    "cdate",
    "title",
    "mname",
    "priority"
  ];
  displayTcId = true;
  displayCdate = true;
  displayTitle = true;
  displayMname = true;
  displayPriority = true;
  toggleColumn(column: string, checked: boolean) {
    console.log(`Toggling ${column}: ${checked}`);
    if (column === 'tcid') {
      this.displayTcId = checked;
    } else if (column === 'cdate') {
      this.displayCdate = checked;
    } else if (column === 'title') {
      this.displayTitle = checked;
    } else if (column === 'mname') {
      this.displayMname = checked;
    } else if (column === 'priority') {
      this.displayPriority = checked;
    }
  }
  refresh() {
    this.loadData1();
  }
  public loadData1() {
    this.exampleDatabase = new TestScenariosService(this.httpClient);
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
  // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild("filter", { static: true }) filter!: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu?: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  exampleDatabase?: TestScenariosService;
  dataSource!: ExampleDataSource;
  ngOnInit(): void {
    // this.paginatorItems = [...this.selectedItems];
    this.updatePaginatedItems();
    // console.log('Selected Items:', this.selectedItems);
    // // this.filteredItems = this.selectedItems; 
    // this.filteredItems = [...this.selectedItems];
    // console.log('Filtered Items on Init:', this.filteredItems);
    // console.log('Filtered Items:', this.filteredItems);


    //if selectedItems into filteredItems then below loadData will enable
    // this.loadData();


    setTimeout(() => {
      console.log('Filtered Items after loadData:', this.filteredItems);
    }, 500); // Adjust delay as needed
    const navigation = this.location.getState() as { rowData?: any,selectedItems?: any[] };
    this.data = navigation.rowData;
    console.log(this.data);
    this.selectedItems = navigation.selectedItems || [];
    console.log('Selected Items:', this.selectedItems);

    this.originalItems = [...this.selectedItems];
    console.log(this.originalItems);
    this.Form = this.fb.group({
      comments: [this.advanceTable1?.comments || ""],
      editcomments: [this.advanceTable1?.editcomments || ""],
    });
    this.sortItems();
  }
  onPageChange(event: PageEvent): void {
    console.log(event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedItems();

    console.log(this.pageSize);
    console.log(this.currentPage);

  }
  openNewTab(row: any): void {
    console.log(row);
    if (!row.rows) {
      row.rows = [];
    }

    //for single step,left & right
    // row.rows.push({
    //   step: '1',
    //   left: 'User inputs the travel start date and end date',
    //   right: 'Date picker is displayed from where user can choose the dates'
    // });
    
    //for multiple step,left & right
      // Add multiple step objects
  row.rows.push(
    {
      step: '1',
      left: 'User inputs the travel start date and end date',
      right: 'Date picker is displayed from where user can choose the dates'
    },
    {
      step: '2',
      left: 'User selects the number of passengers',
      right: 'A drop-down menu is displayed with passenger options'
    },
    {
      step: '3',
      left: 'User clicks the search button',
      right: 'The system searches for available flights'
    }
  );

    // row.step = '1';
    // row.left = 'User inputs the travel start date and end date';
    // row.right = 'Date picker is displayed from where user can choose the dates';
  
    console.log('Updated row:', row);
    // this.router.navigate(['/data', row.id]);
    this.router.navigate(['/test-sd-screen'], { state: { rowData: row } });
  }
  updatePaginatedItems(): void {
    if (this.selectedItems.length === 0) return;

    // Calculate start and end index based on page size and page index
    const startIndex = this.paginator.pageIndex * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.selectedItems.length);

    // Update the paginator length to reflect the filtered items length
    this.paginator.length = this.selectedItems.length;

    console.log(this.paginator.length);
    console.log(this.selectedItems.length);

    // Ensure selectedItems is sliced correctly based on the page size and page index
    this.selectedItems = this.originalItems.slice(startIndex, endIndex);
    console.log(this.selectedItems);
  }
  loadData(): void {
    this.advanceTableService1.getAllAdvanceTables().subscribe(data => {
      this.selectedItems = data; // Assign the fetched data
      this.filteredItems = [...this.selectedItems]; // Initialize filteredItems
      console.log('Selected Items:', this.selectedItems);
      console.log('Filtered Items:', this.filteredItems);
    });
  }
  loadData2(): void {
    this.advanceTableService1.getAllAdvanceTables().subscribe(data => {
      this.originalItems = data;
      this.selectedItems = [...this.originalItems]; // Initialize with the original data
      console.log('Original Items:', this.originalItems);
      console.log('Selected Items:', this.selectedItems);
    });
  }
  
  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //   this.filterValue = filterValue;
  //   this.filteredItems = this.selectedItems.filter(item =>
  //     Object.values(item).some((value:any) =>
  //       value.toString().toLowerCase().includes(filterValue)
  //     )
  //   );
  // }

  //if filteredItems of applyFilter then below method enable

  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //   this.filterValue = filterValue;
  //   this.filteredItems = this.selectedItems.filter(item =>
  //     Object.values(item).some((value:any) =>
  //       value.toString().toLowerCase().includes(filterValue)
  //     )
  //   );
  //   console.log('Filtered Items:', this.filteredItems); // Debugging
  // }

  //if selectedItems of applyFilter then below method enable

  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  //   this.filterValue = filterValue;
  //   this.selectedItems = this.selectedItems.filter(item =>
  //     Object.values(item).some((value:any) =>
  //       value.toString().toLowerCase().includes(filterValue)
  //     )
  //   );
  //   console.log('Selected Items:', this.selectedItems); // Debugging
  // }
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.selectedItems = this.originalItems.filter(item =>
      Object.values(item).some((value: any) =>
        value.toString().toLowerCase().includes(filterValue)
      )
    );
    console.log('Filtered Selected Items:', this.selectedItems);

        // Update paginator length and reset page index
        this.paginator.length = this.selectedItems.length;
        this.paginator.pageIndex = 0; // Reset page index
        this.updatePaginatedItems(); 

  }
  

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => {
        this.sortItems();
      });
      this.sortItems(); // Initial sort
    }
  }
//if filteredItems of applyFilter then below method enable
  
  // sortItems(): void {
  //   const active = this.sort?.active;
  //   const direction = this.sort?.direction;
  
  //   if (!active || direction === '') {
  //     return;
  //   }
  
  //   this.filteredItems.sort((a, b) => {
  //     let valueA = a[active] ?? '';
  //     let valueB = b[active] ?? '';
  
  //     let comparison = 0;
  
  //     if (active === 'cdate') {
  //       comparison = new Date(valueA).getTime() - new Date(valueB).getTime();
  //     } else {
  //       valueA = valueA.toString();
  //       valueB = valueB.toString();
  //       comparison = valueA.localeCompare(valueB);
  //     }
  
  //     return direction === 'asc' ? comparison : -comparison;
  //   });
  
  //   // Re-assign sorted data to trigger change detection
  //   this.filteredItems = [...this.filteredItems];
  // }


//if selectedItems of applyFilter then below method enable

  sortItems(): void {
    const active = this.sort?.active;
    const direction = this.sort?.direction;
  
    if (!active || direction === '') {
      return;
    }
  
    this.selectedItems.sort((a, b) => {
      let valueA = a[active] ?? '';
      let valueB = b[active] ?? '';
  
      let comparison = 0;
  
      if (active === 'cdate') {
        comparison = new Date(valueA).getTime() - new Date(valueB).getTime();
      } else {
        valueA = valueA.toString();
        valueB = valueB.toString();
        comparison = valueA.localeCompare(valueB);
      }
  
      return direction === 'asc' ? comparison : -comparison;
    });
  
    // Re-assign sorted data to trigger change detection
    this.selectedItems = [...this.selectedItems];
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

  selection = new SelectionModel<AdvanceTable>(true, []);
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
  addBoolean: boolean = false;
  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
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
    const dialogRef = this.dialog.open(TestScenariosDetailFormComponent, {
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
          this.advanceTableService1.getDialogData()
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
          this.advanceTableService1.getDialogData()
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
  addExist() {
    this.addBoolean = true;
    this.Common.setAddBooleanValue(this.addBoolean);
    this.Common.setEditBooleanValue(false);
    let tempDirection: Direction;
    if (localStorage.getItem("isRtl") === "true") {
      tempDirection = "rtl";
    } else {
      tempDirection = "ltr";
    }
    const dialogRef = this.dialog.open(TestScenariosDetailFormComponent, {
      data: {
        advanceTable: this.advanceTable,
        action: "addExist",
      },
      direction: tempDirection,
    });
    this.subs.sink = dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase?.dataChange.value.unshift(
          this.advanceTableService1.getDialogData()
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
          this.advanceTableService1.getDialogData()
        );
        this.refreshTable();
        this.showNotification(
          "snackbar-success",
          "Record added successfully!",
          "bottom",
          "center"
        );
        this.addExist();
      }
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
    public exampleDatabase: TestScenariosService,
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
              advanceTable.title +
              advanceTable.mname +
              advanceTable.priority +
              advanceTable.cdate +
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
        case "tcid":
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


