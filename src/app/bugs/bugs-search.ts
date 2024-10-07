import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'assigneeSearch',
})
// export class assigneePipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.assignee?.toLowerCase().includes(searchText)
//         );
//     }
// }
export class assigneePipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return this.getUniqueItems(items);
        }
        
        searchText = searchText.toLowerCase();
        
        // Filter items based on search text and then remove duplicates
        const filteredItems = items.filter((item) =>
            item.assignee?.toLowerCase().includes(searchText)
        );
        
        return this.getUniqueItems(filteredItems);
    }
    private getUniqueItems(items: any[]): any[] {
        const uniqueItems = items.filter((item, index, self) =>
            index === self.findIndex((t) => t.assignee === item.assignee)
        );
        return uniqueItems;
    }
}
@Pipe({
    name: 'mnameSearch',
})
// export class mnamePipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.mname?.toLowerCase().includes(searchText)
//         );
//     }
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
    name: 'severitySearch',
})
// export class severityPipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.severity?.toLowerCase().includes(searchText)
//         );
//     }
// }
export class severityPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return this.getUniqueItems(items);
        }
        
        searchText = searchText.toLowerCase();
        
        // Filter items based on search text and then remove duplicates
        const filteredItems = items.filter((item) =>
            item.severity?.toLowerCase().includes(searchText)
        );
        
        return this.getUniqueItems(filteredItems);
    }
    private getUniqueItems(items: any[]): any[] {
        const uniqueItems = items.filter((item, index, self) =>
            index === self.findIndex((t) => t.severity === item.severity)
        );
        return uniqueItems;
    }
}
@Pipe({
    name: 'reqidSearch',
})
// export class reqidPipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.id?.toLowerCase().includes(searchText)
//         );
//     }
// }
export class reqidPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return this.getUniqueItems(items);
        }
        
        searchText = searchText.toLowerCase();
        
        // Filter items based on search text and then remove duplicates
        const filteredItems = items.filter((item) =>
            item.id?.toLowerCase().includes(searchText)
        );
        
        return this.getUniqueItems(filteredItems);
    }
    private getUniqueItems(items: any[]): any[] {
        const uniqueItems = items.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
        return uniqueItems;
    }
}
@Pipe({
    name: 'tcaseidSearch',
})
// export class tcaseidPipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.id?.toLowerCase().includes(searchText)
//         );
//     }
// }
export class tcaseidPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return this.getUniqueItems(items);
        }
        
        searchText = searchText.toLowerCase();
        
        // Filter items based on search text and then remove duplicates
        const filteredItems = items.filter((item) =>
            item.id?.toLowerCase().includes(searchText)
        );
        
        return this.getUniqueItems(filteredItems);
    }
    private getUniqueItems(items: any[]): any[] {
        const uniqueItems = items.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
        return uniqueItems;
    }
}
@Pipe({
    name: 'tscenarioidSearch',
})
// export class tscenarioidPipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.id?.toLowerCase().includes(searchText)
//         );
//     }
// }
export class tscenarioidPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return this.getUniqueItems(items);
        }
        
        searchText = searchText.toLowerCase();
        
        // Filter items based on search text and then remove duplicates
        const filteredItems = items.filter((item) =>
            item.id?.toLowerCase().includes(searchText)
        );
        
        return this.getUniqueItems(filteredItems);
    }
    private getUniqueItems(items: any[]): any[] {
        const uniqueItems = items.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
        return uniqueItems;
    }
}
@Pipe({
    name: 'statusSearch',
})
// export class statusPipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.status?.toLowerCase().includes(searchText)
//         );
//     }
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
    name: 'complexitySearch',
})
// export class complexityPipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.complexity?.toLowerCase().includes(searchText)
//         );
//     }
// }
export class complexityPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return this.getUniqueItems(items);
        }
        
        searchText = searchText.toLowerCase();
        
        // Filter items based on search text and then remove duplicates
        const filteredItems = items.filter((item) =>
            item.complexity?.toLowerCase().includes(searchText)
        );
        
        return this.getUniqueItems(filteredItems);
    }
    private getUniqueItems(items: any[]): any[] {
        const uniqueItems = items.filter((item, index, self) =>
            index === self.findIndex((t) => t.complexity === item.complexity)
        );
        return uniqueItems;
    }
}
@Pipe({
    name: 'prioritySearch',
})
// export class priorityPipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.priority?.toLowerCase().includes(searchText)
//         );
//     }
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
    name: 'frequencySearch',
})
// export class frequencyPipe implements PipeTransform {
//     transform(items: any[], searchText: string): any[] {
//         if (!items || !searchText) {
//             return items;
//         }
//         searchText = searchText.toLowerCase();
//         return items.filter((item) =>
//             item.frequency?.toLowerCase().includes(searchText)
//         );
//     }
// }
export class frequencyPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return this.getUniqueItems(items);
        }
        
        searchText = searchText.toLowerCase();
        
        // Filter items based on search text and then remove duplicates
        const filteredItems = items.filter((item) =>
            item.frequency?.toLowerCase().includes(searchText)
        );
        
        return this.getUniqueItems(filteredItems);
    }
    private getUniqueItems(items: any[]): any[] {
        const uniqueItems = items.filter((item, index, self) =>
            index === self.findIndex((t) => t.frequency === item.frequency)
        );
        return uniqueItems;
    }
}
