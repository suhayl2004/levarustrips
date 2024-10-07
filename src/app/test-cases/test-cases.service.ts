import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AdvanceTable } from './test-cases.model';

@Injectable()
export class TestCasesService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/test-cases.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<AdvanceTable[]> = new BehaviorSubject<
    AdvanceTable[]
  >([]);
  data$: Observable<AdvanceTable[]> = this.dataChange.asObservable();
  dialogData!: AdvanceTable;
  constructor(private httpClient: HttpClient) {
    super();
    this.getAllAdvanceTables();
  }
  get data(): AdvanceTable[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAdvanceTables(): void {
    this.subs.sink = this.httpClient
      .get<AdvanceTable[]>(this.API_URL)
      .subscribe({
        next: (data) => {
          this.isTblLoading = false;
          this.dataChange.next(data);
        },
        error: (error: HttpErrorResponse) => {
          this.isTblLoading = false;
        },
      });
  }
  refreshData(): void {
    // Method to manually refresh data
    this.getAllAdvanceTables();
  }
  private selectedItemCount = 0;
  getSelectedItemCount(): number {
    return this.selectedItemCount;
  }

  updateSelectedItemCount(count: number): void {
    this.selectedItemCount = count;
  }

  addAdvanceTable(advanceTable: AdvanceTable): void {
    this.dialogData = advanceTable;
  }

  updateAdvanceTable(advanceTable: AdvanceTable): void {
    this.dialogData = advanceTable;
  }

  deleteAdvanceTable(id: number): void { }
}

