import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UnsubscribeOnDestroyAdapter } from "@shared";
import { RequirementsService } from "app/requirements/requirements.service";
import { Location } from "@angular/common";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { AdvanceTable } from "app/requirements/req.model";
import * as XLSX from "xlsx";
import Adapter from "./ckeditorAdapter";

@Component({
  selector: "app-test-sd-screen",
  templateUrl: "./test-sd-screen.component.html",
  styleUrl: "./test-sd-screen.component.scss",
})
export class TestSdScreenComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, OnDestroy
{
  data: any;
  advanceTable?: RequirementsService;
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
    private location: Location,
    private fb: UntypedFormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    const navigation = this.location.getState() as { rowData?: any };
    this.data = navigation.rowData;
    console.log(this.data);

    if (this.data && !this.data.rows) {
      this.data.rows = [];
    }

    this.Form = this.fb.group({
      comments: [this.advanceTable1?.comments || ""],
      editcomments: [this.advanceTable1?.editcomments || ""],
    });
  }
  resetForm(): void {
    const commentsValue = this.Form.get("comments")?.value || "";
    const plainText = this.stripSpecificHtmlTags(commentsValue);
    console.log({ comments: plainText });
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
}
