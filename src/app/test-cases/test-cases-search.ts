import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'mnameSearch',
})
export class mnamePipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.mname?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'prioritySearch',
})
export class priorityPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.priority?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'tctypeSearch',
})
export class tctypePipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.tctype?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'uservalueSearch',
})
export class uservaluePipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.uservalue?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'costSearch',
})
export class costPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.cost?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'statusSearch',
})
export class statusPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.status?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'restatusSearch',
})
export class restatusPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.restatus?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'reviewerSearch',
})
export class reviewerPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.reviewer?.toLowerCase().includes(searchText)
        );
    }
}
@Pipe({
    name: 'dsprintSearch',
})
export class dsprintPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items || !searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();
        return items.filter((item) =>
            item.dsprint?.toLowerCase().includes(searchText)
        );
    }
}
