import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, forkJoin, map } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "@shared";
import { AdvanceTable } from "./req.model";

@Injectable()
export class RequirementsService extends UnsubscribeOnDestroyAdapter {
  // private readonly API_URL = 'assets/data/req.json';
  // private readonly API_URL = "http://192.168.1.200:8000/requirements";
  // private readonly API_URL = "https://b3f1-210-18-182-133.ngrok-free.app/requirements/";
  private readonly API_URL = "https://a87d-210-18-182-133.ngrok-free.app/requirements";
  // private readonly API_URL = "http://levarustrips.great-site.net/requirements";
  isTblLoading = true;
  dataChange: BehaviorSubject<AdvanceTable[]> = new BehaviorSubject<
    AdvanceTable[]
  >([]);
  data$: Observable<AdvanceTable[]> = this.dataChange.asObservable();
  dialogData!: AdvanceTable;
  constructor(private http: HttpClient) {
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
    this.subs.sink = this.http.get<AdvanceTable[]>(this.API_URL).subscribe({
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
    // Fetch all existing bugs
    getAllReq(): Observable<AdvanceTable[]> {
      return this.http.get<AdvanceTable[]>(this.API_URL);
    }
  refreshData(): void {
    // Method to manually refresh data
    this.getAllAdvanceTables();
  }
  getReqDashboard(): Observable<AdvanceTable[]> {
    return this.http.get<AdvanceTable[]>(this.API_URL);
  }
  // Method to send POST request to add a new bug
  addReq(reqData: any): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<any>(this.API_URL, reqData, { headers });
  }

  editReq(reqData: any): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    // Extract the id from the reqData object
    const url = `${this.API_URL}/${reqData.req_id}`; // Use id from reqData to construct the URL

    return this.http.put<any>(url, reqData, { headers });
  }

  // Use Subject to trigger events
  private reqAddedSource = new Subject<void>();

  // Observable to listen for events
  reqAdded$ = this.reqAddedSource.asObservable();

  // Emit an event when a req is added
  emitReqAdded() {
    this.reqAddedSource.next();
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

  // deleteAdvanceTable(id: number): void { }
  deleteAdvanceTable(id: number): Observable<any> {
    console.log(id);
    const url = `${this.API_URL}/${id}`; // Modify as per your API endpoint
    return this.http.delete(url); // Make sure to return the Observable from HTTP DELETE
  }
  deleteMultipleAdvanceTables(ids: number[]): Observable<any> {
    const deleteRequests = ids.map((id) =>
      this.http.delete(`${this.API_URL}/${id}`)
    );
    return forkJoin(deleteRequests); // Executes all DELETE requests concurrently
  }
}
