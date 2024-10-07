import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AdvanceTable } from './header.model';
@Injectable({
  providedIn: 'root'
})
export class HeaderService extends UnsubscribeOnDestroyAdapter {
  isTblLoading = true;
  dataChange: BehaviorSubject<AdvanceTable[]> = new BehaviorSubject<
    AdvanceTable[]
  >([]);
  constructor(private httpClient: HttpClient) {
    super();
  }
  private shouldDisplayReq = new BehaviorSubject<boolean>(false);
  shouldDisplayReq$ = this.shouldDisplayReq.asObservable();
  setShouldDisplayReq(shouldDisplay: boolean) {
    this.shouldDisplayReq.next(shouldDisplay);
  }
  private shouldDisplayTestCycles = new BehaviorSubject<boolean>(false);
  shouldDisplayTestCycles$ = this.shouldDisplayTestCycles.asObservable();
  setshouldDisplayTestCycles(shouldDisplay: boolean) {
    this.shouldDisplayTestCycles.next(shouldDisplay);
  }
  private shouldDisplayTestScenarios = new BehaviorSubject<boolean>(false);
  shouldDisplayTestScenarios$ = this.shouldDisplayTestScenarios.asObservable();
  setshouldDisplayTestScenarios(shouldDisplay: boolean) {
    this.shouldDisplayTestScenarios.next(shouldDisplay);
  }
  private shouldDisplayTestCases = new BehaviorSubject<boolean>(false);
  shouldDisplayTestCases$ = this.shouldDisplayTestCases.asObservable();
  setshouldDisplayTestCases(shouldDisplay: boolean) {
    this.shouldDisplayTestCases.next(shouldDisplay);
  }
  private shouldDisplayBugs = new BehaviorSubject<boolean>(false);
  shouldDisplayBugs$ = this.shouldDisplayBugs.asObservable();
  setshouldDisplayBugs(shouldDisplay: boolean) {
    this.shouldDisplayBugs.next(shouldDisplay);
  }
  private shouldDisplayUmanagement = new BehaviorSubject<boolean>(false);
  shouldDisplayUmanagement$ = this.shouldDisplayUmanagement.asObservable();
  setshouldDisplayUmanagement(shouldDisplay: boolean) {
    this.shouldDisplayUmanagement.next(shouldDisplay);
  }
  private shouldDisplayCmanagement = new BehaviorSubject<boolean>(false);
  shouldDisplayCmanagement$ = this.shouldDisplayCmanagement.asObservable();
  setshouldDisplayCmanagement(shouldDisplay: boolean) {
    this.shouldDisplayCmanagement.next(shouldDisplay);
  }
  private shouldDisplayProjects = new BehaviorSubject<boolean>(false);
  shouldDisplayProjects$ = this.shouldDisplayProjects.asObservable();
  setshouldDisplayProjects(shouldDisplay: boolean) {
    this.shouldDisplayProjects.next(shouldDisplay);
  }

}
