import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
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
import { TestCycleService } from "app/test-cycle/test-cycle.service";
import { AdvanceTable } from "app/test-cycle/test-cycle.model";
import {
  ExampleDataSource,
  TscCycleTableComponent,
} from "app/tsc-cycle-table/tsc-cycle-table.component";
import {
  ExampleDataSource1,
  TestScenariosComponent,
} from "app/test-scenarios/test-scenarios.component";

export interface DialogData {
  id: number;
  action: string;
  advanceTable: AdvanceTable;
  data: string;
}

@Component({
  selector: "app-test-cycle-dc-form",
  templateUrl: "./test-cycle-dc-form.component.html",
  styleUrl: "./test-cycle-dc-form.component.scss",
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" }],
})
export class TestCycleDcFormComponent implements OnInit {
  selectFormControl = new FormControl("", Validators.required);
  action: string;
  dialogTitle: string;
  advanceTableForm: UntypedFormGroup;
  advanceTable: AdvanceTable;
  testExecutionAllFileds: any = [];
  count: string | undefined;
  // dataSource!: ExampleDataSource;
  dataSourceTscCycle!: ExampleDataSource; // Data source for TscCycleTableComponent
  dataSourceTestScenarios!: ExampleDataSource1; // Data source for TestScenariosComponent
  constructor(
    public dialogRef: MatDialogRef<TestCycleDcFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public advanceTableService: TestCycleService,
    private fb: UntypedFormBuilder,
    private translateService: TranslateService
  ) {
    // Set the defaults
    this.action = data.action;
    this.count = data.data;
    if (this.action === "edit") {
      this.dialogTitle = "REQUIREMENTS > EDIT";
      this.advanceTable = data.advanceTable;
    } else if (this.action === "view") {
      this.dialogTitle = "REQUIREMENTS > VIEW";
      this.advanceTable = data.advanceTable;
    } else if (this.action === "delete") {
      this.dialogTitle = "REQUIREMENTS > DELETE";
      this.advanceTable = data.advanceTable;
    } else {
      this.dialogTitle = "REQUIREMENTS > ADD";
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
  @ViewChild(TscCycleTableComponent)
  tscCycleTableComponent!: TscCycleTableComponent;
  @ViewChild(TestScenariosComponent)
  testScenariosComponent!: TestScenariosComponent;
  public confirmAdd(): void {
    console.log(this.advanceTableForm.value);
    const selectedItems = this.tscCycleTableComponent.selection.selected;
    console.log("Number of selectedItems:", selectedItems);
    this.advanceTableService.updateSelectedItems(selectedItems);

    const selectedScenarioItems =
      this.testScenariosComponent.selection.selected;
    console.log("Number of selectedScenarioItems:", selectedScenarioItems);
    this.advanceTableService.updateSelectedScenariosItems(
      selectedScenarioItems
    );

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
