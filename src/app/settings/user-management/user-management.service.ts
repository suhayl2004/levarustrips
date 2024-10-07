import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { AdvanceTable } from './user-management.model';

@Injectable()
export class UserManagementService extends UnsubscribeOnDestroyAdapter {
  //  API_URL = 'assets/data/user-management.json';
  // private readonly API_URL = 'http://192.168.1.200:8000/users';
  // API_URL = 'http://192.168.1.200:8000/users';
  // API_URL = "https://b3f1-210-18-182-133.ngrok-free.app/users/";
   API_URL = "https://a87d-210-18-182-133.ngrok-free.app/users/";
  // API_URL = "http://levarustrips.great-site.net/users/";
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
          console.log(data);
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
