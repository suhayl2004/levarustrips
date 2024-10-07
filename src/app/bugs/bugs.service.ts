import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, forkJoin, map } from "rxjs";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { UnsubscribeOnDestroyAdapter } from "@shared";
import { AdvanceTable } from "./bugs.model";

@Injectable()
export class BugsService extends UnsubscribeOnDestroyAdapter {
  // private readonly API_URL = "assets/data/bugs.json";
  // private readonly API_URL = 'http://192.168.1.200:8000/companies/{company_id}/projects/{project_id}/bugs';
  // private readonly API_URL = 'http://192.168.1.200:8000/companies/1/projects/2/bugs';
  // private readonly API_URL = "http://192.168.1.200:8000/bugs";
  // private readonly API_URL = "https://b3f1-210-18-182-133.ngrok-free.app/bugs/";
  private readonly API_URL = "https://a87d-210-18-182-133.ngrok-free.app/bugs";
  // private readonly API_URL = "http://levarustrips.great-site.net/bugs";
  isTblLoading = true;
  dataChange: BehaviorSubject<AdvanceTable[]> = new BehaviorSubject<
    AdvanceTable[]
  >([]);
  data$: Observable<AdvanceTable[]> = this.dataChange.asObservable();
  dialogData!: AdvanceTable;
  constructor(private http: HttpClient) {
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
    getAllBugs(): Observable<AdvanceTable[]> {
      return this.http.get<AdvanceTable[]>(this.API_URL);
    }

  getBugDashboard(): Observable<AdvanceTable[]> {
    return this.http.get<AdvanceTable[]>(this.API_URL);
  }

  // Method to send POST request to add a new bug
  addBug(bugData: any): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post<any>(this.API_URL, bugData, { headers });
  }

  editBug(bugData: any): Observable<any> {
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    // Extract the id from the bugData object
    const url = `${this.API_URL}/${bugData.bug_id}`; // Use id from bugData to construct the URL

    return this.http.put<any>(url, bugData, { headers });
  }

  // Use Subject to trigger events
  private bugAddedSource = new Subject<void>();

  // Observable to listen for events
  bugAdded$ = this.bugAddedSource.asObservable();

  // Emit an event when a bug is added
  emitBugAdded() {
    this.bugAddedSource.next();
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

  // deleteAdvanceTable(id: number): void {}
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
