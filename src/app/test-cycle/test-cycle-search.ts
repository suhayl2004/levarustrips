import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ownerSearch',
})
export class ownerPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.owner?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'testtypeSearch',
})
export class testtypePipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.testtype?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'sprintSearch',
})
export class sprintPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.sprint?.toLowerCase().includes(searchText)
        );
    }
}