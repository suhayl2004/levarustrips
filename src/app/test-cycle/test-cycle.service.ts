import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AdvanceTable } from './test-cycle.model';

@Injectable()
export class TestCycleService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/tcycle.json';
  isTblLoading = true;
  dataChange: BehaviorSubject<AdvanceTable[]> = new BehaviorSubject<
    AdvanceTable[]
  >([]);
  data$: Observable<AdvanceTable[]> = this.dataChange.asObservable();
  dialogData!: AdvanceTable;
  constructor(private httpClient: HttpClient) {
    super();
  }
  get data(): AdvanceTable[] {
    return this.dataChange.value;
  }
  private selectedItemsSource = new BehaviorSubject<any[]>([]);
  selectedItems$ = this.selectedItemsSource.asObservable();
  isUpdating = false;
  updateSelectedItems(items: any[]): void {
    if (this.isUpdating) return;
    this.isUpdating = true;

    this.selectedItemsSource.next(items);
    this.isUpdating = false;
  }
  private selectedScenariosItemsSource = new BehaviorSubject<any[]>([]);
  selectedScenariosItems$ = this.selectedScenariosItemsSource.asObservable();
  isScenariosUpdating = false;
  updateSelectedScenariosItems(items: any[]): void {
    if (this.isScenariosUpdating) return;
    this.isScenariosUpdating = true;

    this.selectedScenariosItemsSource.next(items);
    this.isScenariosUpdating = false;
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
