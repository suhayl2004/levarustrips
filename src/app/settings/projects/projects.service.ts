import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AdvanceTable } from './projects.model';

@Injectable()
export class ProjectsService extends UnsubscribeOnDestroyAdapter {
  private readonly API_URL = 'assets/data/projects.json';
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
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllAdvanceTables(): void {
    this.subs.sink = this.httpClient
      .get<AdvanceTable[]>(this.API_URL)
      .subscribe({
        next: (data) => {
          console.log(data);
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
