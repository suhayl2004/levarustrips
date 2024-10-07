export default class Adapter {
    loader: any;
    reader: any;
    config: any;
    parent: any;
  
    constructor(loader: any, config: any, parent: any) {
      this.loader = loader;
      this.config = config;
      this.parent = parent;
    }
  
    public async upload(): Promise<any> {
      const value = await this.loader.file;
      this.parent.uploadedImageName = value.name; // Store the uploaded file name
      return this.read(value);
    }
  
    read(file: Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ default: reader.result });
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.onabort = () => {
          reject();
        };
        reader.readAsDataURL(file);
      });
    }
  
    abort() {
      if (this.reader) {
        this.reader.abort();
      }
    }
  }
  