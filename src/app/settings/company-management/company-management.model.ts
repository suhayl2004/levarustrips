export class AdvanceTable {
    id: number;
    cname: string;
    ccode: string;

    constructor(advanceTable: AdvanceTable) {
        {
            this.id = advanceTable.id || this.getRandomID();
            this.cname = advanceTable.cname || '';
            this.ccode = advanceTable.ccode || '';
        }
    }
    public getRandomID(): number {
        const S4 = () => {
            return ((1 + Math.random()) * 0x10000) | 0;
        };
        return S4() + S4();
    }
}
