import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
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
import { AdvanceTable } from "app/test-scenarios/test-scenarios.model";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { TestScenariosService } from "app/test-scenarios/test-scenarios.service";
import {
  ExampleDataSource,
  TscTableComponent,
} from "app/tsc-table/tsc-table.component";

export interface DialogData {
  id: number;
  action: string;
  advanceTable: AdvanceTable;
  data: string;
}

@Component({
  selector: "app-test-scenarios-form",
  templateUrl: "./test-scenarios-form.component.html",
  styleUrl: "./test-scenarios-form.component.scss",
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class TestScenariosFormComponent implements OnInit {
  selectFormControl = new FormControl("", Validators.required);
  action: string;
  advanceTableForm: UntypedFormGroup;
  advanceTable: AdvanceTable;
  apiAllFileds: any = [];
  count: string | undefined;
  public Editor: any = ClassicEditor;
  selectedDateCd: Date | null = null;

  constructor(
    public dialogRef: MatDialogRef<TestScenariosFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: TestScenariosService,
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
  dataSource!: ExampleDataSource;
  ngOnInit(): void {
    this.advanceTableService.data$.subscribe((data) => {
      this.apiAllFileds = data;
    });
    this.advanceTableService.getAllAdvanceTables();

    if (this.action === "add") {
      this.advanceTableForm = this.fb.group({
        id: [this.advanceTable.id],
        tcases: [""],
        tscenario: [
          this.advanceTable.tscenario,
          [
            Validators.required,
            this.minLengthWithCustomError(2),
            this.maxLengthWithCustomError(50),
            Validators.maxLength(50),
          ],
        ],
      });
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
      tcases: [this.advanceTable.tcases],
      tscenario: [
        this.advanceTable.tscenario,
        [
          Validators.required,
          this.minLengthWithCustomError(2),
          this.maxLengthWithCustomError(50),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  submit() {
    // emppty stuff
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  @ViewChild(TscTableComponent) tscTableComponent!: TscTableComponent;
  selectedRowCount: any;
  confirmAdd(): void {
    console.log(this.advanceTableForm.value);
    const formValue = this.advanceTableForm.value;
    this.selectedRowCount = this.tscTableComponent.getSelectedItemCount();
    console.log("Number of selected rows:", this.selectedRowCount);
    const selectedItems = this.tscTableComponent.selection.selected;
    console.log("Number of selectedItems:", selectedItems);
    this.advanceTableService.updateSelectedItems(selectedItems);
    const relevantData = {
      tcid: formValue.id,
      tscenario: formValue.tscenario,
      tcases: this.selectedRowCount,
    };
    this.advanceTableForm.get("tcases")?.setValue(this.selectedRowCount);
    console.log(relevantData);
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
    console.log(this.advanceTableForm.value);
    const formValue = this.advanceTableForm.value;
    this.selectedRowCount = this.tscTableComponent.getSelectedItemCount();
    console.log("Number of selected rows:", this.selectedRowCount);
    const selectedItems = this.tscTableComponent.selection.selected;
    console.log("Number of selectedItems:", selectedItems);
    this.advanceTableService.updateSelectedItems(selectedItems);
    const relevantData = {
      tcid: formValue.id,
      tscenario: formValue.tscenario,
      tcases: this.selectedRowCount,
    };
    this.advanceTableForm.get("tcases")?.setValue(this.selectedRowCount);
    console.log(relevantData);
    this.advanceTableService.addAdvanceTable(
      this.advanceTableForm.getRawValue()
    );
  }

  confirmDelete(): void {
    this.advanceTableService.deleteAdvanceTable(this.data.id);
  }
}
