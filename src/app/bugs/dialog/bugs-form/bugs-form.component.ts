import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, HostListener, Inject, OnInit } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "app/services/common.service";
import { AdvanceTable } from "app/bugs/bugs.model";
import { BugsService } from "app/bugs/bugs.service";
import { RequirementsService } from "app/requirements/requirements.service";
import { TestCasesService } from "app/test-cases/test-cases.service";
import { TestScenariosService } from "app/test-scenarios/test-scenarios.service";
import { AuthService } from "app/authentication/auth.service";

export interface DialogData {
  // id: number;
  id: any;
  ids: number[];
  action: string;
  advanceTable: AdvanceTable;
  fileData: any;
  data: string;
}

@Component({
  selector: "app-bugs-form",
  templateUrl: "./bugs-form.component.html",
  styleUrl: "./bugs-form.component.scss",
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class BugsFormComponent implements OnInit {
  selectFormControl = new FormControl("", Validators.required);
  action: string;
  dialogTitle: string;
  advanceTableForm: UntypedFormGroup;
  advanceTable: AdvanceTable;
  apiAllFileds: any = [];
  fileDataArray: any = [];
  count: string | undefined;
  reqAllFields: any = [];
  tcasesAllFields: any = [];
  tscenariosAllFields: any = [];

  constructor(
    public dialogRef: MatDialogRef<BugsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: BugsService,
    public requirementsService: RequirementsService,
    public testCasesService: TestCasesService,
    public testScenariosService: TestScenariosService,
    private fb: UntypedFormBuilder,
    private translateService: TranslateService,
    public Common: CommonService,
    private authService: AuthService,
  ) {
    // Set the defaults
    this.action = data.action;
    this.count = data.data;
    if (this.action === "edit") {
      this.dialogTitle = "BUGS > EDIT";
      this.advanceTable = data.advanceTable;
    } else if (this.action === "view") {
      this.dialogTitle = "BUGS > VIEW";
      this.advanceTable = data.advanceTable;
    } else if (this.action === "delete") {
      this.dialogTitle = "BUGS > DELETE";
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = "BUGS > ADD";
      const blankObject = {} as AdvanceTable;
      this.advanceTable = new AdvanceTable(blankObject);
    }
    this.advanceTableForm = this.createContactForm();
  }
  getTranslation(key: string): string {
    return this.translateService.instant(key);
  }
  fileUploadProgress: number = 0;  // Tracks upload progress
  fileUploadError: boolean = false;

  // Method to handle the progress emitted from SingleFileUploadComponent
  onFileUploadProgress(progress: number): void {
    this.fileUploadProgress = progress;
    this.checkSubmitButtonState();
  }
  checkSubmitButtonState(): boolean {
    const mandatoryFieldsFilled = this.advanceTableForm.valid; // Check if mandatory fields are filled

    // Enable submit if mandatory fields are filled and no file is uploaded
    if (mandatoryFieldsFilled && this.fileUploadProgress === 0) {
      return true; // Enable submit button
    }

    // Enable submit only if mandatory fields are filled and file upload is complete
    if (mandatoryFieldsFilled && this.fileUploadProgress === 100) {
      return true; // Enable submit button
    }

    // Disable submit in all other cases
    return false; // Disable submit button
  }
  createdby: string | null = null;
  ngOnInit(): void {
    this.fetchExistingBugs(); 
    this.authService.currentUserName$.subscribe((uname) => {
      this.createdby = uname;
      console.log(this.createdby);
    });
    this.advanceTableService.data$.subscribe((data) => {
      this.apiAllFileds = data;
    });
    this.requirementsService.data$.subscribe((data) => {
      this.reqAllFields = data;
      console.log(
        "Data in BugsFormComponent with Requirement Id:",
        this.reqAllFields
      );
    });
    this.testCasesService.data$.subscribe((data) => {
      this.tcasesAllFields = data;
      console.log(
        "Data in BugsFormComponent with Test Cases Id:",
        this.tcasesAllFields
      );
    });
    this.testScenariosService.data$.subscribe((data) => {
      this.tscenariosAllFields = data;
      console.log(
        "Data in BugsFormComponent with Test Scenarios Id:",
        this.tscenariosAllFields
      );
    });
    this.fileDataArray = this.data.fileData;
    this.advanceTableService.getAllAdvanceTables();
    this.advanceTableForm = this.fb.group({
      id: [this.advanceTable.id],
      title: [
        this.advanceTable.title,
        [
          Validators.required,
          this.minLengthWithCustomError(2),
          this.maxLengthWithCustomError(50),
          Validators.maxLength(50),
        ],
      ],
      cdate: [this.advanceTable.cdate],
      createdby: [this.advanceTable.createdby],
      ddescription: [
        this.advanceTable.ddescription,
        [Validators.required,this.minLengthWithCustomError(2),]
      ],
      assignee: [this.advanceTable.assignee, [Validators.required]],
      mname: [this.advanceTable.mname],
      severity: [this.advanceTable.severity],
      reqid: [this.advanceTable.reqid],
      tcaseid: [this.advanceTable.tcaseid],
      tscenarioid: [this.advanceTable.tscenarioid],
      status: [this.advanceTable.status],
      complexity: [this.advanceTable.complexity],
      priority: [this.advanceTable.priority],
      frequency: [this.advanceTable.frequency],
      emate: [this.advanceTable.emate],
      comments: [this.advanceTable.comments],
      file: [""],
      project_id: "1",
      company_id: "1",
      searchTextAssignee: [""],
      searchTextMname: [""],
      searchTextSeverity: [""],
      searchTextReqId: [""],
      searchTextTcaseId: [""],
      searchTextTscenariosId: [""],
      searchTextStatus: [""],
      searchTextComplexity: [""],
      searchTextPriority: [""],
      searchTextFrequency: [""],
    });

    if (this.data.action === "edit" && this.data.fileData) {
      // If editing and there's file data, set it
      this.advanceTableForm.get("file")?.setValue(this.data.fileData);
    }

    if (this.action === "add") {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Get the YYYY-MM-DD format
      this.advanceTableForm.get("cdate")?.setValue(formattedDate);
      this.advanceTableForm.get("createdby")?.setValue(this.createdby);
      this.advanceTableForm.get("status")?.setValue("New");
      this.advanceTableForm.get("emate")?.setValue("2024-09-30");
    }
    if (this.action === "edit") {
      this.advanceTableForm.get("createdby")?.setValue(this.createdby);
      this.advanceTableForm.get("emate")?.setValue("2024-09-30");
    }
    this.Common.files$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get("file")) {
        this.advanceTableForm.get("file")!.setValue(files);
        console.log(files);
      }
    });
    this.Common.filesEdit$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get("file")) {
        this.advanceTableForm.get("file")!.setValue(files);
        console.log(files);
      }
    });
  }
  private fetchExistingBugs(): void {
    this.advanceTableService.getAllBugs().subscribe((bugs: AdvanceTable[]) => {
      if (bugs && bugs.length > 0) {
        this.lastAssignedId = Math.max(...bugs.map(bug => bug.id)); // Find the highest ID
      }
    });
  }
  showFiles: boolean = false;
  formatFileSize(size: number): string {
    this.showFiles = true;
    if (size < 1024) {
      return size + " B";
    } else if (size < 1048576) {
      return (size / 1024).toFixed(2) + " KB";
    } else if (size < 1073741824) {
      return (size / 1048576).toFixed(2) + " MB";
    } else {
      return (size / 1073741824).toFixed(2) + " GB";
    }
  }
  getSelectedItemCount(): number {
    return this.advanceTableService.getSelectedItemCount();
  }
  minLengthWithCustomError(minLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.length < minLength) {
        return {
          minlength: true,
          message: `Minimum ${minLength} characters`,
        };
      }
      return null;
    };
  }
  maxLengthWithCustomError(maxLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value && control.value.length > maxLength) {
        return {
          maxlength: true,
        };
      }
      return null;
    };
  }
  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  formControl = new UntypedFormControl("", [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError("required")
      ? "Required field"
      : this.formControl.hasError("email")
      ? "Not a valid email"
      : "";
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.advanceTable.id],
      title: [
        this.advanceTable.title,
        [
          Validators.required,
          this.minLengthWithCustomError(2),
          this.maxLengthWithCustomError(50),
          Validators.maxLength(50),
        ],
      ],
      ddescription: [
        this.advanceTable.ddescription,
        this.minLengthWithCustomError(2),
      ],
      assignee: [this.advanceTable.assignee, [Validators.required]],
      mname: [this.advanceTable.mname],
      severity: [this.advanceTable.severity],
      reqid: [this.advanceTable.reqid],
      tcaseid: [this.advanceTable.tcaseid],
      tscenarioid: [this.advanceTable.tscenarioid],
      status: [this.advanceTable.status],
      complexity: [this.advanceTable.complexity],
      priority: [this.advanceTable.priority],
      frequency: [this.advanceTable.frequency],
      file: [""],
      searchTextAssignee: [""],
      searchTextMname: [""],
      searchTextSeverity: [""],
      searchTextReqId: [""],
      searchTextTcaseId: [""],
      searchTextTscenariosId: [""],
      searchTextStatus: [""],
      searchTextComplexity: [""],
      searchTextPriority: [""],
      searchTextFrequency: [""],
    });
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onFileRemoved(): void {
    // Logic to handle file removal, e.g., update the form state or show a message
    console.log('File has been removed.');
    // You can also re-evaluate form validity or any other state if needed
    this.advanceTableForm.get('file')?.setValue('');
    this.checkSubmitButtonState();
  }
  private lastAssignedId: number = 0;
  public confirmAdd(): void {
    if (this.checkSubmitButtonState()) {
      console.log('Form submitted successfully!');
    const formValue = this.advanceTableForm.value;
    this.lastAssignedId++;
    // Create the request body to send to the API
    const requestBody = {
      // id: formValue.id,
      id: this.lastAssignedId, 
      title: formValue.title,
      cdate: formValue.cdate,
      createdby: formValue.createdby,
      assignee: formValue.assignee,
      ddescription: formValue.ddescription,
      mname: formValue.mname,
      priority: formValue.priority,
      status: formValue.status,
      frequency: formValue.frequency || "",
      emate: formValue.emate,
      severity: formValue.severity,
      complexity: formValue.complexity || "",
      // file: formValue.file.name,
      file: formValue.file.name || "",
      project_id: "1", // Static value for project_id
      company_id: "1", // Static value for company_id
      filtertype: "dueToday",
      startdate: formValue.cdate,
      enddate: "2024-09-26"
    };
    console.log(requestBody);

    const filesControl = this.advanceTableForm.get("file");
    this.Common.files$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get("file")) {
        console.log(files);
        this.advanceTableForm.get("file")?.setValue(files);
        // Send files to the service
        this.Common.setAdEditSingleFile(files);
      }
    });

    console.log("Files control value:", filesControl?.value);
    if (filesControl && Array.isArray(filesControl.value)) {
      const formData = new FormData();
      for (let i = 0; i < filesControl.value.length; i++) {
        formData.append(`file${i}`, filesControl.value[i]);
      }
    } else {
      console.error(
        "Unable to find 'files' form control or files are not an array"
      );
    }

    this.advanceTableService.emitBugAdded();
    // Make the API call using the service method and pass requestBody
    this.advanceTableService.addBug(requestBody).subscribe(
      (response) => {
        console.log('Bug added successfully:', response);
        
        // After successful response, continue with your existing logic
        // Call the advanceTableService to process further as per your requirement
        this.advanceTableService.addAdvanceTable(this.advanceTableForm.getRawValue());
      },
      (error) => {
        console.error('Error adding bug:', error);
        // Handle error if necessary, show a message or take further action
      }
    );
    
  }
  else {
    console.error('Submit button should be disabled.');
  }
  }
  

  public confirmEdit(): void {
    if (this.checkSubmitButtonState()) {
      console.log('Form submitted successfully!');
    const formValue = this.advanceTableForm.value;
        // Create the request body to send to the API
        const requestBody = {
          // id: formValue.id,
          bug_id: formValue.id,
          title: formValue.title,
          // cdate: formValue.cdate,
          createdby: formValue.createdby,
          assignee: formValue.assignee,
          ddescription: formValue.ddescription,
          mname: formValue.mname,
          priority: formValue.priority,
          status: formValue.status,
          // frequency: formValue.frequency,
          frequency: formValue.frequency || "",
          // emate: formValue.emate,
          severity: formValue.severity,
          // complexity: formValue.complexity,
          complexity: formValue.complexity || "",
          file: formValue.file.name || "",//new
          project_id: "1", // Static value for project_id
          company_id: "1", // Static value for company_id
          comments: formValue.comments || "", //new
          filtertype: "dueToday",
          startdate: formValue.cdate,
          enddate: "2024-09-26"
          // file: formValue.file.name,
        };
        console.log(requestBody.file.name);

    const filesControl = this.advanceTableForm.get("file");
    this.Common.filesEdit$.subscribe((filesEdit) => {
      if (this.advanceTableForm && this.advanceTableForm.get("file")) {
        console.log(filesEdit);
        // Set the merged array to the 'file' form control
        this.advanceTableForm.get("file")?.setValue(filesEdit);
        // Send merged files to the service
        this.Common.setEditFiles(filesEdit);
      }
    });

    // this.Common.files$.subscribe((files) => {
    //   if (this.advanceTableForm && this.advanceTableForm.get("file")) {
    //     console.log(files);
    //     this.advanceTableForm.get("file")?.setValue(files);
    //     // Send files to the service
    //     this.Common.setAdEditSingleFile(files);
    //   }
    // });

    // console.log("Files control value:", filesControl?.value);
    // if (filesControl && Array.isArray(filesControl.value)) {
    //   const formData = new FormData();
    //   for (let i = 0; i < filesControl.value.length; i++) {
    //     formData.append(`file${i}`, filesControl.value[i]);
    //   }
    // } else {
    //   console.error(
    //     "Unable to find 'files' form control or files are not an array"
    //   );
    // } 

    this.advanceTableService.emitBugAdded();
    // Make the API call using the service method and pass requestBody
    this.advanceTableService.editBug(requestBody).subscribe(
      (response) => {
        console.log('Bug added successfully:', response);
        
        // After successful response, continue with your existing logic
        // Call the advanceTableService to process further as per your requirement
        this.advanceTableService.addAdvanceTable(this.advanceTableForm.getRawValue());
      },
      (error) => {
        console.error('Error adding bug:', error);
        // Handle error if necessary, show a message or take further action
      }
    );
  }
  else {
    console.error('Submit button should be disabled.');
  }
  }

  public confirmAddnew(): void {
    if (this.checkSubmitButtonState()) {
      console.log('Form submitted successfully!');
    const formValue = this.advanceTableForm.value;
    this.lastAssignedId++;
    // Create the request body to send to the API
    const requestBody = {
      // id: formValue.id,
      id: this.lastAssignedId, 
      title: formValue.title,
      cdate: formValue.cdate,
      createdby: formValue.createdby,
      assignee: formValue.assignee,
      ddescription: formValue.ddescription,
      mname: formValue.mname,
      priority: formValue.priority,
      status: formValue.status,
      frequency: formValue.frequency || "",
      emate: formValue.emate,
      severity: formValue.severity,
      complexity: formValue.complexity || "",
      // file: formValue.file.name,
      file: formValue.file.name || "",
      project_id: "1", // Static value for project_id
      company_id: "1", // Static value for company_id
      filtertype: "dueToday",
      startdate: formValue.cdate,
      enddate: "2024-09-26"
    };
    console.log(requestBody);

    const filesControl = this.advanceTableForm.get("file");
    this.Common.files$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get("file")) {
        console.log(files);
        this.advanceTableForm.get("file")?.setValue(files);
        // Send files to the service
        this.Common.setAdEditSingleFile(files);
      }
    });

    console.log("Files control value:", filesControl?.value);
    if (filesControl && Array.isArray(filesControl.value)) {
      const formData = new FormData();
      for (let i = 0; i < filesControl.value.length; i++) {
        formData.append(`file${i}`, filesControl.value[i]);
      }
    } else {
      console.error(
        "Unable to find 'files' form control or files are not an array"
      );
    }

    this.advanceTableService.emitBugAdded();
    // Make the API call using the service method and pass requestBody
    this.advanceTableService.addBug(requestBody).subscribe(
      (response) => {
        console.log('Bug added successfully:', response);
        
        // After successful response, continue with your existing logic
        // Call the advanceTableService to process further as per your requirement
        this.advanceTableService.addAdvanceTable(this.advanceTableForm.getRawValue());
      },
      (error) => {
        console.error('Error adding bug:', error);
        // Handle error if necessary, show a message or take further action
      }
    );
  }
  else {
    console.error('Submit button should be disabled.');
  }
  }
  confirmDelete(): void {
    if (this.data && this.data.id) {
      this.advanceTableService.deleteAdvanceTable(this.data.id).subscribe(
        (response) => {
          console.log('Bug deleted successfully:', response);
          this.advanceTableService.emitBugAdded();
        },
        (error) => {
          console.error('Error deleting bug:', error);
        }
      );
    } else {
      console.error('Bug ID is undefined. Cannot delete.');
    }
  }

  confirmMultiDelete(): void {
    if (this.data && this.data.ids && this.data.ids.length > 0) {
      this.advanceTableService.deleteMultipleAdvanceTables(this.data.ids).subscribe(
        (response) => {
          console.log('Bugs deleted successfully:', response);
          this.advanceTableService.emitBugAdded();  // Emit an event to refresh the table
        },
        (error) => {
          console.error('Error deleting bugs:', error);
        }
      );
    } else {
      console.error('No IDs available to delete.');
    }
  }
  
  


}
