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
import { AdvanceTable } from "../../test-cycle.model";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { TranslateService } from "@ngx-translate/core";
import { TestCycleService } from "app/test-cycle/test-cycle.service";

export interface DialogData {
  id: number;
  action: string;
  advanceTable: AdvanceTable;
  data: string;
}

@Component({
  selector: "app-test-cycle-form",
  templateUrl: "./test-cycle-form.component.html",
  styleUrl: "./test-cycle-form.component.scss",
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class TestCycleFormComponent implements OnInit {
  selectFormControl = new FormControl("", Validators.required);
  action: string;
  advanceTableForm: UntypedFormGroup;
  advanceTable: AdvanceTable;
  testExecutionAllFileds: any = [];
  count: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<TestCycleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: TestCycleService,
    private fb: UntypedFormBuilder,
    private translateService: TranslateService
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
  ngOnInit(): void {
    this.advanceTableService.data$.subscribe((data) => {
      this.testExecutionAllFileds = data;
    });
    this.advanceTableService.getAllAdvanceTables();

    if (this.action === "add") {
      this.advanceTableForm = this.fb.group({
        id: [this.advanceTable.id],
        cdate: [this.advanceTable.cdate],
        udate: [this.advanceTable.udate],
        createdby: [this.advanceTable.createdby],
        title: [
          this.advanceTable.title,
          [
            Validators.required,
            this.minLengthWithCustomError(2),
            this.maxLengthWithCustomError(50),
            Validators.maxLength(50),
          ],
        ],
        owner: [this.advanceTable.owner],
        items: [this.advanceTable.items],
        eresults: [this.advanceTable.eresults],
        edate: [this.advanceTable.edate],
        assignedto: [this.advanceTable.assignedto],
        description: [this.advanceTable.description],
        testtype: [this.advanceTable.testtype],
        sprint: [this.advanceTable.sprint],
        searchTextOwner: [""],
        searchTextTesttype: [""],
        searchTextSprint: [""],
      });
    }

    if (this.action === "add") {
      this.advanceTableForm.get("cdate")?.setValue("2024-09-15");
      this.advanceTableForm.get("udate")?.setValue("2024-07-25");
      this.advanceTableForm.get("createdby")?.setValue("Ramesh");
      this.advanceTableForm.get("items")?.setValue("10");
      this.advanceTableForm.get("cycleresults")?.setValue("Cycle Results 6");
      this.advanceTableForm.get("cycledate")?.setValue("2024-11-28");
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
      cdate: [this.advanceTable.cdate],
      udate: [this.advanceTable.udate],
      createdby: [this.advanceTable.createdby],
      title: [
        this.advanceTable.title,
        [
          Validators.required,
          this.minLengthWithCustomError(2),
          this.maxLengthWithCustomError(50),
          Validators.maxLength(50),
        ],
      ],
      owner: [this.advanceTable.owner],
      items: [this.advanceTable.items],
      eresults: [this.advanceTable.eresults],
      edate: [this.advanceTable.edate],
      assignedto: [this.advanceTable.assignedto],
      description: [this.advanceTable.description],
      testtype: [this.advanceTable.testtype],
      sprint: [this.advanceTable.sprint],
      searchTextOwner: [""],
      searchTextTesttype: [""],
      searchTextSprint: [""],
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
