import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, HostListener, Inject, OnInit, ViewChild } from "@angular/core";
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { AdvanceTable } from "../../req.model";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "app/services/common.service";
import { RequirementsService } from "app/requirements/requirements.service";
import { SingleFileUploadComponent } from "@shared/components/single-file-upload/single-file-upload.component";

export interface DialogData {
  // id: number;
  id: any;
  ids: number[];
  action: string;
  advanceTable: AdvanceTable;
  fileData: any;
  fileSize: any;
  data: string;
}

@Component({
  selector: "app-req-form",
  templateUrl: "./req-form.component.html",
  styleUrl: "./req-form.component.scss",
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class ReqFormComponent implements OnInit {
  selectFormControl = new FormControl("", Validators.required);
  action: string;
  advanceTableForm: UntypedFormGroup;
  advanceTable: AdvanceTable;
  apiAllFileds: any = [];
  fileDataArray: any = [];
  count: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ReqFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: RequirementsService,
    private fb: UntypedFormBuilder,
    private translateService: TranslateService,
    public Common: CommonService
  ) {
    // Set the defaults
    this.action = data.action;
    this.count = data.data;
    if (this.action === "edit") {
      this.advanceTable = data.advanceTable;
    } else if (this.action === "view") {
      this.advanceTable = data.advanceTable;
    } else if (this.action === "delete") {
      this.advanceTable = data.advanceTable;
    } else {
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
    console.log('Upload progress:', progress);
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
  ngOnInit(): void {
    this.fetchExistingReq();
    this.advanceTableService.data$.subscribe((data) => {
      this.apiAllFileds = data;
    });
    // this.fileDataArray = this.data.fileData;
    if (typeof this.data.fileData === 'string') {
      this.fileDataArray = [{
        name: {
          name: this.data.fileData,  // Assuming fileData is the filename
          size: 0
          // size: this.data.fileSize                    // If you have no file size, keep it 0 or handle appropriately
        }
      }];
    } else {
      // If it's already an array, just assign it
      this.fileDataArray = this.data.fileData;
    }
    this.advanceTableService.getAllAdvanceTables();

    // if (this.action === "add") {
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
        description: [
          this.advanceTable.description,
          this.minLengthWithCustomError(2),
        ],
        mname: [this.advanceTable.mname],
        priority: [this.advanceTable.priority],
        status: [this.advanceTable.status],
        reviewer: [this.advanceTable.reviewer],
        comments: [
          this.advanceTable.comments,
          this.minLengthWithCustomError(2),
        ],
        file: [""],
        project_id: "1",
        company_id: "1",
        searchTextMname: [""],
        searchTextPriority: [""],
        searchTextStatus: [""],
        searchTextReviewer: [""],
      });
    // }
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

    // if (this.action === "add") {
    //   this.advanceTableForm.get("status")?.setValue("New");
    // }
  }

  private fetchExistingReq(): void {
    this.advanceTableService.getAllReq().subscribe((bugs: AdvanceTable[]) => {
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

  formControl = new UntypedFormControl("", [Validators.required]);

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
      description: [
        this.advanceTable.description,
        this.minLengthWithCustomError(2),
      ],
      mname: [this.advanceTable.mname],
      priority: [this.advanceTable.priority],
      status: [this.advanceTable.status],
      reviewer: [this.advanceTable.reviewer],
      comments: [this.advanceTable.comments, this.minLengthWithCustomError(2)],
      file: [""],
      searchTextMname: [""],
      searchTextPriority: [""],
      searchTextStatus: [""],
      searchTextReviewer: [""],
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
      console.log('Confirm add clicked');
      console.log('Form submitted successfully!');
    console.log(this.advanceTableForm.value);
    const formValue = this.advanceTableForm.value;
    this.lastAssignedId++;
    const requestBody = {
      // id: formValue.id,
      id: this.lastAssignedId, 
      title: formValue.title,
      description: formValue.description,
      mname: formValue.mname,
      priority: formValue.priority,
      status: formValue.status,
      reviewer: formValue.reviewer,
      comments: formValue.comments,
      file: formValue.file.name || "",
      size: formValue.file.size || "",
      project_id: "1", // Static value for project_id
      company_id: "1", // Static value for company_id
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
    this.advanceTableService.emitReqAdded();
    // Make the API call using the service method and pass requestBody
    this.advanceTableService.addReq(requestBody).subscribe(
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

  // public confirmEdit(): void {
  //   if (this.checkSubmitButtonState()) {
  //     console.log('Form submitted successfully!');
  //   const formValue = this.advanceTableForm.value;
  //   // Create the request body to send to the API
  //   const requestBody = {
  //     req_id: formValue.id,
  //     title: formValue.title,
  //     description: formValue.description,
  //     mname: formValue.mname,
  //     priority: formValue.priority,
  //     status: formValue.status,
  //     reviewer: formValue.reviewer,
  //     comments: formValue.comments,
  //     file: formValue.file.name,
  //     project_id: "1", // Static value for project_id
  //     company_id: "1", // Static value for company_id
  //   };
  //   const filesControl = this.advanceTableForm.get("file");
  //   this.Common.filesEdit$.subscribe((filesEdit) => {
  //     if (this.advanceTableForm && this.advanceTableForm.get("file")) {
  //       console.log(filesEdit);
  //       // Set the merged array to the 'file' form control
  //       this.advanceTableForm.get("file")?.setValue(filesEdit);
  //       // Send merged files to the service
  //       this.Common.setEditFiles(filesEdit);
  //     }
  //   });

  //   this.Common.files$.subscribe((files) => {
  //     if (this.advanceTableForm && this.advanceTableForm.get("file")) {
  //       console.log(files);
  //       this.advanceTableForm.get("file")?.setValue(files);
  //       // Send files to the service
  //       this.Common.setAdEditSingleFile(files);
  //     }
  //   });

  //   console.log("Files control value:", filesControl?.value);
  //   if (filesControl && Array.isArray(filesControl.value)) {
  //     const formData = new FormData();
  //     for (let i = 0; i < filesControl.value.length; i++) {
  //       formData.append(`file${i}`, filesControl.value[i]);
  //     }
  //   } else {
  //     console.error(
  //       "Unable to find 'files' form control or files are not an array"
  //     );
  //   }
  //   // this.advanceTableService.addAdvanceTable(
  //   //   this.advanceTableForm.getRawValue()
  //   // );

  //   this.advanceTableService.emitReqAdded();
  //   // Make the API call using the service method and pass requestBody
  //   this.advanceTableService.editReq(requestBody).subscribe(
  //     (response) => {
  //       console.log('Bug added successfully:', response);
        
  //       // After successful response, continue with your existing logic
  //       // Call the advanceTableService to process further as per your requirement
  //       this.advanceTableService.addAdvanceTable(this.advanceTableForm.getRawValue());
  //     },
  //     (error) => {
  //       console.error('Error adding bug:', error);
  //       // Handle error if necessary, show a message or take further action
  //     }
  //   );
  // }
  // else {
  //   console.error('Submit button should be disabled.');
  // }
  // }

  @ViewChild(SingleFileUploadComponent) fileUploadComponent!: SingleFileUploadComponent;
  public confirmEdit(): void {
    if (this.checkSubmitButtonState()) {
      console.log('Form submitted successfully!');
      const formValue = this.advanceTableForm.value;
  

    const file = this.fileUploadComponent.fileDataArray.map((f:any) => f.name.name)
    console.log(file[0]);
      const requestBody = {
        req_id: formValue.id,
        title: formValue.title,
        description: formValue.description,
        mname: formValue.mname,
        priority: formValue.priority,
        status: formValue.status,
        reviewer: formValue.reviewer,
        comments: formValue.comments,
        // file: file[0] || "", // Use the fileDataArray for the files
        file: file[0] || formValue.file.name,
        project_id: "1", 
        company_id: "1"
      };
      
  
      const formData = new FormData();
      for (let i = 0; i < this.fileUploadComponent.fileDataArray.length; i++) {
        formData.append(`file${i}`, this.fileUploadComponent.fileDataArray[i].name);
      }
      this.advanceTableService.emitReqAdded();
      this.advanceTableService.editReq(requestBody).subscribe(
        (response) => {
          console.log('Updated successfully:', response);
          this.advanceTableService.addAdvanceTable(this.advanceTableForm.getRawValue());
        },
        (error) => {
          console.error('Error while updating:', error);
        }
      );
    } else {
      console.error('Submit button should be disabled.');
    }
  }
  
  public confirmAddnew(): void {
    if (this.checkSubmitButtonState()) {
      console.log('Form submitted successfully!');
    console.log(this.advanceTableForm.value);
    const formValue = this.advanceTableForm.value;
    const requestBody = {
      id: formValue.id,
      title: formValue.title,
      description: formValue.description,
      mname: formValue.mname,
      priority: formValue.priority,
      status: formValue.status,
      reviewer: formValue.reviewer,
      comments: formValue.comments,
      file: formValue.file.name,
      project_id: "1", // Static value for project_id
      company_id: "1", // Static value for company_id
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
    this.advanceTableService.emitReqAdded();
    // Make the API call using the service method and pass requestBody
    this.advanceTableService.addReq(requestBody).subscribe(
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
          console.log('req deleted successfully:', response);
          this.advanceTableService.emitReqAdded();
        },
        (error) => {
          console.error('Error deleting req:', error);
        }
      );
    } else {
      console.error('req ID is undefined. Cannot delete.');
    }
  }

  confirmMultiDelete(): void {
    if (this.data && this.data.ids && this.data.ids.length > 0) {
      this.advanceTableService.deleteMultipleAdvanceTables(this.data.ids).subscribe(
        (response) => {
          console.log('reqs deleted successfully:', response);
          this.advanceTableService.emitReqAdded();  // Emit an event to refresh the table
        },
        (error) => {
          console.error('Error deleting reqs:', error);
        }
      );
    } else {
      console.error('No IDs available to delete.');
    }
  }

}
