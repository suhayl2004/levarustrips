import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, HostListener, Inject, model, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceTable } from '../../projects.model';
import { ProjectsService } from '../../projects.service';

export interface DialogData {
  id: number;
  action: string;
  advanceTable: AdvanceTable;
  data: string;
}
export const StrongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

@Component({
  selector: 'app-projects-form',
  templateUrl: './projects-form.component.html',
  styleUrl: './projects-form.component.scss',
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
})
export class ProjectsFormComponent implements OnInit {
  selectFormControl = new FormControl('', Validators.required);
  action: string;
  dialogTitle: string;
  advanceTableForm: UntypedFormGroup;
  advanceTable: AdvanceTable;
  companyAllFileds: any = [];
  readonly dashboard = model(false);
  readonly requirements = model(false);
  readonly test = model(false);
  readonly bugs = model(false);
  readonly settings = model(false);
  count: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ProjectsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: ProjectsService,
    private fb: UntypedFormBuilder,
    private translateService: TranslateService,
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
  hide = true;
  ngOnInit(): void {
    this.advanceTableService.data$.subscribe((data) => {
      this.companyAllFileds = data;
    });
    this.advanceTableService.getAllAdvanceTables();

    if (this.action === 'add' || this.action === 'edit') {
      this.advanceTableForm = this.fb.group({
        id: [this.advanceTable.id],
        company: [this.advanceTable.company, 
          [Validators.required]],
          searchTextCompany: [''],
        pcode: [this.advanceTable.pcode,[Validators.required,this.minLengthWithCustomError(2), this.maxLengthWithCustomError(20), Validators.maxLength(20)]],
        pname: [this.advanceTable.pname,[Validators.required,this.minLengthWithCustomError(2), this.maxLengthWithCustomError(50), Validators.maxLength(50)]],
      });
    }
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
      company: [this.advanceTable.company, 
        [Validators.required]],
      pcode: [this.advanceTable.pcode,[Validators.required,this.minLengthWithCustomError(2), this.maxLengthWithCustomError(20), Validators.maxLength(20)]],
      pname: [this.advanceTable.pname,[Validators.required,this.minLengthWithCustomError(2), this.maxLengthWithCustomError(50), Validators.maxLength(50)]],
    });
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.advanceTableService.addAdvanceTable(
      this.advanceTableForm.getRawValue()
    );
  }

  public confirmEdit(): void {
    this.advanceTableService.addAdvanceTable(
      this.advanceTableForm.getRawValue()
    );
  }

  public confirmAddnew(): void {
    this.advanceTableService.addAdvanceTable(
      this.advanceTableForm.getRawValue()
    );
  }

  confirmDelete(): void {
    this.advanceTableService.deleteAdvanceTable(this.data.id);
  }
}
