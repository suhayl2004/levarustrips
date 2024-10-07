import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "mnameSearch",
})
// export class mnamePipe implements PipeTransform {
//   transform(items: any[], searchText: string): any[] {
//     if (!items || !searchText) {
//       return items;
//     }
//     searchText = searchText.toLowerCase();
//     return items.filter((item) =>
//       item.mname?.toLowerCase().includes(searchText)
//     );
//   }
// }
export class mnamePipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
      if (!items || !searchText) {
          return this.getUniqueItems(items);
      }
      
      searchText = searchText.toLowerCase();
      
      // Filter items based on search text and then remove duplicates
      const filteredItems = items.filter((item) =>
          item.mname?.toLowerCase().includes(searchText)
      );
      
      return this.getUniqueItems(filteredItems);
  }
  private getUniqueItems(items: any[]): any[] {
      const uniqueItems = items.filter((item, index, self) =>
          index === self.findIndex((t) => t.mname === item.mname)
      );
      return uniqueItems;
  }
}
@Pipe({
  name: "prioritySearch",
})
// export class priorityPipe implements PipeTransform {
//   transform(items: any[], searchText: string): any[] {
//     if (!items || !searchText) {
//       return items;
//     }
//     searchText = searchText.toLowerCase();
//     return items.filter((item) =>
//       item.priority?.toLowerCase().includes(searchText)
//     );
//   }
// }
export class priorityPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
      if (!items || !searchText) {
          return this.getUniqueItems(items);
      }
      
      searchText = searchText.toLowerCase();
      
      // Filter items based on search text and then remove duplicates
      const filteredItems = items.filter((item) =>
          item.priority?.toLowerCase().includes(searchText)
      );
      
      return this.getUniqueItems(filteredItems);
  }
  private getUniqueItems(items: any[]): any[] {
      const uniqueItems = items.filter((item, index, self) =>
          index === self.findIndex((t) => t.priority === item.priority)
      );
      return uniqueItems;
  }
}
@Pipe({
  name: "statusSearch",
})
// export class statusPipe implements PipeTransform {
//   transform(items: any[], searchText: string): any[] {
//     if (!items || !searchText) {
//       return items;
//     }
//     searchText = searchText.toLowerCase();
//     return items.filter((item) =>
//       item.status?.toLowerCase().includes(searchText)
//     );
//   }
// }
export class statusPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
      if (!items || !searchText) {
          return this.getUniqueItems(items);
      }
      
      searchText = searchText.toLowerCase();
      
      // Filter items based on search text and then remove duplicates
      const filteredItems = items.filter((item) =>
          item.status?.toLowerCase().includes(searchText)
      );
      
      return this.getUniqueItems(filteredItems);
  }
  private getUniqueItems(items: any[]): any[] {
      const uniqueItems = items.filter((item, index, self) =>
          index === self.findIndex((t) => t.status === item.status)
      );
      return uniqueItems;
  }
}
@Pipe({
  name: "reviewerSearch",
})
// export class reviewerPipe implements PipeTransform {
//   transform(items: any[], searchText: string): any[] {
//     if (!items || !searchText) {
//       return items;
//     }
//     searchText = searchText.toLowerCase();
//     return items.filter((item) =>
//       item.reviewer?.toLowerCase().includes(searchText)
//     );
//   }
// }
export class reviewerPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
      if (!items || !searchText) {
          return this.getUniqueItems(items);
      }
      
      searchText = searchText.toLowerCase();
      
      // Filter items based on search text and then remove duplicates
      const filteredItems = items.filter((item) =>
          item.reviewer?.toLowerCase().includes(searchText)
      );
      
      return this.getUniqueItems(filteredItems);
  }
  private getUniqueItems(items: any[]): any[] {
      const uniqueItems = items.filter((item, index, self) =>
          index === self.findIndex((t) => t.reviewer === item.reviewer)
      );
      return uniqueItems;
  }
}
