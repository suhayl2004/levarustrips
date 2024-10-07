import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpClient: HttpClient) { }

  private _uploadProgressChanged = new BehaviorSubject<number>(0);
  uploadProgressChanged = this._uploadProgressChanged.asObservable();

  emitUploadProgressChanged(progress: number) {
    this._uploadProgressChanged.next(progress);
  }

  private _fileRemoved = new BehaviorSubject<void>(undefined);
  fileRemoved: Observable<void> = this._fileRemoved.asObservable();

  emitFileRemoved() {
    this._fileRemoved.next();
  }


  private filesSubject = new BehaviorSubject<File[]>([]);
  files$ = this.filesSubject.asObservable();

  private confirmationSubject = new BehaviorSubject<boolean>(false);
  confirmation$ = this.confirmationSubject.asObservable();

  setFiles(files: File[]) {
    this.filesSubject.next(files);
    this.confirmationSubject.next(true); // Notify that files have been set
  }

  private adEditSingleFile = new BehaviorSubject<File[]>([]);
  adEditSingleFile$ = this.adEditSingleFile.asObservable();

  private adEditSingleConfirmation = new BehaviorSubject<boolean>(false);
  adEditSingleConfirmation$ = this.adEditSingleConfirmation.asObservable();

  setAdEditSingleFile(files: File[]) {
    this.adEditSingleFile.next(files);
    this.adEditSingleConfirmation.next(true); // Notify that files have been set
  }

  private addbooleanValue!: boolean;
  setAddBooleanValue(value: boolean): void {
    this.addbooleanValue = value;
  }
  getAddBooleanValue(): boolean {
    return this.addbooleanValue;
  }

  private editbooleanValue!: boolean;
  setEditBooleanValue(value: boolean): void {
    this.editbooleanValue = value;
  }
  getEditBooleanValue(): boolean {
    return this.editbooleanValue;
  }

  private editFilesSubject = new BehaviorSubject<File[]>([]);
  editFiles$ = this.editFilesSubject.asObservable();

  private editConfirmationSubject = new BehaviorSubject<boolean>(false);
  editConfirmation$ = this.editConfirmationSubject.asObservable();

  setEditFiles(files: File[]) {
    this.editFilesSubject.next(files);
    this.editConfirmationSubject.next(true); // Notify that files have been set
  }

  private filesSubjectEdit = new BehaviorSubject<File[]>([]);
  filesEdit$ = this.filesSubjectEdit.asObservable();

  private confirmationSubjectEdit = new BehaviorSubject<boolean>(false);
  confirmationEdit$ = this.confirmationSubjectEdit.asObservable();

  setFilesEdit(files: File[]) {
    this.filesSubjectEdit.next(files);
    this.confirmationSubjectEdit.next(true); // Notify that files have been set
  }



}
