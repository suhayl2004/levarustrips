import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'companySearch',
})
export class companyPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.company?.toLowerCase().includes(searchText)
        );
    }
}

