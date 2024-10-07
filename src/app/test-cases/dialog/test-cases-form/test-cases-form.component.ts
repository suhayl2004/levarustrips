import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormControl,
  AbstractControl,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'app/services/common.service';
import { AdvanceTable } from 'app/test-cases/test-cases.model';
import { TestCasesService } from 'app/test-cases/test-cases.service';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export interface DialogData {
  id: number;
  action: string;
  advanceTable: AdvanceTable;
  fileData: any;
  data: string;
}

@Component({
  selector: 'app-test-cases-form',
  templateUrl: './test-cases-form.component.html',
  styleUrl: './test-cases-form.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class TestCasesFormComponent implements OnInit {
  selectFormControl = new FormControl('', Validators.required);
  action: string;
  dialogTitle: string;
  advanceTableForm: UntypedFormGroup;
  advanceTable: AdvanceTable;
  apiAllFileds: any = [];
  fileDataArray: any = [];
  count: string | undefined;
  public Editor: any = ClassicEditor;
  selectedDateCd: Date | null = null;

  constructor(
    public dialogRef: MatDialogRef<TestCasesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: TestCasesService,
    private fb: UntypedFormBuilder,
    private translateService: TranslateService,
    public Common: CommonService,
  ) {
    // Set the defaults
    this.action = data.action;
    this.count = data.data;
    if (this.action === 'edit') {
      this.dialogTitle = 'REQUIREMENTS > EDIT';
      this.advanceTable = data.advanceTable;
    } else if (this.action === 'view') {
      this.dialogTitle = 'REQUIREMENTS > VIEW';
      this.advanceTable = data.advanceTable;
    } else if (this.action === 'delete') {
      this.dialogTitle = 'REQUIREMENTS > DELETE';
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = 'REQUIREMENTS > ADD';
      const blankObject = {} as AdvanceTable;
      this.advanceTable = new AdvanceTable(blankObject);
    }
    this.advanceTableForm = this.createContactForm();
  }
  getTranslation(key: string): string {
    return this.translateService.instant(key);
  }
  ngOnInit(): void {
    this.advanceTableService.data$.subscribe((data) => {
      this.apiAllFileds = data;
    });
    this.fileDataArray = this.data.fileData;
    this.advanceTableService.getAllAdvanceTables();

    if (this.action === 'add') {
      this.advanceTableForm = this.fb.group({
        id: [this.advanceTable.id],
        cdate: [this.advanceTable.cdate],
        // rows: this.fb.array([this.createRow()]),
        rows: this.fb.array([this.createRow(1)]),
        title: [this.advanceTable.title, 
        [Validators.required,this.minLengthWithCustomError(2), this.maxLengthWithCustomError(50), Validators.maxLength(50)]],
        description: [this.advanceTable.description,this.minLengthWithCustomError(2)],
        mname: [this.advanceTable.mname],
        priority: [this.advanceTable.priority],
        tctype: [this.advanceTable.tctype],
        pconditions: [
          this.advanceTable.pconditions,
        ],
        comments: [this.advanceTable.comments,this.minLengthWithCustomError(2)],
        file: [''],
        searchTextMname: [''],
        searchTextPriority: [''],
        searchTextTctype: ['']
      });
    }
    this.Common.files$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get('file')) {
        this.advanceTableForm.get('file')!.setValue(files);
        console.log(files);
      }
    });
    this.Common.filesEdit$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get('file')) {
        this.advanceTableForm.get('file')!.setValue(files);
        console.log(files);
      }
    });
  }
  showFiles: boolean = false;
  formatFileSize(size: number): string {
    this.showFiles = true;
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1048576) {
      return (size / 1024).toFixed(2) + ' KB';
    } else if (size < 1073741824) {
      return (size / 1048576).toFixed(2) + ' MB';
    } else {
      return (size / 1073741824).toFixed(2) + ' GB';
    }
  }
  getSelectedItemCount(): number {
    return this.advanceTableService.getSelectedItemCount();
  }
  get rows(): FormArray {
    return this.advanceTableForm.get('rows') as FormArray;
  }

  createRow(step: number): FormGroup {
    return this.fb.group({
      step: [`Step ${step}`],
      left: [''],
      right: ['']
    });
  }

  onInput(index: number) {
    const currentRow = this.rows.at(index);
    if (currentRow.get('left')?.value || currentRow.get('right')?.value) {
      if (this.rows.length - 1 === index) {
        this.rows.push(this.createRow(this.rows.length + 1));
      }
    }
  }
  deleteRow(index: number) {
    this.rows.removeAt(index);
    this.updateSteps();
  }

  addRow(index: number) {
    this.rows.insert(index + 1, this.createRow(index + 2));
    this.updateSteps();
  }

  updateSteps() {
    this.rows.controls.forEach((control, index) => {
      control.get('step')?.setValue(`Step ${index + 1}`);
    });
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
  handleInput(event: KeyboardEvent): void{
    event.stopPropagation();
 } 

  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required')
      ? 'Required field'
      : this.formControl.hasError('email')
        ? 'Not a valid email'
        : '';
  }

  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.advanceTable.id],
      cdate: [this.advanceTable.cdate],
      title: [this.advanceTable.title, 
      [Validators.required,this.minLengthWithCustomError(2), this.maxLengthWithCustomError(50), Validators.maxLength(50)]],
      description: [this.advanceTable.description,this.minLengthWithCustomError(2)],
      mname: [this.advanceTable.mname],
      priority: [this.advanceTable.priority],
      tctype: [this.advanceTable.tctype],
      pconditions: [
        this.advanceTable.pconditions,
      ],
      comments: [this.advanceTable.comments,this.minLengthWithCustomError(2)],
      file: [''],
      searchTextMname: [''],
      searchTextPriority: [''],
      searchTextTctype: ['']
    });
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    console.log(this.advanceTableForm.value);
    const formValue = this.advanceTableForm.value;
    const relevantData = {
      tcid: formValue.id,
      title: formValue.title,
      cdate: formValue.cdate,
      mname: formValue.mname,
      priority: formValue.priority,
      pconditions: formValue.pconditions,
      rows: formValue.rows,
      comments: formValue.comments,
      description: formValue.description,
      file: formValue.file
    };
    console.log(relevantData);
    const filesControl = this.advanceTableForm.get('file');
    this.Common.files$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get('file')) {
        console.log(files);
        this.advanceTableForm.get('file')?.setValue(files);
        // Send files to the service
        this.Common.setAdEditSingleFile(files);
      }
    });

    console.log('Files control value:', filesControl?.value);
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
    this.advanceTableService.addAdvanceTable(
      this.advanceTableForm.getRawValue()
    );
  }

  public confirmEdit(): void {
    const filesControl = this.advanceTableForm.get('file');
    this.Common.filesEdit$.subscribe((filesEdit) => {
      if (this.advanceTableForm && this.advanceTableForm.get('file')) {
        console.log(filesEdit);
        // Set the merged array to the 'file' form control
        this.advanceTableForm.get('file')?.setValue(filesEdit);
        // Send merged files to the service
        this.Common.setEditFiles(filesEdit);
      }
    });

    
    this.Common.files$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get('file')) {
        console.log(files);
        this.advanceTableForm.get('file')?.setValue(files);
        // Send files to the service
        this.Common.setAdEditSingleFile(files);
      }
    });

    console.log('Files control value:', filesControl?.value);
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
    this.advanceTableService.addAdvanceTable(
      this.advanceTableForm.getRawValue()
    );
  }

  public confirmAddnew(): void {
    console.log(this.advanceTableForm.value);
    const formValue = this.advanceTableForm.value;
    const relevantData = {
      id: formValue.id,
      title: formValue.title,
      description: formValue.description,
      mname: formValue.mname,
      priority: formValue.priority,
      comments: formValue.comments,
      file: formValue.file
    };
    console.log(relevantData);
    const filesControl = this.advanceTableForm.get('file');
    this.Common.files$.subscribe((files) => {
      if (this.advanceTableForm && this.advanceTableForm.get('file')) {
        console.log(files);
        this.advanceTableForm.get('file')?.setValue(files);
        // Send files to the service
        this.Common.setAdEditSingleFile(files);
      }
    });

    console.log('Files control value:', filesControl?.value);
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
    this.advanceTableService.addAdvanceTable(
      this.advanceTableForm.getRawValue()
    );
  }

  confirmDelete(): void {
    this.advanceTableService.deleteAdvanceTable(this.data.id);
  }
}
