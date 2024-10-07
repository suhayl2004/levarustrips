import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'app/services/common.service';
@Component({
  selector: 'app-single-file-upload',
  templateUrl: './single-file-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SingleFileUploadComponent,
      multi: true,
    }
  ],
  styleUrl: './single-file-upload.component.scss'
})
export class SingleFileUploadComponent implements ControlValueAccessor, OnInit {
  constructor(private host: ElementRef<HTMLInputElement>,
    public Common: CommonService,
    private translateService: TranslateService) { }

    @Output() uploadProgressChanged = new EventEmitter<number>();
    @Output() fileUploadProgress = new EventEmitter<number>();
  public uploadedFiles: File[] = [];
  public uploadProgress: number[] = [];
  public filesSizeExceededLimit: boolean = false;
  public restrictFile: boolean = false;
  public totalFileSizeLimit = 10000 * 1024; // 10000 KB
  public filesExceededLimit: boolean = false;
  receivedAddBooleanValue!: boolean;
  receivedEditBooleanValue!: boolean;
  notsupportedFormats: any = [];
  supportedFormats: any = [];
  editFilesArray: any = [];
  getTranslation(key: string): string {
    return this.translateService.instant(key);
  }
   @Input() fileData: any;
   @Input() action: any;
   @Input() fileSize: any;
  fileDataArray: any;
  simulateFileUploadProgress(progress: number): void {
    this.fileUploadProgress.emit(progress);
  }
  ngOnInit(): void {
    // this.fileDataArray = this.fileData;
    // console.log(this.fileData);

    // if (typeof this.fileData === 'string') {
    //   this.fileDataArray = [{
    //     name: {
    //       name: this.fileData,  // Assuming fileData is the filename
    //       size: 0                    // If you have no file size, keep it 0 or handle appropriately
    //     }
    //   }];
    // } else if (Array.isArray(this.fileData)) {
    //   // If it's already an array, just assign it
    //   this.fileDataArray = this.fileData;
    // }
    // this.testuploadProgress = this.fileDataArray.map(() => 100);
    if(this.action !== 'add'){
      if (typeof this.fileData === 'string') {
      this.fileDataArray = [{
        name: {
          name: this.fileData,  // Assuming fileData is the filename
          size: 0 
          // size: this.fileSize    // NaN               // If you have no file size, keep it 0 or handle appropriately
        }
      }];
    } else if (Array.isArray(this.fileData)) {
      // If it's already an array, just assign it
      this.fileDataArray = this.fileData;
      console.log(this.fileSize);
      
    }
    
     this.testuploadProgress = this.fileDataArray.map(() => 100);
    }
    this.Common.editFiles$.subscribe((files) => {
      this.editFilesArray = files;
      console.log(this.editFilesArray);
      console.log(this.editFilesArray.length);
      console.log(this.adEditFilesArray);
    });
    this.receivedAddBooleanValue = this.Common.getAddBooleanValue();
    console.log(this.receivedAddBooleanValue);
    this.testMethod();
  }
  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    let totalFileSize = 0;
    const blockedExtensions = ['exe', 'bat', 'com', 'cmd', 'inf', 'ipa', 'osx', 'pif', 'run', 'wsh','pd'];
    // const allowedFormats = ['pdf', 'xlsx', 'xls', 'txt'];
    const allowedFormats = ['pdf', 'xlsx', 'xls', 'txt', 'csv', 'zip', 'mp3', 'mp4',
       'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'svg', 'doc', 'docx'];
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].size);
      totalFileSize += files[i].size;
      console.log(files[i].size);

      // Check file extension
      const fileNameParts = files[i].name.split('.');
      const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

      if (blockedExtensions.includes(fileExtension)) {
        this.restrictFile = true;
        this.supportedFormats = ` ${allowedFormats.join(', ')}`;
        console.log(this.notsupportedFormats);
        return;
      } else if (!allowedFormats.includes(fileExtension)) {
        this.restrictFile = true;
        this.supportedFormats = ` ${allowedFormats.join(', ')}`;
        console.log(this.notsupportedFormats);
        return;
      } else {
        this.restrictFile = false;
      }
    }
    if (totalFileSize > this.totalFileSizeLimit) {
      this.filesSizeExceededLimit = true;
      console.error('Total file size exceeds the limit of 10 MB!');
      return;
    }
    this.filesSizeExceededLimit = false;

    if (this.uploadedFiles.length + files.length > 1) {
      this.filesExceededLimit = true;
      console.log('Exceeded maximum allowed file of 1!');
      return;
    } else {
      this.filesExceededLimit = false;
    }

    const filesArray: any[] = [];
    for (let i = 0; i < files.length; i++) {
      filesArray.push({ name: files[i] });
    }

    console.log('Files in onFileChange:', filesArray); // Add this line for debugging

    // Send files to the service
    this.Common.setFiles(filesArray);


  // Reset previous files and progress
  this.uploadedFiles = [];
  this.uploadProgress = [];

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        this.uploadedFiles = [];
        this.uploadedFiles.push(file);
        this.uploadProgress.push(0); // Initialize progress to 0 for each file
        const progressIndex = this.uploadedFiles.length - 1;
        this.uploadFile(file, progressIndex);
        console.log(this.uploadedFiles);
      }
    }
  }
  getTestTitle(): string {
    if (this.adEditFilesArray.length === 0) {
      return 'No file chosen';
    } else if (this.adEditFilesArray.length === 1) {
      return this.adEditFilesArray[0].name.name;
    } else {
      return this.adEditFilesArray.map((file: any) => file.name.name).join('\n ');
    }
  }
//   testOnFileChange(event: any): void {
//     console.log(this.adEditFilesArray.length);
//     let filesEditStore: any[] = [];
//     this.Common.editFiles$.subscribe((filesEditReceived) => {
//       filesEditStore = filesEditReceived;
//       console.log(filesEditStore);
//     });
//     const files: FileList = event.target.files;
//     console.log(files);
//     let totalFileSize = 0;
//     const blockedExtensions = ['exe', 'bat', 'com', 'cmd', 'inf', 'ipa', 'osx', 'pif', 'run', 'wsh'];
//     // const allowedFormats = ['pdf', 'xlsx', 'xls', 'txt'];
//     const allowedFormats = ['pdf', 'xlsx', 'xls', 'txt', 'csv', 'zip', 'mp3', 'mp4',
//       'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'svg', 'doc', 'docx'];

//     for (let i = 0; i < files.length; i++) {
//       console.log(files[i].size);
//       totalFileSize += files[i].size;
//       console.log(files[i].size);

//       // Check file extension
//       const fileNameParts = files[i].name.split('.');
//       const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();

//       if (blockedExtensions.includes(fileExtension)) {
//         this.restrictFile = true;
//         this.supportedFormats = ` ${allowedFormats.join(', ')}`;
//         console.log(this.notsupportedFormats);
//         return;
//       } else if (!allowedFormats.includes(fileExtension)) {
//         this.restrictFile = true;
//         this.supportedFormats = ` ${allowedFormats.join(', ')}`;
//         console.log(this.notsupportedFormats);
//         return;
//       } else {
//         this.restrictFile = false;
//       }
//     }
//     if (this.adEditFilesArray.length + files.length > 1) {
//       this.filesExceededLimit = true;
//       console.log('Exceeded maximum allowed file of 1!');
//       return;
//     } else {
//       this.filesExceededLimit = false;
//     }
//     if (totalFileSize > this.totalFileSizeLimit) {
//       this.filesSizeExceededLimit = true;
//       console.error('Total file size exceeds the limit of 10 MB!');
//       return;
//     }
//     this.filesSizeExceededLimit = false;
//     const filesArray: any[] = [];
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       filesArray.push({ name: file });
//       console.log(filesArray);
//     }

//     console.log('Files in onFileChange:', filesArray); // Add this line for debugging
// // Reset previous files and progress
// this.adEditFilesArray = [];
// this.testuploadProgress = [];
//     // Send files to the service
//     this.Common.setFilesEdit(filesArray);
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];

//       if (file) {
//         if (file.size + this.counter > 10000000) {
//           this.filesSizeExceededLimit = true;
//           return;
//         } else {
//           this.testcounter += file.size;
//           this.adEditFilesArray.push({ name: file }, ...filesEditStore);
//           console.log(this.adEditFilesArray);
//           this.testuploadProgress.push(0);

//           // Call a function to upload the file and update progress
//           const progressIndex = this.adEditFilesArray.length - 1;
//           this.testuploadFile(file, progressIndex);
//         }
//       }
//     }
//   }

// testOnFileChange(event: any): void {
//   const files: FileList = event.target.files;
//   const allowedFormats = ['pdf', 'xlsx', 'xls', 'txt', 'csv', 'zip', 'mp3', 'mp4', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'svg', 'doc', 'docx'];

//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     const fileExtension = file.name.split('.').pop()?.toLowerCase();

//     if (!allowedFormats.includes(fileExtension || '')) {
//       console.error('Unsupported file format!');
//       return;
//     }

//     this.fileDataArray.push({ name: file });
//     this.testuploadProgress.push(0); // Add corresponding progress for the file
//     this.testuploadFile(file, this.fileDataArray.length - 1); // Upload the file
//   }
// }


testOnFileChange(event: any): void {
  const files: FileList = event.target.files;
  let totalFileSize = 0;
  const blockedExtensions = ['exe', 'bat', 'com', 'cmd', 'inf', 'ipa', 'osx', 'pif', 'run', 'wsh', 'pd'];
  const allowedFormats = ['pdf', 'xlsx', 'xls', 'txt', 'csv', 'zip', 'mp3', 'mp4', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'svg', 'doc', 'docx'];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    totalFileSize += file.size;

    // Validate file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (blockedExtensions.includes(fileExtension || '')) {
      this.restrictFile = true;
      console.error('Blocked file format!');
      return;
    } else if (!allowedFormats.includes(fileExtension || '')) {
      this.restrictFile = true;
      console.error('Unsupported file format!');
      return;
    } else {
      this.restrictFile = false;
    }
  }

  // Validate total file size
  if (totalFileSize > this.totalFileSizeLimit) {
    this.filesSizeExceededLimit = true;
    console.error('Total file size exceeds the limit!');
    return;
  }
  this.filesSizeExceededLimit = false;

  // Validate number of files
  if (this.fileDataArray.length + files.length > 1) {
    this.filesExceededLimit = true;
    console.error('Exceeded maximum allowed files of 1!');
    return;
  } else {
    this.filesExceededLimit = false;
  }

  // Process and upload each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    this.fileDataArray.push({ name: file });
    this.testuploadProgress.push(0); // Initialize progress for each file

    const progressIndex = this.fileDataArray.length - 1;
    this.testuploadFile(file, progressIndex); // Upload the file
  }
}

  adEditFilesArray: any = [];
  public testuploadProgress: number[] = [];
  counter: number = 0;
  testcounter: number = 0;
  testMethod() {
    this.receivedEditBooleanValue = this.Common.getEditBooleanValue();
    console.log(this.receivedEditBooleanValue);
    this.Common.adEditSingleFile$.subscribe((files: File[]) => {
      console.log(files);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          if (file.size + this.counter > 10000000) {
            this.filesSizeExceededLimit = true;
            return;
          } else {
            this.testcounter += file.size;
            this.adEditFilesArray.push(file);
            console.log(this.adEditFilesArray);
            this.testuploadProgress.push(100);

            // Call a function to upload the file and update progress
            const progressIndex = this.adEditFilesArray.length - 1;
            this.testuploadFile(file, progressIndex);
          }
        }
      }
    });
  }
  // testuploadFile(file: File, index: number): void {
  //   const simulateUpload = () => {
  //     const progressInterval = setInterval(() => {
  //       this.testuploadProgress[index] += Math.floor(Math.random() * 10);
  //       if (this.testuploadProgress[index] > 100) {
  //         this.testuploadProgress[index] = 100;
  //         clearInterval(progressInterval);
  //       }
  //       // Emit the progress value when it reaches 100
  //       if (this.testuploadProgress[index] === 100) {
  //         this.Common.emitUploadProgressChanged(100);
  //       }
  //        // Emit the progress value when it changes
  //        this.uploadProgressChanged.emit(this.testuploadProgress[index]);
  //     }, 300);
  //   };
  //   setTimeout(() => {
  //     simulateUpload();
  //   }, 300);
  // }

  testuploadFile(file: File, index: number): void {
    const simulateUpload = () => {
      const progressInterval = setInterval(() => {
        this.testuploadProgress[index] += Math.floor(Math.random() * 10);
        if (this.testuploadProgress[index] > 100) {
          this.testuploadProgress[index] = 100;
          clearInterval(progressInterval);
        }
      }, 300);
    };
    simulateUpload();
  }
  getTitle(): string {
    if (this.uploadedFiles.length === 0) {
      return 'No file chosen';
    } else if (this.uploadedFiles.length === 1) {
      return this.uploadedFiles[0].name;
    } else {
      return this.uploadedFiles.map(file => file.name).join('\n ');
    }
  }
  formatFileSize(size: number): string {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1048576) {
      return (size / 1024).toFixed(2) + ' KB';
    } else if (size < 1073741824) {
      return (size / 1048576).toFixed(2) + ' MB';
    } else {
      return (size / 1073741824).toFixed(2) + ' GB';
    }
  }
  @Output() fileRemoved = new EventEmitter<void>();
  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.uploadProgress.splice(index, 1);
    this.filesExceededLimit = false;
    this.fileRemoved.emit(); 
    this.Common.emitFileRemoved();
  }
  testfileCount: number = 0;
  // testremoveFile(index: number): void {
  //   this.adEditFilesArray.splice(index, 1);
  //   this.testuploadProgress.splice(index, 1);
  //   this.uploadedFiles.splice(index, 1);
  //   this.uploadProgress.splice(index, 1);
  //   this.filesExceededLimit = false;

  //   this.fileDataArray.splice(index, 1); // Remove the file
  //   this.testuploadProgress.splice(index, 1); // Remove corresponding progress
  //   this.fileRemoved.emit(); 
  //   this.Common.emitFileRemoved();
  //   console.log(this.adEditFilesArray.length);
  // }

  testremoveFile(index: number): void {
    this.fileDataArray.splice(index, 1);
    this.testuploadProgress.splice(index, 1);
    this.fileRemoved.emit();  // Emit removal event if needed
  }
  uploadFile(file: File, index: number): void {
    const simulateUpload = () => {
      const progressInterval = setInterval(() => {
        this.uploadProgress[index] += Math.floor(Math.random() * 10);
        if (this.uploadProgress[index] > 100) {
          this.uploadProgress[index] = 100;
          clearInterval(progressInterval);
        }
        // Emit the progress value when it reaches 100
        if (this.uploadProgress[index] === 100) {
          this.Common.emitUploadProgressChanged(100);
        }
            // Emit the progress value when it changes
            this.uploadProgressChanged.emit(this.uploadProgress[index]);
      }, 300);
    };
    setTimeout(() => {
      simulateUpload();
    }, 300);
  }
  onChange!: Function;
  public file: File | null = null;
  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
  }
  writeValue(value: null) {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }
  registerOnChange(fn: Function) {
    this.onChange = fn;
  }
  registerOnTouched(fn: Function) {
  }
}
