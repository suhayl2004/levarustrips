import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AdvanceTable } from 'app/test-scenarios/test-scenarios.model';

@Injectable()
export class TestScenariosDetailScreenService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/tscenario.json';
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

  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  // getAllAdvanceTables(): void {
  //   this.subs.sink = this.httpClient
  //     .get<AdvanceTable[]>(this.API_URL)
  //     .subscribe({
  //       next: (data) => {
  //         this.isTblLoading = false;
  //         this.dataChange.next(data);
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         this.isTblLoading = false;
  //       },
  //     });
  // }
  getAllAdvanceTables(): Observable<AdvanceTable[]> {
    return  this.httpClient.get<AdvanceTable[]>(this.API_URL);
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